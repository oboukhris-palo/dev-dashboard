import { promises as fs } from 'fs';
import * as path from 'path';
import { Repository, ScanResult, WorkspaceConfig, ScanError } from '../models/repository.model';
import { MetadataExtractorService } from './metadata-extractor.service';

/**
 * Repository Scanner Service
 * 
 * Core service for discovering git repositories in workspace directories.
 * Implements recursive directory traversal with performance optimizations.
 * 
 * @epic REPO-001 - Repository Discovery & Scanning
 * @story REPO-001-US-001 - Scan Workspace Directories
 * @layer Layer 2 - Core Services
 */
export class RepositoryScannerService {
  private readonly metadataExtractor = new MetadataExtractorService();

  /**
   * Scan all configured workspace directories for git repositories
   * 
   * @param config - Workspace configuration
   * @returns Promise<ScanResult> - Scan results with repositories and metadata
   */
  async scanWorkspaces(config: WorkspaceConfig): Promise<ScanResult> {
    const startTime = Date.now();
    const allErrors: ScanError[] = [];
    const allRepositories: Repository[] = [];

    // Scan each workspace separately to handle permission errors gracefully
    for (const workspacePath of config.workspacePaths) {
      try {
        // Check if workspace path is accessible
        await fs.access(workspacePath);

        const repos = await this.scanDirectory(workspacePath, config, 0, allErrors);
        allRepositories.push(...repos);

      } catch (error: any) {
        console.error(`Cannot access workspace ${workspacePath}:`, error.message);
        allErrors.push({
          path: workspacePath,
          message: `Cannot access workspace: ${error.message}`,
          code: error.code || 'EACCESS',
          severity: 'warning'
        });
      }
    }

    // Enrich repositories with metadata (parallel)
    const enrichedRepos = await Promise.all(
      allRepositories.map(repo => this.metadataExtractor.extractMetadata(repo))
    );

    // Sort alphabetically
    enrichedRepos.sort((a, b) => 
      a.name.toLowerCase().localeCompare(b.name.toLowerCase())
    );

    const scanDurationMs = Date.now() - startTime;

    return {
      repositories: enrichedRepos,
      totalCount: enrichedRepos.length,
      scanDurationMs,
      scannedAt: new Date(),
      scannedPaths: config.workspacePaths,
      errors: allErrors
    };
  }

  /**
   * Scan a single directory for git repositories (recursive)
   * 
   * @param dirPath - Directory path to scan
   * @param config - Workspace configuration (for exclude patterns)
   * @param depth - Current recursion depth
   * @param errors - Array to collect errors
   * @returns Promise<Repository[]> - Discovered repositories
   */
  private async scanDirectory(
    dirPath: string,
    config: WorkspaceConfig,
    depth: number,
    errors: ScanError[]
  ): Promise<Repository[]> {
    const MAX_DEPTH = 5;
    const repositories: Repository[] = [];

    // Stop if max depth reached
    if (depth >= MAX_DEPTH) {
      return repositories;
    }

    // Check if path should be excluded
    const shouldExclude = config.excludePatterns.some(pattern => 
      dirPath.includes(pattern)
    );
    if (shouldExclude) {
      return repositories;
    }

    try {
      // Check if current directory is a git repo
      const isGit = await this.isGitRepository(dirPath);

      if (isGit) {
        // Found a git repository - create basic repo object
        const name = path.basename(dirPath);
        repositories.push({
          id: dirPath,
          name,
          path: dirPath,
          description: '',
          techStack: [],
          phase: 'Unknown',
          status: 'Unknown',
          lastScanned: new Date().toISOString()
        });

        // Don't scan subdirectories of git repos
        return repositories;
      }

      // Not a git repo - scan subdirectories
      const subdirs = await this.listDirectories(dirPath);

      for (const subdir of subdirs) {
        const subRepos = await this.scanDirectory(subdir, config, depth + 1, errors);
        repositories.push(...subRepos);
      }

    } catch (error: any) {
      console.error(`Error scanning ${dirPath}:`, error.message);
      errors.push({
        path: dirPath,
        message: error.message,
        code: error.code
      });
    }

    return repositories;
  }

  /**
   * Check if a directory is a git repository
   * 
   * @param dirPath - Directory path to check
   * @returns Promise<boolean>
   */
  private async isGitRepository(dirPath: string): Promise<boolean> {
    try {
      const gitPath = path.join(dirPath, '.git');
      const stat = await fs.stat(gitPath);
      return stat.isDirectory();
    } catch {
      return false;
    }
  }

  /**
   * Get list of subdirectories in a directory
   * 
   * @param dirPath - Directory path
   * @returns Promise<string[]>
   */
  private async listDirectories(dirPath: string): Promise<string[]> {
    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true });
      return entries
        .filter(entry => entry.isDirectory())
        .map(entry => path.join(dirPath, entry.name));
    } catch (error) {
      console.error(`Error reading directory ${dirPath}:`, (error as Error).message);
      return [];
    }
  }
}
