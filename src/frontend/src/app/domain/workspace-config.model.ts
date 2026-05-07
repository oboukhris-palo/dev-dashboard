/**
 * Workspace Configuration Model
 * 
 * Defines the workspace directories to scan for repositories.
 * 
 * @epic REPO-001 - Repository Discovery & Scanning
 * @story REPO-001-US-001 - Scan Workspace Directories
 * @layer Layer 1 - Domain Models
 */
export interface WorkspaceConfig {
  /**
   * List of workspace directory paths to scan
   */
  workspacePaths: string[];

  /**
   * Patterns to exclude from scanning (e.g., 'node_modules', '.git')
   */
  excludePatterns?: string[];

  /**
   * Maximum depth for recursive directory traversal
   */
  maxDepth?: number;
}

/**
 * Default workspace configuration for Dev-Dashboard
 */
export const DEFAULT_WORKSPACE_CONFIG: WorkspaceConfig = {
  workspacePaths: [
    '/Users/oboukhris-palo/workspace',
    '/Users/oboukhris-palo/Documents/workspace'
  ],
  excludePatterns: [
    'node_modules',
    '.git',
    'dist',
    'build',
    'target',
    'bin',
    'obj',
    '.vscode',
    '.idea'
  ],
  maxDepth: 5
};
