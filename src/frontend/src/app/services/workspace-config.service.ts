import { Injectable } from '@angular/core';
import { WorkspaceConfig, DEFAULT_WORKSPACE_CONFIG } from '@domain/workspace-config.model';
import { Observable, of } from 'rxjs';

/**
 * Workspace Config Service
 * 
 * Manages workspace configuration (which directories to scan).
 * Stores configuration in localStorage for persistence.
 * 
 * @epic REPO-001 - Repository Discovery & Scanning
 * @story REPO-001-US-001 - Scan Workspace Directories
 * @layer Layer 2 - Core Services
 * 
 * @tdd-instructions
 * 1. Write failing tests for each method (RED phase)
 * 2. Implement minimal code to pass tests (GREEN phase)
 * 3. Refactor for quality (REFACTOR phase)
 */
@Injectable({
  providedIn: 'root'
})
export class WorkspaceConfigService {

  private readonly STORAGE_KEY = 'dev-dashboard-workspace-config';

  constructor() { }

  /**
   * Get current workspace configuration
   * Returns default config if none exists in storage
   * 
   * @returns Observable<WorkspaceConfig> - Current configuration
   * 
   * @todo RED: Write test for first load (should return default config)
   * @todo RED: Write test for subsequent load (should return saved config)
   * @todo GREEN: Implement localStorage retrieval
   * @todo REFACTOR: Add validation for loaded config
   */
  getConfig(): Observable<WorkspaceConfig> {
    // TODO: Implement config retrieval
    // 1. Try to load from localStorage
    // 2. If not found, return DEFAULT_WORKSPACE_CONFIG
    // 3. Validate loaded config structure
    return of(DEFAULT_WORKSPACE_CONFIG);
  }

  /**
   * Save workspace configuration to localStorage
   * 
   * @param config - Configuration to save
   * @returns Observable<void> - Completes when saved
   * 
   * @todo RED: Write test for successful save
   * @todo RED: Write test for invalid config (should throw)
   * @todo GREEN: Implement localStorage save
   * @todo REFACTOR: Add config validation
   */
  saveConfig(config: WorkspaceConfig): Observable<void> {
    // TODO: Implement config save
    // 1. Validate config (non-empty workspacePaths)
    // 2. Serialize to JSON
    // 3. Save to localStorage with STORAGE_KEY
    throw new Error('Not implemented');
  }

  /**
   * Reset configuration to defaults
   * 
   * @returns Observable<void> - Completes when reset
   * 
   * @todo RED: Write test for reset
   * @todo GREEN: Implement reset (remove from localStorage)
   */
  resetConfig(): Observable<void> {
    // TODO: Implement config reset
    // 1. Remove STORAGE_KEY from localStorage
    // 2. Return Observable.of(undefined)
    throw new Error('Not implemented');
  }

  /**
   * Add a workspace path to configuration
   * 
   * @param path - Path to add
   * @returns Observable<WorkspaceConfig> - Updated configuration
   * 
   * @todo RED: Write test for adding new path
   * @todo RED: Write test for duplicate path (should not add)
   * @todo GREEN: Implement path addition
   */
  addWorkspacePath(path: string): Observable<WorkspaceConfig> {
    // TODO: Implement path addition
    // 1. Load current config
    // 2. Check if path already exists
    // 3. Add path if not duplicate
    // 4. Save updated config
    // 5. Return updated config
    throw new Error('Not implemented');
  }

  /**
   * Remove a workspace path from configuration
   * 
   * @param path - Path to remove
   * @returns Observable<WorkspaceConfig> - Updated configuration
   * 
   * @todo RED: Write test for removing existing path
   * @todo RED: Write test for removing non-existing path (should be no-op)
   * @todo GREEN: Implement path removal
   */
  removeWorkspacePath(path: string): Observable<WorkspaceConfig> {
    // TODO: Implement path removal
    // 1. Load current config
    // 2. Filter out the specified path
    // 3. Save updated config
    // 4. Return updated config
    throw new Error('Not implemented');
  }
}
