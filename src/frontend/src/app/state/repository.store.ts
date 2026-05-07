import { createStore, select, withProps } from '@ngneat/elf';
import { withEntities, selectAllEntities, setEntities, updateEntities, deleteEntities } from '@ngneat/elf-entities';
import { Repository, ScanResult } from '@domain/index';

/**
 * Repository State Interface
 * 
 * Defines the shape of the repository state.
 * 
 * @layer Layer 3 - State Management
 */
export interface RepositoryState {
  /**
   * Whether a scan is currently in progress
   */
  loading: boolean;

  /**
   * Last scan result metadata
   */
  lastScan: ScanResult | null;

  /**
   * Error message if scan failed
   */
  error: string | null;
}

/**
 * Repository Store
 * 
 * Elf store for managing repository state.
 * Uses entity management for repositories and props for metadata.
 * 
 * @epic REPO-001 - Repository Discovery & Scanning
 * @story REPO-001-US-001 - Scan Workspace Directories
 * @layer Layer 3 - State Management
 * 
 * @tdd-instructions
 * Store logic should be tested through RepositoryStateService.
 * Focus tests on state transitions and side effects.
 */
export const repositoryStore = createStore(
  { name: 'repositories' },
  withEntities<Repository>(),
  withProps<RepositoryState>({
    loading: false,
    lastScan: null,
    error: null
  })
);

/**
 * Repository Store Selectors
 * 
 * Observable selectors for accessing repository state.
 */

/**
 * Select all repositories
 */
export const repositories$ = repositoryStore.pipe(selectAllEntities());

/**
 * Select loading state
 */
export const loading$ = repositoryStore.pipe(select(state => state.loading));

/**
 * Select error state
 */
export const error$ = repositoryStore.pipe(select(state => state.error));

/**
 * Select last scan metadata
 */
export const lastScan$ = repositoryStore.pipe(select(state => state.lastScan));

/**
 * Select repositories count
 */
export const repositoriesCount$ = repositoryStore.pipe(
  selectAllEntities(),
  select(repos => repos.length)
);
