import { promises as fs } from 'fs';
import * as path from 'path';

/**
 * Technology marker files.
 * Maps each technology name to the marker files that indicate its presence.
 * Files prefixed with '*' are treated as glob patterns (extension match).
 */
const TECH_MARKERS: Record<string, string[]> = {
  'TypeScript': ['tsconfig.json'],
  'Angular': ['angular.json'],
  '.NET': ['*.csproj', '*.sln'],
  'Java': ['pom.xml', 'build.gradle'],
  'Node.js': ['package.json'],
  'Python': ['requirements.txt', 'pyproject.toml', 'setup.py']
};

/**
 * Tech Stack Detector Service
 *
 * Detects the technology stack of a repository by checking for the presence
 * of well-known marker files (e.g., package.json → Node.js, pom.xml → Java).
 *
 * @epic REPO-001 - Repository Discovery & Scanning
 * @story REPO-001-US-003 - Detect Technology Stack
 * @layer Layer 2 - Core Services
 */
export class TechStackDetectorService {

  /**
   * Detect the technology stack of a repository.
   *
   * Checks for marker files in root and common subdirectories.
   * Returns a sorted list of detected technologies.
   *
   * @param repoPath - Absolute path to the repository root
   * @returns Promise<string[]> - Sorted array of detected technology names
   */
  async detectTechStack(repoPath: string): Promise<string[]> {
    const detectedTechs: string[] = [];
    
    // Directories to check for marker files
    const searchPaths = [
      repoPath,                            // Root
      path.join(repoPath, 'src'),         // src/
      path.join(repoPath, 'src', 'frontend'), // src/frontend/
      path.join(repoPath, 'src', 'backend'),  // src/backend/
      path.join(repoPath, 'frontend'),    // frontend/
      path.join(repoPath, 'backend')      // backend/
    ];

    for (const [tech, markers] of Object.entries(TECH_MARKERS)) {
      // Check all search paths for this technology
      let detected = false;
      for (const searchPath of searchPaths) {
        if (await this.checkTechMarkers(searchPath, markers)) {
          detected = true;
          break;
        }
      }
      if (detected) {
        detectedTechs.push(tech);
      }
    }

    return detectedTechs.sort();
  }

  /**
   * Check if any marker files for a given technology exist in the repo.
   *
   * @param repoPath - Absolute path to repository root
   * @param markers - List of marker filenames or glob patterns
   * @returns Promise<boolean>
   * @private
   */
  private async checkTechMarkers(
    repoPath: string,
    markers: string[]
  ): Promise<boolean> {
    for (const marker of markers) {
      if (marker.startsWith('*')) {
        // Glob pattern (e.g., '*.csproj')
        if (await this.checkGlobPattern(repoPath, marker)) {
          return true;
        }
      } else {
        // Exact filename
        if (await this.checkFileExists(path.join(repoPath, marker))) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Check if a specific file exists at the given absolute path.
   *
   * @param filePath - Absolute file path to check
   * @returns Promise<boolean>
   */
  private async checkFileExists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check if any file matching the glob pattern exists in the directory.
   * Currently supports simple extension patterns like '*.csproj'.
   *
   * @param repoPath - Directory path
   * @param pattern - Glob pattern (e.g., '*.csproj')
   * @returns Promise<boolean>
   */
  private async checkGlobPattern(repoPath: string, pattern: string): Promise<boolean> {
    try {
      const files = await fs.readdir(repoPath);
      const extension = pattern.substring(1); // Remove '*'
      return files.some(file => file.endsWith(extension));
    } catch {
      return false;
    }
  }
}
