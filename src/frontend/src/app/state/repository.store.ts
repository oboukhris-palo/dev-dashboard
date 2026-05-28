import { createStore, withProps, select } from '@ngneat/elf';
import { withEntities, selectAllEntities, updateEntities } from '@ngneat/elf-entities';
import { Repository, ScanResult } from '@domain/index';
import { ProjectPhase } from '@domain/phase.enum';
import { ProjectStatus } from '@domain/status.enum';

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

  /**
   * Currently editing repository ID
   */
  editingId: string | null;

  /**
   * Edit values cache for each repository
   */
  editValues: Record<string, string>;
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
    error: null,
    editingId: null,
    editValues: {}
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

/**
 * Store Update Actions - Metadata Management
 */

/**
 * Update repository description
 */
export function updateDescription(id: string, description: string): void {
  const trimmed = description.trim().substring(0, 500);
  repositoryStore.update(updateEntities(id, { metadata: { description: trimmed } }));
  repositoryStore.update((state) => ({
    ...state,
    editingId: null,
    editValues: { ...state.editValues }
  }));
}

/**
 * Update repository phase
 */
export function updatePhase(id: string, phase: ProjectPhase): void {
  repositoryStore.update(updateEntities(id, { metadata: { phase } }));
}

/**
 * Update repository status
 */
export function updateStatus(id: string, status: ProjectStatus): void {
  repositoryStore.update(updateEntities(id, { metadata: { status } }));
}

/**
 * Set editing mode
 */
export function setEditing(id: string | null, value: string = ''): void {
  if (id) {
    repositoryStore.update((state) => ({
      ...state,
      editingId: id,
      editValues: { ...state.editValues, [id]: value }
    }));
  } else {
    repositoryStore.update((state) => ({
      ...state,
      editingId: null
    }));
  }
}

/**
 * Select editing state
 */
export const editingId$ = repositoryStore.pipe(select(state => state.editingId));
export const editValues$ = repositoryStore.pipe(select(state => state.editValues));
