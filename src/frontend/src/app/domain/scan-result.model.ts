import { Repository } from './repository.model';

/**
 * Scan Result Model
 * 
 * Represents the result of a workspace scan operation.
 * 
 * @epic REPO-001 - Repository Discovery & Scanning
 * @story REPO-001-US-001 - Scan Workspace Directories
 * @layer Layer 1 - Domain Models
 */
export interface ScanResult {
  /**
   * List of discovered repositories
   */
  repositories: Repository[];

  /**
   * Total number of repositories found
   */
  totalCount: number;

  /**
   * Scan duration in milliseconds
   */
  scanDurationMs: number;

  /**
   * Timestamp when the scan was completed
   */
  scannedAt: Date;

  /**
   * List of workspace paths that were scanned
   */
  scannedPaths: string[];

  /**
   * Any errors encountered during scanning
   */
  errors?: ScanError[];
}

/**
 * Scan Error Model
 * 
 * Represents an error that occurred during repository scanning.
 */
export interface ScanError {
  /**
   * Path where the error occurred
   */
  path: string;

  /**
   * Error message
   */
  message: string;

  /**
   * Error code (e.g., 'PERMISSION_DENIED', 'PATH_NOT_FOUND')
   */
  code?: string;
}
