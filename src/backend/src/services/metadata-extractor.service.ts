import { promises as fs } from 'fs';
import * as path from 'path';
import { Repository } from '../models/repository.model';
import { ReadmeParserService } from './readme-parser.service';
import { TechStackDetectorService } from './tech-stack-detector.service';

/** README filenames to look for (in order of preference) */
const README_FILENAMES = ['README.md', 'readme.md', 'Readme.md', 'ReadMe.md'] as const;

/**
 * Metadata Extractor Service
 *
 * Orchestrates the extraction of repository metadata:
 *  - Repository name (from directory path)
 *  - README existence check and description extraction
 *  - Technology stack detection
 *  - Phase detection (from docs structure)
 *  - Status detection (from git activity)
 *
 * @epic REPO-001 - Repository Discovery & Scanning
 * @story REPO-001-US-002 - Extract Repository Metadata
 * @layer Layer 2 - Core Services
 */
export class MetadataExtractorService {
  private readonly readmeParser = new ReadmeParserService();
  private readonly techDetector = new TechStackDetectorService();

  /**
   * Extract the repository name from its absolute path.
   *
   * @param repoPath - Absolute path to repository directory
   * @returns Directory name as repository name
   */
  extractName(repoPath: string): string {
    return path.basename(repoPath);
  }

  /**
   * Read and parse a README file to extract a plain-text description.
   * Tries multiple filename variations (README.md, readme.md, etc.).
   * Returns empty string when no README file is found or is unreadable.
   *
   * @param repoPath - Absolute path to repository directory
   * @returns Promise<string> - Plain-text description or empty string
   */
  async extractDescription(repoPath: string): Promise<string> {
    const content = await this.tryReadmeFiles(repoPath);
    if (!content) return '';
    return this.readmeParser.parseDescription(content);
  }

  /**
   * Try to read README files in order of preference.
   * Returns the first successful read or null if none found.
   *
   * @param repoPath - Absolute path to repository directory
   * @returns Promise<string | null> - README file content or null
   * @private
   */
  private async tryReadmeFiles(repoPath: string): Promise<string | null> {
    for (const filename of README_FILENAMES) {
      try {
        const readmePath = path.join(repoPath, filename);
        const content = await fs.readFile(readmePath, 'utf-8');
        return content;
      } catch {
        // Try next variant
        continue;
      }
    }
    return null;
  }

  /**
   * Detect project phase from directory structure (Gene2 framework phases).
   *
   * @param repoPath - Absolute path to repository directory
   * @returns Promise<string> - Detected phase or 'Unknown'
   */
  async detectPhase(repoPath: string): Promise<string> {
    try {
      const files = await fs.readdir(repoPath);

      // Check for docs folder
      if (!files.includes('docs')) {
        // No docs folder - check if src/ exists
        if (files.includes('src')) {
          return 'Implementation';
        }
        return 'Planning';
      }

      // Check docs subfolder structure
      const docsPath = path.join(repoPath, 'docs');
      try {
        const docsDirs = await fs.readdir(docsPath, { withFileTypes: true });
        const dirNames = docsDirs
          .filter(d => d.isDirectory())
          .map(d => d.name);

        // Gene2 framework phases (check in reverse priority order)
        if (dirNames.includes('05-implementation')) return 'Implementation';
        if (dirNames.includes('04-planning')) return 'Planning';
        if (dirNames.includes('03-testing')) return 'Testing';
        if (dirNames.includes('02-architecture')) return 'Architecture';
        if (dirNames.includes('01-requirements')) return 'Requirements';
        if (dirNames.includes('00-assessment')) return 'Assessment';

        // Has docs but no specific phase
        return 'Requirements';

      } catch {
        return 'Requirements';
      }

    } catch (error) {
      console.error(`Error detecting phase in ${repoPath}:`, error);
      return 'Unknown';
    }
  }

  /**
   * Detect project status from git activity (based on last commit time).
   *
   * @param repoPath - Absolute path to repository directory
   * @returns Promise<string> - 'Active', 'Maintenance', 'Archived', or 'Unknown'
   */
  async detectStatus(repoPath: string): Promise<string> {
    try {
      // Check if .git directory exists first
      const gitDir = path.join(repoPath, '.git');
      try {
        await fs.access(gitDir);
      } catch {
        // Not a git repository
        return 'Unknown';
      }

      const gitHeadPath = path.join(gitDir, 'HEAD');
      const stat = await fs.stat(gitHeadPath);
      const lastModified = stat.mtime;
      const daysSinceModified = (Date.now() - lastModified.getTime()) / (1000 * 60 * 60 * 24);

      if (daysSinceModified < 7) return 'Active';
      if (daysSinceModified < 30) return 'Maintenance';
      return 'Archived';

    } catch (error) {
      // Silently return Unknown for non-critical errors
      return 'Unknown';
    }
  }

  /**
   * Enrich a Repository object with extracted metadata.
   * Adds description, tech stack, phase, and status.
   *
   * @param repo - Repository to enrich
   * @returns Promise<Repository> - Enriched repository object
   */
  async extractMetadata(repo: Repository): Promise<Repository> {
    const [description, techStack, phase, status] = await Promise.all([
      this.extractDescription(repo.path),
      this.techDetector.detectTechStack(repo.path),
      this.detectPhase(repo.path),
      this.detectStatus(repo.path)
    ]);

    return {
      ...repo,
      description,
      techStack,
      phase,
      status,
      readmeExists: description.length > 0
    };
  }
}
