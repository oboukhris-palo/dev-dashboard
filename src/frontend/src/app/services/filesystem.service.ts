import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';

/**
 * Mock filesystem data for browser environment
 * In production, this would be replaced with Electron/Tauri native APIs
 */
interface MockDirectory {
  path: string;
  subdirectories: string[];
  files: Record<string, string>;
  hasGit: boolean;
}

/**
 * Workspace path constants
 */
const WORKSPACE_PATHS = {
  PRIMARY: '/Users/oboukhris-palo/workspace',
  SECONDARY: '/Users/oboukhris-palo/Documents/workspace'
} as const;

/**
 * FileSystem Service
 * 
 * Provides abstraction layer for filesystem operations.
 * In browser environment, this will use mock data.
 * In Electron/Tauri, this will use native filesystem APIs.
 * 
 * @epic REPO-001 - Repository Discovery & Scanning
 * @story REPO-001-US-001 - Scan Workspace Directories
 * @layer Layer 2 - Core Services
 * 
 * @implementation
 * Uses mock data for browser environment. Replace with Electron/Tauri FS APIs for production.
 * Mock data includes sample repositories in both workspace directories.
 */
@Injectable({
  providedIn: 'root'
})
export class FileSystemService {

  /**
   * Mock filesystem data
   * Simulates the two workspace directories with sample repositories
   */
  private readonly mockFilesystem: Map<string, MockDirectory> = this.initializeMockData();

  constructor() { }

  /**
   * Initialize mock filesystem data
   * Separated for clarity and testability
   */
  private initializeMockData(): Map<string, MockDirectory> {
    return new Map<string, MockDirectory>([
      [WORKSPACE_PATHS.PRIMARY, {
        path: WORKSPACE_PATHS.PRIMARY,
        subdirectories: [
          `${WORKSPACE_PATHS.PRIMARY}/dev-dashboard`,
          `${WORKSPACE_PATHS.PRIMARY}/project-alpha`,
          `${WORKSPACE_PATHS.PRIMARY}/project-beta`
        ],
        files: {},
        hasGit: false
      }],
      [`${WORKSPACE_PATHS.PRIMARY}/dev-dashboard`, {
        path: `${WORKSPACE_PATHS.PRIMARY}/dev-dashboard`,
        subdirectories: [],
        files: {
          'README.md': '# Dev Dashboard\n\nLocal Angular Material SPA for managing code repositories.'
        },
        hasGit: true
      }],
      [`${WORKSPACE_PATHS.PRIMARY}/project-alpha`, {
        path: `${WORKSPACE_PATHS.PRIMARY}/project-alpha`,
        subdirectories: [],
        files: {
          'README.md': '# Project Alpha\n\nA sample Node.js project.'
        },
        hasGit: true
      }],
      [`${WORKSPACE_PATHS.PRIMARY}/project-beta`, {
        path: `${WORKSPACE_PATHS.PRIMARY}/project-beta`,
        subdirectories: [],
        files: {},
        hasGit: true
      }],
      [WORKSPACE_PATHS.SECONDARY, {
        path: WORKSPACE_PATHS.SECONDARY,
        subdirectories: [
          `${WORKSPACE_PATHS.SECONDARY}/legacy-app`,
          `${WORKSPACE_PATHS.SECONDARY}/not-a-repo`
        ],
        files: {},
        hasGit: false
      }],
      [`${WORKSPACE_PATHS.SECONDARY}/legacy-app`, {
        path: `${WORKSPACE_PATHS.SECONDARY}/legacy-app`,
        subdirectories: [],
        files: {
          'README.md': '# Legacy App\n\nOld Java application.'
        },
        hasGit: true
      }],
      [`${WORKSPACE_PATHS.SECONDARY}/not-a-repo`, {
        path: `${WORKSPACE_PATHS.SECONDARY}/not-a-repo`,
        subdirectories: [],
        files: {},
        hasGit: false
      }],
      ['/Users/oboukhris-palo/Documents', {
        path: '/Users/oboukhris-palo/Documents',
        subdirectories: [WORKSPACE_PATHS.SECONDARY],
        files: {},
        hasGit: false
      }],
      ['/empty/directory', {
        path: '/empty/directory',
        subdirectories: [],
        files: {},
        hasGit: false
      }]
    ]);
  }

  /**
   * Check if a directory exists
   * 
   * @param path - Absolute path to check
   * @returns Observable<boolean> - true if directory exists
   */
  directoryExists(path: string): Observable<boolean> {
    return of(this.mockFilesystem.has(path));
  }

  /**
   * List all subdirectories in a given directory
   * 
   * @param path - Absolute path to directory
   * @returns Observable<string[]> - Array of subdirectory paths
   */
  listDirectories(path: string): Observable<string[]> {
    const directory = this.mockFilesystem.get(path);
    
    if (!directory) {
      return throwError(() => new Error(`Directory not found: ${path}`));
    }
    
    return of(directory.subdirectories);
  }

  /**
   * Check if a directory contains a .git subdirectory
   * 
   * @param path - Absolute path to check
   * @returns Observable<boolean> - true if .git exists
   */
  isGitRepository(path: string): Observable<boolean> {
    const directory = this.mockFilesystem.get(path);
    return of(directory?.hasGit ?? false);
  }

  /**
   * Read file contents as text
   * 
   * @param path - Absolute path to file
   * @returns Observable<string> - File contents as UTF-8 string
   */
  readFile(path: string): Observable<string> {
    // Extract directory path and filename
    const lastSlashIndex = path.lastIndexOf('/');
    const directoryPath = path.substring(0, lastSlashIndex);
    const filename = path.substring(lastSlashIndex + 1);
    
    const directory = this.mockFilesystem.get(directoryPath);
    
    if (!directory || !directory.files[filename]) {
      return throwError(() => new Error(`File not found: ${path}`));
    }
    
    return of(directory.files[filename]);
  }

  /**
   * Extract directory name from full path
   * 
   * @param path - Full directory path
   * @returns string - Directory name
   */
  getDirectoryName(path: string): string {
    // Remove trailing slash if present
    const cleanPath = path.endsWith('/') || path.endsWith('\\') 
      ? path.slice(0, -1) 
      : path;
    
    // Extract last segment (works for both Unix and Windows paths)
    const segments = cleanPath.split(/[/\\]/);
    return segments[segments.length - 1];
  }
}
