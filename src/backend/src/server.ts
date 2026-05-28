import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import { promises as fs } from 'fs';
import * as path from 'path';
import { WorkspaceConfig } from './models/repository.model';
import { RepositoryScannerService } from './services/repository-scanner.service';

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

// Enable CORS for Angular frontend
app.use(cors({
  origin: ['http://localhost:4200', 'http://localhost:8080'],
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(express.json());

// Initialize services
const repositoryScanner = new RepositoryScannerService();

/**
 * Load workspace paths from environment variable or use defaults
 * Format: WORKSPACE_PATHS=/path1,/path2,/path3
 */
const getWorkspacePaths = (): string[] => {
  if (process.env.WORKSPACE_PATHS) {
    const paths = process.env.WORKSPACE_PATHS.split(',').map(p => p.trim()).filter(p => p.length > 0);
    if (paths.length > 0) {
      console.log('📁 Loaded workspace paths from environment:', paths);
      return paths;
    }
  }
  
  // Fallback to defaults if no env var or empty
  const defaultPaths = [
    '/Users/oboukhris-palo/workspace',
    '/Users/oboukhris-palo/Documents/workspace'
  ];
  console.log('⚠️  No WORKSPACE_PATHS configured. Using defaults:', defaultPaths);
  console.log('💡 Tip: Copy .env.example to .env and configure your paths');
  return defaultPaths;
};

/**
 * Load exclude patterns from environment variable or use defaults
 * Format: EXCLUDE_PATTERNS=pattern1,pattern2,pattern3
 */
const getExcludePatterns = (): string[] => {
  if (process.env.EXCLUDE_PATTERNS) {
    const patterns = process.env.EXCLUDE_PATTERNS.split(',').map(p => p.trim()).filter(p => p.length > 0);
    if (patterns.length > 0) {
      return patterns;
    }
  }
  
  // Fallback to defaults
  return [
    'node_modules',
    '.git',
    'dist',
    'build',
    'target',
    '.vscode',
    '.idea'
  ];
};

// Workspace configuration loaded from environment or defaults
const DEFAULT_CONFIG: WorkspaceConfig = {
  workspacePaths: getWorkspacePaths(),
  excludePatterns: getExcludePatterns()
};

/**
 * API Routes
 */

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: '2.0.0-typescript'
  });
});

// Get workspace configuration
app.get('/api/config', (req: Request, res: Response) => {
  res.json(DEFAULT_CONFIG);
});

// Scan workspaces for repositories
app.get('/api/repos/scan', async (req: Request, res: Response) => {
  try {
    const result = await repositoryScanner.scanWorkspaces(DEFAULT_CONFIG);
    res.json(result);
  } catch (error) {
    console.error('Scan error:', error);
    res.status(500).json({
      error: 'Scan failed',
      message: (error as Error).message,
      repositories: [],
      totalCount: 0,
      scanDurationMs: 0,
      scannedAt: new Date(),
      scannedPaths: [],
      errors: [{ path: 'unknown', message: (error as Error).message }]
    });
  }
});

// Check if path is a git repository
app.get('/api/fs/is-git', async (req: Request, res: Response) => {
  try {
    const dirPath = req.query.path as string;
    
    if (!dirPath) {
      return res.status(400).json({ error: 'Missing path parameter' });
    }

    // Check if .git directory exists
    const gitPath = path.join(dirPath, '.git');
    try {
      const stats = await fs.stat(gitPath);
      res.json({ isGit: stats.isDirectory() });
    } catch {
      res.json({ isGit: false });
    }
  } catch (error) {
    console.error('is-git error:', error);
    res.status(500).json({ error: 'Failed to check git status', isGit: false });
  }
});

// List directories in a path
app.get('/api/fs/list-directories', async (req: Request, res: Response) => {
  try {
    const requestedPath = req.query.path as string;
    
    if (!requestedPath) {
      return res.status(400).json({ error: 'Missing path parameter' });
    }

    // Resolve to absolute path
    let absolutePath: string | undefined;
    
    if (path.isAbsolute(requestedPath)) {
      // Already absolute path
      absolutePath = requestedPath;
    } else {
      // Relative path - try to find in workspaces
      const workspaces = DEFAULT_CONFIG.workspacePaths;
      
      for (const workspace of workspaces) {
        const candidate = path.join(workspace, requestedPath);
        try {
          await fs.access(candidate);
          absolutePath = candidate;
          break;
        } catch {
          // Try next workspace
          continue;
        }
      }
      
      if (!absolutePath) {
        return res.status(404).json({ 
          error: 'Directory not found in any workspace',
          directories: [] 
        });
      }
    }

    // Read directory contents
    const entries = await fs.readdir(absolutePath, { withFileTypes: true });
    
    // Filter only directories (exclude hidden and node_modules)
    const directories = entries
      .filter(entry => entry.isDirectory())
      .filter(entry => !entry.name.startsWith('.') && entry.name !== 'node_modules')
      .map(entry => entry.name)
      .sort();

    res.json({ directories });
  } catch (error) {
    console.error('list-directories error:', error);
    res.status(500).json({ 
      error: 'Failed to list directories', 
      message: (error as Error).message,
      directories: [] 
    });
  }
});

// Read README file from a repository
app.get('/api/fs/read-readme', async (req: Request, res: Response) => {
  try {
    const dirPath = req.query.path as string;
    
    if (!dirPath) {
      return res.status(400).json({ error: 'Missing path parameter' });
    }

    // Try different README file variations
    const readmeVariations = ['README.md', 'README.MD', 'readme.md', 'README', 'Readme.md'];
    
    for (const readmeFile of readmeVariations) {
      try {
        const readmePath = path.join(dirPath, readmeFile);
        const content = await fs.readFile(readmePath, 'utf-8');
        res.json({ content, found: true });
        return;
      } catch {
        // Try next variation
        continue;
      }
    }

    // No README found
    res.json({ content: '', found: false });
  } catch (error) {
    console.error('read-readme error:', error);
    res.status(500).json({ 
      error: 'Failed to read README', 
      message: (error as Error).message,
      content: '',
      found: false 
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log('\n✅ Dev Dashboard Backend (TypeScript)');
  console.log(`   Server running on http://localhost:${PORT}`);
  console.log('   Ready to scan repositories!');
  console.log(`   Test: curl http://localhost:${PORT}/api/repos/scan`);
  console.log('\n📁 Configured workspace paths:');
  DEFAULT_CONFIG.workspacePaths.forEach((path, index) => {
    console.log(`   ${index + 1}. ${path}`);
  });
  console.log('\n💡 To configure different paths, edit src/backend/.env\n');
});
