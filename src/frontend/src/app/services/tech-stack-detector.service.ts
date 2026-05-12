import { Injectable, inject } from '@angular/core';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { FileSystemService } from './filesystem.service';

/**
 * Technology marker files.
 * Maps each technology name to the marker files that indicate its presence.
 * Files prefixed with '*' are treated as glob patterns (extension match).
 */
const TECH_MARKERS: Record<string, string[]> = {
  'Angular': ['angular.json'],
  '.NET': ['*.csproj'],
  'Java': ['pom.xml'],
  'Node.js': ['package.json'],
  'Python': ['requirements.txt', 'pyproject.toml']
};

/**
 * Tech Stack Detector Service
 *
 * Detects the technology stack of a repository by checking for the presence
 * of well-known marker files (e.g., package.json → Node.js, pom.xml → Java).
 *
 * All file checks run in parallel via forkJoin for performance.
 * Results are sorted alphabetically for consistent display.
 *
 * @epic REPO-001 - Repository Discovery & Scanning
 * @story REPO-001-US-003 - Detect Technology Stack
 * @layer Layer 2 - Core Services
 */
@Injectable({
  providedIn: 'root'
})
export class TechStackDetectorService {
  private readonly fileSystem = inject(FileSystemService);

  /**
   * Detect the technology stack of a repository.
   *
   * Checks for marker files in parallel and returns a sorted list of
   * detected technologies. Returns an empty array if none are detected.
   *
   * @param repoPath - Absolute path to the repository root
   * @returns Observable<string[]> - Sorted array of detected technology names
   */
  detectTechStack(repoPath: string): Observable<string[]> {
    const checks: Observable<string | null>[] = Object.entries(TECH_MARKERS).map(
      ([tech, markers]) => this.checkTechMarkers(repoPath, tech, markers)
    );

    return forkJoin(checks).pipe(
      map(results => results.filter((t): t is string => t !== null).sort()),
      catchError(() => of([]))
    );
  }

  /**
   * Check if any marker files for a given technology exist in the repo.
   * Returns the technology name if detected, or null if not.
   *
   * @param repoPath - Absolute path to repository root
   * @param tech - Technology name
   * @param markers - List of marker filenames or glob patterns
   * @returns Observable<string | null>
   * @private
   */
  private checkTechMarkers(
    repoPath: string,
    tech: string,
    markers: string[]
  ): Observable<string | null> {
    const markerChecks = markers.map(marker =>
      marker.startsWith('*')
        ? this.checkGlobPattern(repoPath, marker)
        : this.checkFileExists(`${repoPath}/${marker}`)
    );

    return forkJoin(markerChecks).pipe(
      map(results => results.some(Boolean) ? tech : null),
      catchError(() => of(null))
    );
  }

  /**
   * Check if a specific file exists at the given absolute path.
   * Returns false on any error (file not found, permission denied, etc.).
   *
   * @param path - Absolute file path to check
   * @returns Observable<boolean>
   */
  checkFileExists(path: string): Observable<boolean> {
    return this.fileSystem.exists(path).pipe(
      catchError(() => of(false))
    );
  }

  /**
   * Check if any file matching the glob pattern exists in the directory.
   * Currently supports simple extension patterns like '*.csproj'.
   * Returns false on any error.
   *
   * @param basePath - Absolute path to the directory to inspect
   * @param pattern - Glob pattern (e.g. '*.csproj')
   * @returns Observable<boolean>
   */
  checkGlobPattern(basePath: string, pattern: string): Observable<boolean> {
    const extension = pattern.replace('*', '');

    return this.fileSystem.readDirectory(basePath).pipe(
      map(files => files.some(f => f.endsWith(extension))),
      catchError(() => of(false))
    );
  }
}
