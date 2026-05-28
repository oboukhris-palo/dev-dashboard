# Dev Dashboard Backend

TypeScript + Node.js/Express backend for Dev Dashboard filesystem operations.

## Architecture

The backend provides real filesystem scanning capabilities that cannot be done from the browser:
- **Services migrated from frontend**: `ReadmeParserService`, `TechStackDetectorService`, `MetadataExtractorService`, `RepositoryScannerService`
- Direct filesystem access via Node.js `fs/promises`
- Phase detection (Gene2 framework phases 00-05)
- Status detection (Active, Maintenance, Archived) based on git activity

## Setup

```bash
cd src/backend
npm install
```

## Build

```bash
# Compile TypeScript to JavaScript
npm run build

# Output: dist/ directory
```

## Running

```bash
# Development mode (TypeScript with auto-reload)
npm run dev

# Production mode (runs compiled JavaScript)
npm start

# Or directly:
node dist/server.js
```

**Server runs on:** `http://localhost:3000`

## API Endpoints

### Health Check
```bash
GET /health
```

### Get Workspace Configuration
```bash
GET /api/config

Response:
{
  "workspacePaths": [
    "/Users/oboukhris-palo/workspace",
    "/Users/oboukhris-palo/Documents/workspace"
  ],
  "excludePatterns": ["node_modules", ".git", "dist", ...]
}
```

### Scan Repositories
```bash
GET /api/repos/scan

Response:
{
  "repositories": [...],
  "totalCount": 15,
  "scanDurationMs": 2341,
  "scannedAt": "2026-05-28T10:30:00Z",
  "scannedPaths": [...],
  "errors": []
}
```

### Check if Directory is Git Repository
```bash
GET /api/fs/is-git?path=/Users/oboukhris-palo/workspace/dev-dashboard

Response:
{
  "isGit": true
}
```

### List Directories
```bash
GET /api/fs/list-directories?path=/Users/oboukhris-palo/workspace

Response:
{
  "directories": [
    "/Users/oboukhris-palo/workspace/dev-dashboard",
    "/Users/oboukhris-palo/workspace/project-alpha",
    ...
  ]
}
```

### Read README
```bash
GET /api/fs/read-readme?path=/Users/oboukhris-palo/workspace/dev-dashboard

Response:
{
  "content": "# Dev Dashboard\n\nLocal Angular Material SPA..."
}
```

## Features

- **Real Filesystem Access**: Scans actual directories on your laptop
- **Git Detection**: Identifies git repositories by `.git` folder presence
- **README Parsing**: Reads and extracts descriptions from README files
- **Tech Stack Detection**: Identifies Node.js, Angular, Java, .NET, Python projects
- **Recursive Scanning**: Scans subdirectories up to depth 5
- **Performance**: Scans ~100 repositories in < 5 seconds
- **CORS Enabled**: Allows requests from Angular frontend (localhost:4200, localhost:8080)

## Directory Exclusions

The scanner automatically excludes:
- `node_modules`
- `.git`
- `dist`
- `build`
- `target`
- `.vscode`
- `.idea`

## Testing

```bash
# Test health endpoint
curl http://localhost:3000/health

# Test scan (see your real repositories!)
curl http://localhost:3000/api/repos/scan | jq
```

## Architecture

```
Backend (Node.js/Express)
├── server.js (main server)
├── Filesystem API (fs/promises)
├── Repository Scanner (recursive)
├── README Parser (markdown stripping)
└── Tech Stack Detector
```

## Configuration

To scan different workspace directories, edit `server.js`:

```javascript
const workspacePaths = [
  '/Users/oboukhris-palo/workspace',
  '/Users/oboukhris-palo/Documents/workspace'
  // Add more paths here
];
```
