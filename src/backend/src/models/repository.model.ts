/**
 * Repository model
 */
export interface Repository {
  id: string;
  name: string;
  path: string;
  description: string;
  techStack: string[];
  phase: string;
  status: string;
  lastScanned: string;
  readmeExists?: boolean;
}

/**
 * Workspace configuration
 */
export interface WorkspaceConfig {
  workspacePaths: string[];
  excludePatterns: string[];
}

/**
 * Scan error details
 */
export interface ScanError {
  path: string;
  message: string;
  code?: string;
  severity?: 'error' | 'warning';
}

/**
 * Scan result
 */
export interface ScanResult {
  repositories: Repository[];
  totalCount: number;
  scanDurationMs: number;
  scannedAt: Date;
  scannedPaths: string[];
  errors: ScanError[];
}
