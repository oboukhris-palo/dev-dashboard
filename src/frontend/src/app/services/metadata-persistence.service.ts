import { Injectable, inject } from '@angular/core';
import { Repository, RepositoryMetadata } from '@domain/index';
import { repositoryStore, repositoriesCount$ } from '@state/repository.store';
import { takeUntil, Subject } from 'rxjs';

/**
 * Metadata persistence storage schema
 */
export interface StoredMetadata {
  [repositoryId: string]: RepositoryMetadata;
}

const STORAGE_KEY = 'dev-dashboard-metadata';

@Injectable({
  providedIn: 'root'
})
export class MetadataPersistenceService {
  private destroy$ = new Subject<void>();

  constructor() {
    this.initializeFromStorage();
    this.setupAutoSave();
  }

  /**
   * Load metadata from localStorage and merge with repositories
   */
  private initializeFromStorage(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const metadata: StoredMetadata = JSON.parse(stored);
        // Metadata will be applied to repositories when they're loaded
        this.cachedMetadata = metadata;
      }
    } catch (error) {
      console.error('Error loading metadata from storage:', error);
    }
  }

  private cachedMetadata: StoredMetadata = {};

  /**
   * Setup auto-save when repositories or metadata change
   */
  private setupAutoSave(): void {
    // Auto-save when repository state changes
    repositoriesCount$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.persistMetadata());
  }

  /**
   * Persist all metadata to localStorage
   */
  persistMetadata(): void {
    try {
      const state = repositoryStore.getValue();
      const metadata: StoredMetadata = {};

      // Extract metadata from all repositories
      // state.entities is an object { [id]: repository }, not an array
      Object.values(state.entities).forEach((repo) => {
        if (repo && repo.metadata) {
          metadata[repo.id] = repo.metadata;
        }
      });

      localStorage.setItem(STORAGE_KEY, JSON.stringify(metadata));
    } catch (error) {
      console.error('Error persisting metadata:', error);
    }
  }

  /**
   * Load metadata for a specific repository
   */
  loadMetadata(repositoryId: string): RepositoryMetadata | undefined {
    return this.cachedMetadata[repositoryId];
  }

  /**
   * Get all stored metadata
   */
  getAllMetadata(): StoredMetadata {
    return { ...this.cachedMetadata };
  }

  /**
   * Clear all stored metadata
   */
  clearMetadata(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
      this.cachedMetadata = {};
    } catch (error) {
      console.error('Error clearing metadata:', error);
    }
  }

  /**
   * Recover metadata if data loss occurred
   */
  recoverMetadata(): StoredMetadata {
    this.initializeFromStorage();
    return this.cachedMetadata;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
