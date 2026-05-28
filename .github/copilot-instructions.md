<\!-- Client-specific instructions for: dev-dashboard -->
<\!-- Inherits from: .gene2-core/.github/copilot-instructions.md -->
<!-- Last updated: 2026-05-28 (Setup wizard + UX polish complete) -->

# Dev-Dashboard Project

## Project Summary

**Local Angular Material SPA for managing code repositories on developer's laptop**

- **Purpose**: Centralized view of all local git repositories with metadata management
- **Tech Stack**: 
  - **Frontend**: Angular 18, Material Design, TypeScript, RxJS, Elf (state)
  - **Backend**: Node.js/Express REST API (TypeScript) for filesystem operations
- **Deployment**: WAR file to local Tomcat + Node.js backend on port 3000
- **Auth**: None (local use only)
- **Configuration**: Dual approach - Setup wizard (localStorage) + backend .env file

## Current Status

**Phase**: Complete + UX Polish ✅  
**Date**: 2026-05-28  
**Version**: 2.1.0  
**Overall Progress**: 10/10 stories delivered (28/28 SP) + 3 UX enhancements = 100%  
**Project Status**: DEPLOYED to Tomcat with First-Run Setup Wizard

**Latest Enhancements** (May 28):
- ✅ **GitHub-Style Language Bar**: Official linguist colors with percentage display
- ✅ **Setup Wizard**: First-run configuration dialog with directory picker
- ✅ **VSCode Button**: Palo IT green (#00A651) with proper icon/text alignment
- ✅ **Card Layout**: Top-right button positioning with flexbox alignment

**Sprint 4 Completion** (May 27):
- ✅ **REPO-004-US-001**: Build Production WAR File (5 SP)
- ✅ **REPO-004-US-002**: Deploy to Apache Service (5 SP)

**Final Metrics**:
- 100% acceptance criteria compliance (8/8 AC validated)
- 89.61% test coverage (exceeds 85% target)
- Zero critical bugs
- Production deployment ready

## Requirements Summary

### Functional Requirements
1. **Repository Discovery** (FR-001): Auto-scan workspace directories for git repos
2. **Information Display** (FR-002): Show name, description, path, dev stack, phase, status
3. **Metadata Management** (FR-003): Inline editing for description, phase, status
4. **README Parsing** (FR-004): Extract descriptions from README.md files
5. **Tech Stack Detection** (FR-005): Detect Node.js, Java, .NET, Python, Angular, TypeScript (checks subdirectories)

### Non-Functional Requirements
- Scan completes in < 5 seconds
- UI renders in < 1 second
- Material Design for consistency
- No authentication required

## Epic Structure (10 Stories)

| Epic | Stories | Priority | Status |
|------|---------|----------|--------|
| REPO-001: Repository Discovery & Scanning | 3 | High | ✅ Delivered |
| REPO-002: Repository Information Display | 2 | High | ✅ Delivered |
| REPO-003: Repository Metadata Management | 3 | High | ✅ Delivered |
| REPO-004: Deployment & Infrastructure | 2 | Medium | ✅ Delivered |

**Full details**: `docs/01-requirements/user-stories.md`

## Design System (Finalized May 7, 2026)

**Penpot File**: 3 boards, 336 shapes total, accessible via Penpot MCP Server
- **Board 1 - Design Tokens** (101 shapes): Colors, typography, spacing, logo at (50, 20)
- **Board 2 - UI Components** (68 shapes): Buttons, badges, inputs, cards, toolbar with logo
- **Board 3 - Application Wireframes** (167 shapes): Desktop, mobile, empty state with full layout

**Design Quality**: ✅ Finalized and validated

**Color Palette**: Tech Blue `#0066CC`, Purple `#7B3FF2`, Green `#00A651`, Grayscale  
**Typography**: Roboto, 48/32/20/16/12px, Weights 400/700  
**Spacing**: 4px base (XS:4, SM:8, MD:16, LG:24, XL:32, 2XL:48)  
**Components**: Buttons 160×48px, Cards 420×260px, Toolbar 72px, Logo 40px

**Asset**: `docs/02-architecture/design/palo-it-logo.png`

## Key Decisions

- **Backend for Real Scanning**: Node.js/Express backend scans actual filesystem (replaced mocks)
- **Two-Server Architecture**: Backend (port 3000) + Frontend (Tomcat 8080) work together
- **Configurable Workspaces**: Environment-based configuration via `src/backend/.env` file
- **Simplicity over features**: Basic CRUD only, no git operations
- **ROI**: < 1 month payback (5-10 min/day time savings)
- **Maintenance**: Minimal (single developer, local use)

## Configuration System

**Backend Configuration** (`src/backend/.env`):
```env
# Server port
PORT=3000

# Workspace paths (comma-separated absolute paths)
WORKSPACE_PATHS=/Users/username/workspace,/Users/username/projects

# Directories to exclude from scanning
EXCLUDE_PATTERNS=node_modules,.git,dist,build,target,.vscode,.idea,coverage,out

# Debug logging (optional)
DEBUG=false
```

**Setup for New Developers**:
1. Copy template: `cd src/backend && cp .env.example .env`
2. Edit `.env` with their workspace paths
3. Interactive setup available: `./setup.sh` (macOS/Linux)

**Configuration Loading**:
- Backend loads `.env` at startup via `dotenv/config`
- Frontend uses backend API (`/api/config`) to get workspace paths
- No frontend configuration needed

**File Locations**:
- ✅ `src/backend/.env.example` - Template with placeholders
- ✅ `src/backend/.env` - User-specific config (git-ignored)
- ✅ `src/backend/setup.sh` - Interactive configuration script

## Repository Structure

```
dev-dashboard/
├── docs/
│   ├── 01-requirements/          # ✅ Complete
│   ├── 02-architecture/          # ✅ Complete
│   ├── 03-testing/               # ✅ Complete
│   ├── 04-planning/              # ✅ Complete
│   └── 05-implementation/        # ✅ Complete (All 10 stories delivered)
│       ├── user-stories.md       # SSOT - 10/10 delivered
│       ├── sprint-1.md to sprint-4.md # Archived sprints
│       └── epics/                # 4 epics, 10 stories complete
├── src/
│   ├── backend/                  # Node.js/Express TypeScript backend
│   │   ├── src/
│   │   │   ├── server.ts        # Express server (TypeScript)
│   │   │   ├── services/        # Migrated from frontend (readme-parser, tech-stack-detector, etc.)
│   │   │   └── models/          # Repository models
│   │   ├── dist/                # Compiled JavaScript (ignored by git)
│   │   ├── tsconfig.json        # TypeScript config
│   │   └── package.json         # Express, CORS, TypeScript deps
│   └── frontend/
│       ├── scripts/
│       │   ├── build-war.js      # WAR packaging script
│       │   ├── deploy.sh         # Apache deployment with validation
│       │   └── deploy-rollback.sh # Rollback mechanism
│       ├── src/app/
│       │   ├── domain/           # Models, enums, interfaces
│       │   ├── services/         # HTTP clients only (filesystem, metadata-editor, metadata-persistence)
│       │   ├── state/            # Elf store (RxJS state management)
│       │   └── components/       # UI layer
│       ├── .htaccess             # SPA routing for Apache/Tomcat
│       └── DEPLOYMENT.md         # Deployment guide (updated for backend)
├── README.md                     # Build & deployment commands
└── logs/                         # Agent session logs
```

## Implementation Status

### Completed Stories

**REPO-001: Repository Discovery & Scanning** (3/3 stories ✅)
- US-001: Workspace scanning with recursive traversal (forkJoin parallelism)
- US-002: README parsing + metadata extraction (case-insensitive matching)
- US-003: Tech stack detection (Node.js, Java, .NET, Python, Angular)

**REPO-002: Repository Information Display** (2/2 stories ✅)
- US-001: Repository list with sorting (name, phase, status fields, 118 tests)
- US-002: Interactive cards with selection state, path truncation, tooltips (126 tests)

**REPO-003: Repository Metadata Management** (3/3 stories ✅)
- US-001: Inline description editing with double-click, Enter/Escape/blur, 500-char limit
- US-002: Phase + Status dropdowns with Material selects
- US-003: localStorage persistence with auto-save and recovery

**REPO-004: Deployment & Infrastructure** (2/2 stories ✅)
- US-001: Production WAR build (500KB-1MB, all assets bundled, .htaccess for SPA routing)
- US-002: Apache deployment with pre-flight checks, backup, rollback mechanism

## REPO-004 Learnings (Sprint 4 — 1 Day Delivery)

**YOLO Mode (Direct Implementation) Effective for Infrastructure**
- No TDD ceremony for deployment/build tasks — direct implementation 1 day faster
- Simple acceptance criteria validation replaced complex test scenarios
- Build scripts (build-war.js) cleanly isolated from app code
- Deploy scripts self-documenting with inline validation checks

**Implementation Plan Checkboxes — Effective Tracking**
- Checkboxes in implementation-plan.md marked [x] provide real-time progress
- Layer-by-layer structure matches deployment phases (Config→Package→Docs, Script→Routing→Auto-Start→Docs)
- Parallel checkpoint entries enable parallel work tracking

**Approval Gates (plan-approval.yaml) — Effective Blocking**
- `status: pending` enforces review before implementation
- `status: approved` enables developer handoff
- Prevents wasted effort on unfeasible plans

**Build Pipeline Patterns**
- npm scripts (build:prod, package:war, deploy, deploy:rollback) provide CLI access
- .htaccess rewrite rules for SPA routing must be included in WAR file
- Pre-flight validation (Apache running, permissions, disk) prevents runtime failures

**Deployment Safety**
- Backup + rollback mechanism critical for recovery
- One-command rollback (deploy-rollback.sh) enables fast recovery
- Documentation-driven (DEPLOYMENT.md) ensures reproducibility

**Framework Config Effectiveness** 
- `cavemanMode: true` saved ~75% tokens via compressed output
- `tddMode: false, bddMode: false, dddMode: false` → approvalMode: true
- Plan-approval.yaml remained mandatory even in YOLO mode — no gate skipping

## Development Guidelines

### TDD Best Practices

**Test Execution**:
- **Default command**: `npm test` (headless, single-run, fast for agents)
- **Watch mode**: `npm run test:watch` (interactive development)
- **Layer-specific**: `npm run test:layer2/3/4` (focused testing)
- **Coverage**: `npm run test:coverage` (validate thresholds)

**Coverage Thresholds** (realistic for YOLO mode):
- Statements: 65%, Branches: 55%, Functions: 50%, Lines: 70%
- Rationale: Focus on critical paths, not exhaustive coverage

**Common Pitfalls**:
- ❌ **Jasmine `done()` callback with Elf**: Elf emits synchronously via BehaviorSubject
  - ✅ **Solution**: Use `take(1)` pattern, not `done()` callback
- ❌ **TypeScript null narrowing with `expect()`**: `expect(x).toBe(value)` fails when `x: T | null`
  - ✅ **Solution**: Use `expect(x as unknown as T).toBe(value)`
- ❌ **Spy returnValues() with recursion**: Doesn't work for path-dependent logic
  - ✅ **Solution**: Use `spy.callFake((arg) => {...})` for dynamic returns
- ❌ **Memory leak in subscriptions**: `subscribe()` without cleanup leaks memory
  - ✅ **Solution**: Use `takeUntil(destroy$)` or unsubscribe in `ngOnDestroy()`

**Angular Patterns**:
- **Dependency Injection**: Use `inject()` function, not constructor parameters
- **Control Flow**: Use `@if`, `@for`, `@switch`, not `*ngIf`, `*ngFor`
- **Material Modules**: Import needed (MatCardModule, MatChipsModule, MatIconModule, MatButtonToggleModule, MatSelectModule, MatFormFieldModule, MatTooltipModule, MatInputModule for search)
- **OnPush Strategy**: All components use `ChangeDetectionStrategy.OnPush` (requires `fixture.detectChanges()` + `fixture.whenStable()` in tests)
- **Standalone Components**: No NgModules (Angular 18 pattern)
- **Path Aliases**: Use `@domain/*`, `@services/*`, `@state/*`, `@components/*`

**RxJS Patterns**:
- **Parallel operations**: Use `forkJoin` for concurrent async tasks (scanner uses this for multi-workspace scanning)
- **Reactive sorting**: `combineLatest([repositories$, sort$]).pipe(map(...))` for reactive composition with multiple observable sources
- **Search filtering**: `combineLatest([repositories$, searchTerm$]).pipe(map(([repos, term]) => repos.filter(r => r.name.includes(term))))` for live filtering
- **Selection state**: `BehaviorSubject` for synchronous selection tracking, emit with `.next(value)`, test with `take(1)` in subscriptions
- **State updates**: Use `tap` for side effects, `switchMap` for dependent calls
- **Cleanup**: Always use `takeUntil(destroy$)` or `take(1)` to prevent memory leaks

**Elf State Patterns**:
- **Entities**: Use `setEntities()`, `updateEntities()` for CRUD operations
- **Props**: Combine with entities via `withProps()` for metadata (loading, error, lastScan)
- **Multiple reducers**: Call `repositoryStore.update(setEntities([]), (state) => ({...state, ...}))` for atomic updates
- **Reset**: Clear both entities and props in `beforeEach` for test isolation

### Material Design Patterns

**Search Input**:
```html
<mat-form-field>
  <mat-icon matPrefix>search</mat-icon>
  <input matInput placeholder="Search repositories..." [(ngModel)]="searchTerm">
</mat-form-field>
```

**Image Button**:
- Place images in `src/assets/` (e.g., `microsoft-visual-studio-code-insider-icon.png`)
- Use `<img>` inside button with explicit sizing: `<img src="assets/icon.png" alt="Label" style="width: 24px; height: 24px;">`
- Keep aspect ratio and align with Material icon sizes (18/24/36/48px)

**Hover Effects**:
```scss
.repository-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.15);
  background-color: #F0F0F0;
  transition: all 0.2s ease-in-out;
}
```

**Selection State Styling**:
```scss
.repository-card.selected {
  background-color: rgba(0, 102, 204, 0.1);
  border: 2px solid #0066CC;
  box-shadow: 0 4px 12px rgba(0, 102, 204, 0.15);
}
```

**Path Truncation with Tooltip**:
- Truncate to 40 chars + '...' (total 43 when truncated)
- Use `[matTooltip]="repo.path"` with `matTooltipShowDelay="500"` for full path on hover
- Pattern: `<span [matTooltip]="path" matTooltipPosition="above">{{ truncatePath(path, 40) }}</span>`

### Documentation Structure

**README/SETUP Split Pattern**:
- **README.md**: Engaging, emoji-rich overview for new contributors (purpose, features, quick start, tech stack)
- **SETUP.md**: Comprehensive technical guide (prerequisites, installation, dev/prod workflows, troubleshooting)
- Use consistent emoji style: 🚀 for actions, 📚 for docs, ✅ for status, ⚠️ for warnings
- Keep both files under 200 lines each for scannability

## Backend Architecture (Added May 28, 2026)

### Two-Server Pattern
- **Backend**: Node.js/Express on port 3000 (must run first)
- **Frontend**: Angular SPA on Tomcat port 8080
- **Communication**: Frontend HTTP calls to `http://localhost:3000/api`

### Backend Startup Commands

⚠️ **Prerequisites**: Must configure `src/backend/.env` first (see Configuration System above)

```bash
# First-time setup: Configure workspace paths
cd /Users/oboukhris-palo/workspace/dev-dashboard/src/backend
cp .env.example .env
# Edit .env with your workspace paths

# Build TypeScript first (if not already built)
npm run build

# Production mode (compiled JS)
node dist/server.js
# Or absolute path:
node /Users/oboukhris-palo/workspace/dev-dashboard/src/backend/dist/server.js

# Development mode (auto-recompile on save)
npm run dev
```

### Backend Restart Workflow (After server.ts Changes)
```bash
# 1. Rebuild TypeScript
cd /Users/oboukhris-palo/workspace/dev-dashboard/src/backend && npm run build

# 2. Kill old server
lsof -i :3000 | awk 'NR==2 {print $2}' | xargs kill -9

# 3. Start new server
node dist/server.js
# Or use absolute path:
node /Users/oboukhris-palo/workspace/dev-dashboard/src/backend/dist/server.js
```

**Quick verification**: `curl http://localhost:3000/health` should return 200 OK

### Backend API Endpoints
- `GET /health` - Health check
- `GET /api/config` - Workspace paths and exclude patterns
- `GET /api/repos/scan` - Scan all workspaces, return repositories
- `GET /api/fs/is-git?path=` - Check if directory is git repo
- `GET /api/fs/list-directories?path=` - List subdirectories
- `GET /api/fs/read-readme?path=` - Read README file

### Frontend Service Pattern (HTTP Client)
- All services inject `HttpClient` via `inject(HttpClient)`
- API base URL: `const API_BASE_URL = 'http://localhost:3000/api'`
- Error handling: `catchError(() => of(defaultValue))`
- **REQUIRED**: Add `provideHttpClient(withFetch())` to `main.ts` providers

### Common Gotchas
- ❌ **TypeScript not compiled**: Running `node dist/server.js` before build fails
  - ✅ **Solution**: Run `npm run build` first, or use `npm run dev` for watch mode
- ❌ **Frontend can't connect**: Backend not running or CORS not configured
  - ✅ **Solution**: Start backend first, check `http://localhost:3000/health`
- ❌ **Port 3000 already in use**: Another process using port
  - ✅ **Solution**: `lsof -i :3000 | awk 'NR==2 {print $2}' | xargs kill -9`
- ❌ **Services migrated**: Old frontend services (readme-parser, tech-stack-detector) removed
  - ✅ **Solution**: Backend handles all scanning logic, frontend only HTTP client
- ❌ **Frontend passes relative paths**: API receives "dev-dashboard" not "/Users/.../dev-dashboard"
  - ✅ **Solution**: Backend resolves against workspace paths: `let absolutePath: string | undefined; if (!path.isAbsolute(requestedPath)) { for workspace, try fs.access(path.join(workspace, requestedPath)) }`
- ❌ **TypeScript definite assignment error**: `Variable 'x' is used before being assigned`
  - ✅ **Solution**: Declare as `string | undefined` not `string` when conditionally assigned in if/else
- ❌ **Cached frontend shows old errors**: Backend fixed but browser still 404/500
  - ✅ **Solution**: Full rebuild+redeploy: `npm run build:prod && npm run build:war && ./scripts/deploy.sh`, then hard refresh (Cmd+Shift+R)
- ❌ **Phase/status showing "No Phase"/"No Status"**: Frontend accessing `repo.metadata?.phase` but backend sends flat `repo.phase`
  - ✅ **Solution**: Backend model is flat (phase, status), frontend template must use `$any(repo.phase)` for type casting
- ❌ **Angular template type error**: `expression as any` fails with parser error
  - ✅ **Solution**: Use `$any(expression)` not `expression as any` in Angular templates
- ❌ **Tech stack not detected**: Marker files (package.json, angular.json) in subdirectories not root
  - ✅ **Solution**: Tech detector now checks: root, src/, src/frontend/, src/backend/, frontend/, backend/
- ❌ **Documents/workspace not scanned**: macOS Full Disk Access required
  - ✅ **Solution**: System Settings → Privacy & Security → Full Disk Access → Add Terminal + VSCode, restart apps

### Complete Deployment Workflow
```bash
# 1. Rebuild backend
cd /Users/oboukhris-palo/workspace/dev-dashboard/src/backend && npm run build

# 2. Restart backend
lsof -i :3000 | awk 'NR==2 {print $2}' | xargs kill -9
node /Users/oboukhris-palo/workspace/dev-dashboard/src/backend/dist/server.js &

# 3. Rebuild frontend + deploy
cd /Users/oboukhris-palo/workspace/dev-dashboard/src/frontend
npm run build:war && ./scripts/deploy.sh

# 4. Verify
curl http://localhost:3000/api/repos/scan | grep techStack
open http://localhost:8080/dev-dashboard/
```

### Development Mode

**YOLO Mode Workflow** (Confirmed 100% Effective):
- Phase 1 (PM): Sprint planning → user-stories.md
- Phase 2 (BA): Story enrichment → description.md (plain text AC, no BDD)
- Phase 3 (Dev-Lead): Implementation planning → implementation-plan.md + plan-approval.yaml
- Phase 4 (Dev): Direct implementation → caveman-compressed output
- Phase 5 (Dev-Lead): Status sync → user-stories.md updates
- Phase 6 (QA): Acceptance validation → acceptance criteria testing
- Phase 7 (PM): Sprint closure → archive sprint, final metrics

**Framework Config** (`/.github/framework-config.mjs`):
- `cavemanMode: true` — Agents use ultra-compressed caveman skill (~75% PRU savings)
- `tddMode: false` — No RED→GREEN→REFACTOR enforcement
- `bddMode: false` — No .feature files, plain text acceptance criteria only
- `dddMode: false` — Standard layered architecture, no DDD patterns
- `approvalMode: true` — Derived when all dev modes false

**Applied to REPO-004**: Both stories completed 1 day, 100% AC compliance, 0 bugs

---

## Service Migration Pattern (May 28, 2026)

**Context**: Migrated filesystem scanning services from Angular frontend to TypeScript backend for direct filesystem access.

**Migration Strategy**:
1. Backend converted from JavaScript (`server.js`) to TypeScript (`src/server.ts`)
2. Services copied from `frontend/src/app/services/` to `backend/src/services/`
3. Angular-specific code removed (Injectable decorators, RxJS where not needed)
4. Frontend services deleted: `readme-parser`, `tech-stack-detector`, `metadata-extractor`, `repository-scanner`, `workspace-config`
5. Frontend kept only: `filesystem.service` (HTTP client), `metadata-editor`, `metadata-persistence`
6. Backend provides REST API, frontend consumes via HTTP

**Build Process**:
- Backend: `npm run build` → compiles TS to `dist/` directory
- Frontend: `npm run build:prod` → Angular production build
- Both must run simultaneously (backend port 3000, frontend port 8080)

**Services Architecture**:
- **Backend** (TypeScript): Direct Node.js `fs/promises` access, recursive scanning, README parsing, tech stack detection
- **Frontend** (Angular): HTTP client only, Elf state management, UI rendering, user edits persisted to localStorage

**Benefits**:
- Real filesystem access (no permission errors from browser security)
- Faster scanning (no HTTP overhead for file checks)
- Cleaner separation: backend = data, frontend = UI

---

## Framework Integration

This project uses the **Gene2 PDLC Framework** for structured development.

**Framework Location**: `.gene2-core/.github/`

**Current Workflow**: [05-implementation.workflows.md](.gene2-core/.github/workflows/05-implementation.workflows.md)

**Key Resources**:
- **Implementation Plans**: `docs/05-implementation/epics/*/user-stories/*/implementation-plan.md`
- **Sprint Tracking**: `docs/05-implementation/current-sprint.md`
- **Status Dashboard**: `docs/05-implementation/user-stories.md` (SSOT)
- **Agent Logs**: `logs/05-implementation/`

**For complete framework documentation**, see `.gene2-core/.github/copilot-instructions.md`

---

## UX Enhancements (Added May 28, 2026)

### Setup Wizard Pattern
- **First-run detection**: `localStorage.getItem('dev-dashboard-workspace-paths')` → if null, show wizard
- **MatDialog integration**: `MatDialog.open(SetupWizardComponent, { disableClose: true })`
- **Angular signals**: `workspacePaths = signal<string[]>([])` for reactive state
- **Directory picker API**: `showDirectoryPicker()` with `prompt()` fallback for cross-browser support
- **Dialog result**: `dialogRef.afterClosed().subscribe(result => ...)` for workflow control

### Brand-Aligned UI Components

**Palo IT Green Button** (Success/Action buttons):
```scss
.scan-button {
  background-color: #00A651 !important;  // Palo IT Success Green
  color: white !important;
  
  &:hover:not(:disabled) {
    background-color: #008A43 !important;  // Darker on hover
  }
}
```

**Button with Icon and Text** (Inline alignment):
```html
<!-- ✅ CORRECT: Icon + text with proper alignment -->
<button mat-raised-button class="button-class">
  <img src="assets/icon.png" alt="Icon" class="icon">
  <span class="label">Button Text</span>
</button>
```

**Critical**: See "Material Button Alignment Issues" section below for proper CSS to keep icon and text inline.

**Icon Button Styling** (Palo IT green example):
```scss
.vscode-button {
  background-color: #00A651 !important;  // Palo IT Success Green
  color: white !important;
  transition: all 0.2s ease-in-out;
  
  &:hover {
    transform: scale(1.05);
    background-color: #008A43 !important;
    box-shadow: 0 2px 8px rgba(0, 166, 81, 0.3);
  }
}
```

### LocalStorage Configuration Pattern
- **Storage key**: `'dev-dashboard-workspace-paths'` for workspace paths array
- **Persistence**: `localStorage.setItem(key, JSON.stringify(paths))`
- **Retrieval**: `JSON.parse(localStorage.getItem(key) || '[]')`
- **Use case**: Frontend workspace selection separate from backend `.env` config (dual configuration approach)

### First-Run UX Flow
1. App loads → check localStorage for config
2. If missing → open wizard dialog (non-dismissible)
3. User selects directories → save to localStorage
4. Dialog closes → trigger scan
5. Future loads → skip wizard (config exists)

**Common Gotchas**:
- ❌ **Wizard reopens on refresh**: localStorage not saved before scan
  - ✅ **Solution**: Save to localStorage in dialog before closing
- ❌ **Directory picker fails silently**: Browser doesn't support `showDirectoryPicker()`
  - ✅ **Solution**: Always provide `prompt()` fallback in try-catch

---

## GitHub-Style Language Bar (Added May 28, 2026)

### Implementation Pattern
```scss
.language-bar {
  display: flex;
  width: 100%;
  height: 8px;
  border-radius: 4px;
  overflow: hidden;
}

.language-segment {
  height: 100%;
  // Width calculated as percentage of tech stack
}
```

### GitHub Official Linguist Colors
```typescript
const colors: { [key: string]: string } = {
  'TypeScript': '#3178c6',
  'JavaScript': '#f1e05a',
  'Java': '#b07219',
  'C#': '#178600',
  '.NET': '#178600',
  'Python': '#3572A5',
  'HTML': '#e34c26',
  'CSS': '#563d7c',
  'SCSS': '#c6538c',
  'Shell': '#89e051',
  'Ruby': '#701516',
  'Go': '#00ADD8',
  // ... see component for full list
};
```

**Reference**: https://github.com/github/linguist/blob/master/lib/linguist/languages.yml

---

## Material Button Alignment Issues (Critical Gotchas)

### Problem: Icon and Text Won't Stay Inline
Material buttons have default flex settings that cause wrapping. Requires aggressive CSS overrides.

### Solution Pattern (Working)
```scss
.button-class {
  display: inline-flex !important;
  flex-direction: row !important;      // Force horizontal
  flex-wrap: nowrap !important;        // Prevent wrapping
  align-items: center !important;      // Vertical centering
  gap: 6px !important;
  white-space: nowrap !important;      // No text wrap
  
  .icon {
    width: 18px !important;
    height: 18px !important;
    display: inline-block !important;  // NOT block
    vertical-align: middle !important; // Critical for alignment
    margin: 0 !important;
    flex-shrink: 0 !important;
  }
  
  .label {
    line-height: 18px !important;      // Match icon height
    vertical-align: middle !important; // Critical for alignment
    white-space: nowrap !important;
    margin: 0 !important;
    flex-shrink: 0 !important;
  }
}
```

### Key Points
- **Always use `!important`** to override Material defaults
- **Icon display**: `inline-block` (NOT `block`) for vertical alignment
- **Vertical alignment**: Both icon AND text need `vertical-align: middle`
- **Line height**: Label line-height must match icon height (e.g., both 18px)
- **No wrapping**: `flex-wrap: nowrap` + `white-space: nowrap` on both button and label
- **Width**: `min-width: fit-content` ensures button has enough space

### Angular Budget Adjustments
When adding significant CSS (language bars, complex buttons), increase budgets:
```json
"budgets": [
  {
    "type": "initial",
    "maximumWarning": "750kb",
    "maximumError": "1.5mb"
  },
  {
    "type": "anyComponentStyle",
    "maximumWarning": "5kb",
    "maximumError": "8kb"
  }
]
```
