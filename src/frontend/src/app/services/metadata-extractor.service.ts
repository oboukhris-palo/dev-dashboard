import { Injectable, inject } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Repository } from '@domain/repository.model';
import { FileSystemService } from './filesystem.service';
import { ReadmeParserService } from './readme-parser.service';
import { TechStackDetectorService } from './tech-stack-detector.service';

/** README filenames to look for (in order of preference) */
const README_FILENAMES = ['README.md', 'readme.md', 'Readme.md', 'ReadMe.md'] as const;

/**
 * Metadata Extractor Service
 *
 * Orchestrates the extraction of repository metadata:
 *  - Repository name (from directory path)
 *  - README existence check
 *  - Description (delegated to ReadmeParserService)
 *
 * @epic REPO-001 - Repository Discovery & Scanning
 * @story REPO-001-US-002 - Extract Repository Metadata
 * @layer Layer 2 - Core Services
 */
@Injectable({
  providedIn: 'root'
})
export class MetadataExtractorService {
  private readonly fileSystem = inject(FileSystemService);
  private readonly parser = inject(ReadmeParserService);
  private readonly techDetector = inject(TechStackDetectorService);

  /**
   * Extract the repository name from its absolute path.
   * Delegates to FileSystemService for path parsing.
   *
   * @param path - Absolute path to repository directory
   * @returns Directory name as repository name
   */
  extractName(path: string): string {
    return this.fileSystem.getDirectoryName(path);
  }

  /**
   * Read and parse a README file to extract a plain-text description.
   * Tries multiple filename variations (README.md, readme.md, etc.).
   * Returns empty string when no README file is found or is unreadable.
   *
   * @param repoPath - Absolute path to repository directory
   * @returns Observable<string> - Plain-text description or empty string
   */
  extractDescription(repoPath: string): Observable<string> {
    return this.tryReadmeFiles(repoPath).pipe(
      map(content => this.parser.parseDescription(content)),
      catchError(() => of(''))
    );
  }

  /**
   * Try to read README files in order of preference.
   * Returns the first successful read or throws if none found.
   *
   * @param repoPath - Absolute path to repository directory
   * @returns Observable<string> - README file content
   * @private
   */
  private tryReadmeFiles(repoPath: string): Observable<string> {
    const tryNext = (index: number): Observable<string> => {
      if (index >= README_FILENAMES.length) {
        return throwError(() => new Error('No README file found'));
      }

      const readmePath = `${repoPath}/${README_FILENAMES[index]}`;
      return this.fileSystem.readFile(readmePath).pipe(
        catchError(() => tryNext(index + 1))
      );
    };

    return tryNext(0);
  }

  /**
   * Enrich a Repository object with extracted metadata.
   * Tries multiple README filename variations in order of preference.
   * Preserves all existing fields and adds description + readmeExists.
   * Never throws — returns the original repository on failure.
   *
   * @param repo - Repository to enrich
   * @returns Observable<Repository> - Enriched repository object
   */
  extractMetadata(repo: Repository): Observable<Repository> {
    return this.tryReadmeFiles(repo.path).pipe(
      switchMap(content => {
        const description = this.parser.parseDescription(content);
        return this.techDetector.detectTechStack(repo.path).pipe(
          map(techStack => ({
            ...repo,
            description,
            readmeExists: true,
            techStack
          }))
        );
      }),
      catchError(() =>
        this.techDetector.detectTechStack(repo.path).pipe(
          map(techStack => ({
            ...repo,
            description: '',
            readmeExists: false,
            techStack
          })),
          catchError(() => of({
            ...repo,
            description: '',
            readmeExists: false,
            techStack: []
          }))
        )
      )
    );
  }
}
