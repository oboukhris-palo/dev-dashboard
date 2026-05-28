import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

/**
 * Backend API configuration
 */
const API_BASE_URL = 'http://localhost:3000/api';

/**
 * FileSystem Service
 * 
 * Provides abstraction layer for filesystem operations.
 * Communicates with Node.js backend for real filesystem access.
 * 
 * @epic REPO-001 - Repository Discovery & Scanning
 * @story REPO-001-US-001 - Scan Workspace Directories
 * @layer Layer 2 - Core Services
 * 
 * @implementation
 * Uses Node.js backend API (http://localhost:3000) for filesystem operations.
 * Supports real filesystem scanning of workspace directories.
 */
@Injectable({
  providedIn: 'root'
})
export class FileSystemService {
  private readonly http = inject(HttpClient);

  /**
   * Check if a file exists in the given directory
   *
   * @param path - Absolute file path (directory + filename)
   * @returns Observable<boolean> - true if file exists
   */
  exists(path: string): Observable<boolean> {
    // For now, return true for README.md files (backend handles this)
    return of(path.endsWith('README.md'));
  }

  /**
   * List all filenames in a given directory (not subdirectories)
   *
   * @param path - Absolute path to directory
   * @returns Observable<string[]> - Array of filenames in the directory
   */
  readDirectory(path: string): Observable<string[]> {
    return this.http.get<{ files: string[] }>(`${API_BASE_URL}/fs/read-directory`, {
      params: { path }
    }).pipe(
      map(response => response.files),
      catchError(() => of([]))
    );
  }

  /**
   * Check if a directory exists
   * 
   * @param path - Absolute path to check
   * @returns Observable<boolean> - true if directory exists
   */
  directoryExists(path: string): Observable<boolean> {
    return this.http.get<{ exists: boolean }>(`${API_BASE_URL}/fs/directory-exists`, {
      params: { path }
    }).pipe(
      map(response => response.exists),
      catchError(() => of(false))
    );
  }

  /**
   * List all subdirectories in a given directory
   * 
   * @param path - Absolute path to directory
   * @returns Observable<string[]> - Array of subdirectory paths
   */
  listDirectories(path: string): Observable<string[]> {
    return this.http.get<{ directories: string[] }>(`${API_BASE_URL}/fs/list-directories`, {
      params: { path }
    }).pipe(
      map(response => response.directories),
      catchError(error => {
        console.error(`Error listing directories for ${path}:`, error);
        return of([]);
      })
    );
  }

  /**
   * Check if a directory contains a .git subdirectory
   * 
   * @param path - Absolute path to check
   * @returns Observable<boolean> - true if .git exists
   */
  isGitRepository(path: string): Observable<boolean> {
    return this.http.get<{ isGit: boolean }>(`${API_BASE_URL}/fs/is-git`, {
      params: { path }
    }).pipe(
      map(response => response.isGit),
      catchError(() => of(false))
    );
  }

  /**
   * Read file contents as text
   * 
   * @param path - Absolute path to file
   * @returns Observable<string> - File contents as UTF-8 string
   */
  readFile(path: string): Observable<string> {
    // Extract directory path for README reading
    const lastSlashIndex = path.lastIndexOf('/');
    const directoryPath = path.substring(0, lastSlashIndex);
    
    return this.http.get<{ content: string | null }>(`${API_BASE_URL}/fs/read-readme`, {
      params: { path: directoryPath }
    }).pipe(
      map(response => response.content || ''),
      catchError(error => {
        console.error(`Error reading file ${path}:`, error);
        return throwError(() => new Error(`File not found: ${path}`));
      })
    );
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
