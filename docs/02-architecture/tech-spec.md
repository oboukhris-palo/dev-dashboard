# Technical Specification

**Project:** Dev-Dashboard  
**Version:** 1.0.0  
**Date:** 2026-05-04

---

## 1. API Specification

### Base URL
```
http://localhost:3000/api
```

### Authentication
None (local use only)

---

### Endpoints

#### GET /repos
**Description:** Retrieve all repositories

**Response:** `200 OK`
```json
{
  "repos": [
    {
      "id": "abc-123",
      "name": "dev-dashboard",
      "path": "/Users/oboukhris-palo/workspace/dev-dashboard",
      "description": "Local Angular Material SPA",
      "techStack": ["Node.js", "Angular", "TypeScript"],
      "phase": "development",
      "status": "active",
      "lastScanned": "2026-05-04T10:30:00Z",
      "createdAt": "2026-05-04T10:00:00Z",
      "updatedAt": "2026-05-04T10:30:00Z"
    }
  ],
  "count": 1
}
```

---

#### GET /repos/scan
**Description:** Trigger workspace scan

**Response:** `200 OK`
```json
{
  "scanned": 23,
  "newRepos": 2,
  "updatedRepos": 5,
  "duration": "3.2s"
}
```

**Error:** `500 Internal Server Error`
```json
{
  "error": "Scan failed",
  "message": "Permission denied for /workspace"
}
```

---

#### GET /repos/:id
**Description:** Get single repository

**Response:** `200 OK`
```json
{
  "id": "abc-123",
  "name": "dev-dashboard",
  ...
}
```

**Error:** `404 Not Found`
```json
{
  "error": "Repository not found"
}
```

---

#### PUT /repos/:id
**Description:** Update repository metadata

**Request Body:**
```json
{
  "description": "Updated description",
  "phase": "testing",
  "status": "paused"
}
```

**Response:** `200 OK`
```json
{
  "id": "abc-123",
  "updatedAt": "2026-05-04T11:00:00Z",
  ...
}
```

**Validation Errors:** `400 Bad Request`
```json
{
  "error": "Invalid phase",
  "valid": ["planning", "development", "testing", "maintenance"]
}
```

---

#### DELETE /repos/:id
**Description:** Remove repository from list (does not delete files)

**Response:** `204 No Content`

**Error:** `404 Not Found`

---

## 2. Data Schema

### Repository
```typescript
interface Repository {
  id: string;                    // UUID v4
  name: string;                  // Required, max 255 chars
  path: string;                  // Absolute path, unique
  description: string;           // Optional, max 1000 chars
  techStack: string[];           // Array of detected technologies
  phase: ProjectPhase;           // Enum, default: "development"
  status: ProjectStatus;         // Enum, default: "active"
  lastScanned: Date;             // ISO 8601 string
  createdAt: Date;
  updatedAt: Date;
}

enum ProjectPhase {
  Planning = 'planning',
  Development = 'development',
  Testing = 'testing',
  Maintenance = 'maintenance'
}

enum ProjectStatus {
  Active = 'active',
  Paused = 'paused',
  Archived = 'archived'
}
```

### Storage Format (JSON)
**File:** `~/.dev-dashboard/repos.json`

```json
{
  "version": "1.0.0",
  "lastUpdated": "2026-05-04T11:00:00Z",
  "repos": [
    { "id": "...", "name": "...", ... }
  ]
}
```

---

## 3. Business Logic

### Repository Scanner

**Algorithm:**
1. Read configured workspace paths from `config.json`
2. Recursively scan each path (max depth: 3)
3. For each directory:
   - Check for `.git` folder
   - If exists, extract metadata
4. Parallel processing (Promise.all)
5. Deduplicate by path
6. Merge with existing repos (preserve manual edits)

