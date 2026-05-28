import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, catchError, finalize } from 'rxjs/operators';
import { Repository, ScanResult } from '@domain/index';
import {
  repositoryStore,
  repositories$,
  loading$,
  error$,
  lastScan$,
  repositoriesCount$
} from './repository.store';
import { setEntities, updateEntities } from '@ngneat/elf-entities';

/**
 * Backend API configuration
 */
const API_BASE_URL = 'http://localhost:3000/api';

/**
 * Repository State Service
 * 
 * Facade service for managing repository state.
 * Provides high-level methods for components to interact with the store.
 * 
 * @epic REPO-001 - Repository Discovery & Scanning
 * @story REPO-001-US-001 - Scan Workspace Directories
 * @layer Layer 3 - State Management
 * 
 * @implementation
 * Calls Node.js backend API for repository scanning (services migrated to backend).
 */
@Injectable({
  providedIn: 'root'
})
export class RepositoryStateService {
  private readonly http = inject(HttpClient);

  // Expose selectors as public observables
  public readonly repositories$ = repositories$;
  public readonly loading$ = loading$;
  public readonly error$ = error$;
  public readonly lastScan$ = lastScan$;
  public readonly repositoriesCount$ = repositoriesCount$;

  /**
   * Trigger a full workspace scan
   * Updates store with scan results
   * Calls backend API for real filesystem scanning
   * 
   * @returns Observable<ScanResult> - Scan results
   */
  scanWorkspaces(): Observable<ScanResult> {
    // Set loading state
    repositoryStore.update((state) => ({
      ...state,
      loading: true,
      error: null
    }));

    return this.http.get<ScanResult>(`${API_BASE_URL}/repos/scan`).pipe(
      tap(result => {
        // Update store with scan results
        repositoryStore.update(
          setEntities(result.repositories),
          (state) => ({
            ...state,
            loading: false,
            lastScan: result
          })
        );
      }),
      catchError(error => {
        // Handle error
        repositoryStore.update((state) => ({
          ...state,
          loading: false,
          error: error.message || 'Failed to scan workspaces'
        }));
        throw error;
      }),
      finalize(() => {
        // Ensure loading is always set to false
        repositoryStore.update((state) => ({
          ...state,
          loading: false
        }));
      })
    );
  }

  /**
   * Update a single repository's metadata
   * 
   * @param id - Repository ID
   * @param changes - Partial repository updates
   * @returns void
   */
  updateRepository(id: string, changes: Partial<Repository>): void {
    repositoryStore.update(
      updateEntities(id, changes)
    );
  }

  /**
   * Clear all repositories from store
   * 
   * @returns void
   */
  clearRepositories(): void {
    repositoryStore.update(
      setEntities([]),
      (state) => ({
        ...state,
        lastScan: null,
        error: null
      })
    );
  }

  /**
   * Get current repository count (synchronous)
   * 
   * @returns number - Current repository count
   */
  getRepositoryCount(): number {
    return repositoryStore.query(state => state.entities ? Object.keys(state.entities).length : 0);
  }

  /**
   * Check if a repository exists by ID
   * 
   * @param id - Repository ID to check
   * @returns boolean - true if exists
   */
  repositoryExists(id: string): boolean {
    return repositoryStore.query(state => {
      return state.entities ? id in state.entities : false;
    });
  }
}
