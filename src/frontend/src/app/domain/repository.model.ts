/**
 * Repository Domain Model
 * 
 * Represents a git repository with its metadata.
 * This is the core domain entity for the Dev-Dashboard application.
 * 
 * @epic REPO-001 - Repository Discovery & Scanning
 * @layer Layer 1 - Domain Models
 */
export interface Repository {
  /**
   * Unique identifier (typically the full path)
   */
  id: string;

  /**
   * Repository name (directory name)
   */
  name: string;

  /**
   * Full absolute path to the repository
   */
  path: string;

  /**
   * Repository description (extracted from README.md)
   * Max 200 characters, stripped of markdown formatting
   */
  description?: string;

  /**
   * Detected technology stack (e.g., 'Node.js', 'Java', '.NET', 'Python', 'Angular')
   * @story REPO-001-US-003 - Detect Tech Stack
   */
  techStack?: string[];

  /**
   * Current phase (e.g., 'Planning', 'Development', 'Maintenance')
   * @story REPO-003-US-001 - Inline Edit Metadata
   */
  phase?: string;

  /**
   * Current status (e.g., 'Active', 'Archived', 'On Hold')
   * @story REPO-003-US-001 - Inline Edit Metadata
   */
  status?: string;

  /**
   * Last modified timestamp (from filesystem)
   */
  lastModified?: Date;

  /**
   * Whether this repository has uncommitted changes
   * @future Enhancement for git integration
   */
  hasUncommittedChanges?: boolean;
}