**Tech Stack Detection:**
```javascript
function detectTechStack(repoPath) {
  const stack = [];
  if (fs.existsSync(path.join(repoPath, 'package.json'))) {
    stack.push('Node.js');
    const pkg = require(path.join(repoPath, 'package.json'));
    if (pkg.dependencies?.angular) stack.push('Angular');
    if (pkg.dependencies?.react) stack.push('React');
  }
  if (fs.existsSync(path.join(repoPath, 'pom.xml'))) {
    stack.push('Java', 'Maven');
  }
  if (fs.existsSync(path.join(repoPath, '*.csproj'))) {
    stack.push('.NET', 'C#');
  }
  if (fs.existsSync(path.join(repoPath, 'requirements.txt'))) {
    stack.push('Python');
  }
  return stack;
}
```

**README Parsing:**
```javascript
function extractDescription(repoPath) {
  const readmePath = path.join(repoPath, 'README.md');
  if (!fs.existsSync(readmePath)) return '';
  
  const content = fs.readFileSync(readmePath, 'utf8');
  const lines = content.split('\n');
  
  // Skip title lines (starting with #)
  const descStart = lines.findIndex(line => !line.startsWith('#') && line.trim());
  if (descStart === -1) return '';
  
  // Extract first paragraph
  const paragraph = lines.slice(descStart)
    .join('\n')
    .split('\n\n')[0];
  
  return paragraph.trim().substring(0, 500); // Max 500 chars
}
```

---

## 4. Frontend Services

### RepositoryService

```typescript
@Injectable({ providedIn: 'root' })
export class RepositoryService {
  private reposSubject = new BehaviorSubject<Repository[]>([]);
  public repos$ = this.reposSubject.asObservable();
  
  constructor(private http: HttpClient) {
    this.loadRepositories();
  }
  
  loadRepositories(): Observable<Repository[]> {
    return this.http.get<{ repos: Repository[] }>('/api/repos')
      .pipe(
        map(response => response.repos),
        tap(repos => this.reposSubject.next(repos))
      );
  }
  
  scanWorkspaces(): Observable<void> {
    return this.http.get('/api/repos/scan').pipe(
      tap(() => this.loadRepositories())
    );
  }
  
  updateRepository(id: string, updates: Partial<Repository>): Observable<Repository> {
    return this.http.put<Repository>(`/api/repos/${id}`, updates)
      .pipe(
        tap(updated => {
          const repos = this.reposSubject.value;
          const index = repos.findIndex(r => r.id === id);
          if (index !== -1) {
            repos[index] = updated;
            this.reposSubject.next([...repos]);
          }
        })
      );
  }
  
  deleteRepository(id: string): Observable<void> {
    return this.http.delete<void>(`/api/repos/${id}`)
      .pipe(
        tap(() => {
          const repos = this.reposSubject.value.filter(r => r.id !== id);
          this.reposSubject.next(repos);
        })
      );
  }
}
```

---

## 5. Configuration

### Backend Config
**File:** `backend/config.json`

```json
{
  "workspacePaths": [
    "/Users/oboukhris-palo/workspace",
    "/Users/oboukhris-palo/Documents/workspace"
  ],
  "storagePath": "~/.dev-dashboard/repos.json",
  "scanDepth": 3,
  "port": 3000
}
```

### Angular Environment
**File:** `src/environments/environment.ts`

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
```

---

## 6. Error Handling

### Backend Errors
- **500:** File system permission errors, JSON parse errors
- **404:** Repository not found
- **400:** Validation errors (invalid phase/status)

### Frontend Handling
```typescript
this.repoService.updateRepository(id, updates)
  .pipe(
    catchError(err => {
      this.snackBar.open(err.error.message || 'Update failed', 'Close', {
        duration: 3000
      });
      return EMPTY;
    })
  )
  .subscribe();
```

---

## 7. Performance Considerations

### Backend
- **Caching:** Cache scan results for 5 minutes
- **Parallel I/O:** Use Promise.all for concurrent directory reads
- **Rate Limiting:** Max 1 scan per 10 seconds

### Frontend
- **Virtual Scrolling:** For > 50 repos (Angular CDK)
- **Debounced Search:** 300ms delay on search input
- **Optimistic Updates:** Update UI before server confirmation

---

**Version:** 1.0.0  
**Last Updated:** 2026-05-04
