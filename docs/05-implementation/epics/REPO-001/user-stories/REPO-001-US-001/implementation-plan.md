# Implementation Plan: REPO-001-US-001 — Scan Workspace Directories

**Story Key:** REPO-001-US-001  
**Story Title:** Scan Workspace Directories  
**Epic:** REPO-001 — Repository Discovery & Scanning  
**Priority:** High (Critical Path)  
**Story Points:** 5  
**Estimated Duration:** 3 days (12-15 hours)

**Created:** 2026-05-07 (Dev-Lead)  
**Status:** Ready for Implementation

---

## Story Overview

**User Story:**
> As a developer  
> I want the application to automatically scan my workspace directories  
> So that I can see all my code repositories without manual configuration

**Acceptance Criteria:**
- [ ] Application scans `/Users/oboukhris-palo/workspace` on load
- [ ] Application scans `/Users/oboukhris-palo/Documents/workspace` on load
- [ ] Scan detects presence of `.git` directory to identify repositories
- [ ] Scan completes within 5 seconds
- [ ] Repositories are sorted alphabetically by name

---

## Layer-by-Layer Implementation Plan

### Layer 1: Domain Models (Foundation)

**Objective:** Define core data structures and types for repository scanning

**Tasks:**
- [ ] Create `Repository` interface
  - [ ] Properties: `name: string`, `path: string`, `isGitRepository: boolean`, `lastScanned: Date`
  - [ ] Optional: `description?: string`, `techStack?: string[]`
- [ ] Create `ScanResult` interface
  - [ ] Properties: `repositories: Repository[]`, `scanDuration: number`, `errors?: string[]`
- [ ] Create `WorkspaceConfig` interface
  - [ ] Properties: `workspacePaths: string[]`, `excludePatterns?: string[]`

**Files to Create:**
- `src/app/models/repository.model.ts`
- `src/app/models/scan-result.model.ts`
- `src/app/models/workspace-config.model.ts`

**BDD Coverage:**
- ✅ Domain models support all acceptance criteria
- ✅ Type safety for repository data

**Definition of Done:**
- [ ] All interfaces defined with JSDoc comments
- [ ] Types exported from barrel file (`src/app/models/index.ts`)
- [ ] Unit tests for type guards (if applicable)

**Estimated Time:** 2 hours

---

### Layer 2: Core Services (Business Logic)

**Objective:** Implement filesystem scanning and git repository detection

**Tasks:**
- [ ] Create `FileSystemService`
  - [ ] Method: `async readDirectory(path: string): Promise<string[]>` — Read directory contents
  - [ ] Method: `async isDirectory(path: string): Promise<boolean>` — Check if path is directory
  - [ ] Method: `async exists(path: string): Promise<boolean>` — Check if path exists
  - [ ] Method: `async isGitRepository(path: string): Promise<boolean>` — Check for .git directory
  - [ ] Error handling for permission denied, not found
- [ ] Create `RepositoryScannerService`
  - [ ] Method: `async scanWorkspaces(workspacePaths: string[]): Promise<ScanResult>` — Main scan orchestration
  - [ ] Method: `private async scanDirectory(path: string): Promise<Repository[]>` — Recursive scan
  - [ ] Method: `private async isGitRepo(path: string): Promise<boolean>` — Detect .git directory
  - [ ] Performance optimization: Skip node_modules, .git/objects, .angular
  - [ ] Parallel scanning using `Promise.all()`
  - [ ] Timeout mechanism (abort after 5 seconds)
- [ ] Create `WorkspaceConfigService`
  - [ ] Method: `getWorkspacePaths(): string[]` — Return configured workspace paths
  - [ ] Hardcoded paths: `/Users/oboukhris-palo/workspace`, `/Users/oboukhris-palo/Documents/workspace`

**Files to Create:**
- `src/app/services/file-system.service.ts`
- `src/app/services/file-system.service.spec.ts`
- `src/app/services/repository-scanner.service.ts`
- `src/app/services/repository-scanner.service.spec.ts`
- `src/app/services/workspace-config.service.ts`
- `src/app/services/workspace-config.service.spec.ts`

**BDD Coverage:**
- ✅ Scenario: "Discover repositories in primary workspace"
- ✅ Scenario: "Discover repositories in secondary workspace"

**Technical Constraints:**
- Use Node.js `fs/promises` API (or Angular's HttpClient for browser-based file access if using Electron/Tauri)
- **Browser Limitation:** Standard Angular apps in browsers cannot access filesystem directly
  - **Solution:** Use Electron or Tauri wrapper, OR mock filesystem for now (demo data)
  - **Decision:** Start with mock data for browser, add Electron later if needed

**Definition of Done:**
- [ ] All services implement dependency injection
- [ ] All methods have JSDoc comments
- [ ] Unit test coverage ≥ 80%
- [ ] Mock filesystem data for browser testing
- [ ] Performance: Scan completes in < 5 seconds (50 repos)

**Estimated Time:** 8 hours

---

### Layer 3: State Management (Data Flow)

**Objective:** Manage repository list state and trigger scanning on app load

**Tasks:**
- [ ] Create `RepositoryStore` (Elf store or Angular service)
  - [ ] State: `repositories: Repository[]`, `loading: boolean`, `error: string | null`, `lastScan: Date | null`
  - [ ] Action: `loadRepositories()` — Trigger scan
  - [ ] Action: `setRepositories(repos: Repository[])` — Update state
  - [ ] Action: `setLoading(loading: boolean)` — Update loading state
  - [ ] Action: `setError(error: string)` — Update error state
  - [ ] Selector: `selectRepositories()` — Get sorted repository list
  - [ ] Selector: `selectLoading()` — Get loading state
- [ ] Integrate `RepositoryScannerService` into store
  - [ ] Call `scanWorkspaces()` on `loadRepositories()` action
  - [ ] Sort repositories alphabetically by name
- [ ] Create `RepositoryQuery` (Elf query or service methods)
  - [ ] Method: `getRepositories(): Observable<Repository[]>`
  - [ ] Method: `getLoading(): Observable<boolean>`

**Files to Create:**
- `src/app/state/repository.store.ts` (if using Elf)
- `src/app/state/repository.query.ts` (if using Elf)
- OR `src/app/services/repository-state.service.ts` (if using service-based state)
- `src/app/state/repository.store.spec.ts`

**BDD Coverage:**
- ✅ Repositories sorted alphabetically by name

**Definition of Done:**
- [ ] State management pattern established (Elf or service)
- [ ] Reactive state with RxJS observables
- [ ] Unit tests for state updates
- [ ] Integration test: Scanner service → State update

**Estimated Time:** 3 hours

---

### Layer 4: UI Components (User Interface)

**Objective:** Trigger scan on app load and display loading indicator

**Tasks:**
- [ ] Update `AppComponent` (or create `DashboardComponent`)
  - [ ] Inject `RepositoryStore` or `RepositoryStateService`
  - [ ] Call `loadRepositories()` in `ngOnInit()`
  - [ ] Subscribe to `loading$` observable
  - [ ] Display loading spinner (Material Design `<mat-spinner>`)
  - [ ] Display error message if scan fails
- [ ] Create `RepositoryListComponent` (placeholder for Sprint 2)
  - [ ] Input: `repositories: Repository[]`
  - [ ] Display count: "Found X repositories"
  - [ ] For now, just display JSON or simple list

**Files to Create/Modify:**
- `src/app/app.component.ts` (modify to trigger scan)
- `src/app/app.component.html` (add loading spinner)
- `src/app/components/repository-list/repository-list.component.ts`
- `src/app/components/repository-list/repository-list.component.html`
- `src/app/components/repository-list/repository-list.component.spec.ts`

**BDD Coverage:**
- ✅ Application scans on load
- ✅ Scan completes within 5 seconds (visible via loading spinner)

**Definition of Done:**
- [ ] App triggers scan on load
- [ ] Loading indicator displays during scan
- [ ] Repository count displays after scan
- [ ] Component tests passing

**Estimated Time:** 2 hours

---

## Architectural Constraints

### From architecture-design.md
- **Frontend-Only:** No backend API, all logic in Angular
- **Filesystem Access:** Browser limitation — use mock data or Electron/Tauri wrapper
- **State Management:** Optional Elf (lightweight) or service-based state
- **Material Design:** Use Angular Material components
- **Performance:** Scan must complete in < 5 seconds

### Technology Stack
- Angular 18+
- TypeScript 5+
- RxJS for reactive state
- Jasmine + Karma for testing
- Node.js fs API (if using Electron) OR mock data (if browser-only)

### Design Patterns
- Dependency Injection (Angular services)
- Repository pattern (scanner service)
- Observer pattern (RxJS observables)
- SOLID principles

---

## Agent Communication Notes

### For TDD-Orchestrator
- **Start with Layer 1:** Domain models are quick (2 hours)
- **Layer 2 is critical:** Scanner service performance is highest risk (see Risk-S1-001)
- **Prototype early:** Test scanning logic on real directories by end of Day 1
- **Mock filesystem:** If browser-only, create mock data service
- **Parallel scanning:** Use `Promise.all()` to scan both workspaces simultaneously

### For TDD-RED Agent
- Write failing tests for `RepositoryScannerService.scanWorkspaces()`
- Test edge cases: empty directories, permission denied, no .git directories
- Test performance: Assert scan completes in < 5 seconds (use `jasmine.clock()`)

### For TDD-GREEN Agent
- Implement recursive directory traversal
- Use `fs.promises.readdir()` with `withFileTypes` option for performance
- Skip irrelevant directories: `node_modules`, `.git/objects`, `.angular`, `dist`, `build`
- Sort repositories alphabetically before returning

### For TDD-REFACTOR Agent
- Extract magic strings to constants (workspace paths, exclude patterns)
- Consider caching strategy if scan is slow
- Add logging for debugging (console.log scan duration)

---

## BDD Scenario Mapping

### Scenario 1: Discover repositories in primary workspace
**Acceptance Criteria Covered:** ✅ AC-1, AC-3, AC-4  
**Layers Involved:** Layer 2 (Scanner), Layer 3 (State)  
**Test Location:** `repository-scanner.service.spec.ts`

**Gherkin:**
```gherkin
Given the application loads
When the scanner runs on "/Users/oboukhris-palo/workspace"
Then all directories containing ".git" folders are identified as repositories
And each repository appears in the dashboard
```

**Test Strategy:**
- Mock filesystem with test directories (3 git repos, 2 non-git dirs)
- Assert scanner returns only git repositories
- Assert count matches expected

---

### Scenario 2: Discover repositories in secondary workspace
**Acceptance Criteria Covered:** ✅ AC-2, AC-3, AC-4  
**Layers Involved:** Layer 2 (Scanner), Layer 3 (State)  
**Test Location:** `repository-scanner.service.spec.ts`

**Gherkin:**
```gherkin
Given the application loads
When the scanner runs on "/Users/oboukhris-palo/Documents/workspace"
Then all git repositories are discovered
And repositories from both workspaces are combined in the list
```

**Test Strategy:**
- Mock filesystem with directories in both workspaces
- Assert scanner returns repositories from both paths
- Assert no duplicates
- Assert combined list is sorted alphabetically

---

## Definition of Done

### Story-Level DoD
- [ ] All 5 acceptance criteria validated
- [ ] All 2 BDD scenarios passing
- [ ] Unit test coverage ≥ 80% for scanner service
- [ ] Integration test: AppComponent → Scanner → State update
- [ ] Code follows SOLID principles
- [ ] All TypeScript strict checks passing
- [ ] No linting errors (ESLint)
- [ ] No security vulnerabilities (npm audit)
- [ ] JSDoc comments for all public methods
- [ ] README section updated (how scanning works)
- [ ] Git commits follow convention: `TDD-REPO-001-US-001-<PHASE>-<CYCLE>-20260507`

### Performance Criteria
- [ ] Scan completes in < 5 seconds for 50 repositories
- [ ] Memory usage < 50MB during scan
- [ ] No UI freeze during scan (async operations)

### Code Review Checklist (13-point)
- [ ] 1. Single Responsibility Principle followed
- [ ] 2. Open/Closed Principle followed
- [ ] 3. Dependency Injection used
- [ ] 4. Error handling implemented
- [ ] 5. Edge cases covered in tests
- [ ] 6. Code is readable and maintainable
- [ ] 7. No code duplication
- [ ] 8. Constants extracted (no magic strings)
- [ ] 9. Type safety (no `any` types)
- [ ] 10. Async/await used correctly
- [ ] 11. RxJS best practices followed
- [ ] 12. Material Design components used
- [ ] 13. Accessibility considered (loading indicators)

---

## Dependencies

### Prerequisites
- [ ] Angular CLI 18+ installed
- [ ] Node.js 20.x LTS installed
- [ ] Angular Material installed (`ng add @angular/material`)
- [ ] Project initialized with routing and Material Design

### Blocking Stories
- None (foundation story)

### Blocked Stories
- REPO-001-US-002 (Extract Metadata) — depends on scanner working

---

## Risk Mitigation

### RISK-S1-001: Filesystem Performance
**Mitigation Plan:**
- Day 1, Hour 1-2: Prototype scanning logic with real directories
- Measure scan time with console.time/timeEnd
- If > 5 seconds: Optimize with parallel scanning, skip patterns, caching
- If still slow: Reduce scope to single workspace or limit depth

**Escalation:** If not resolved by Day 1 EOD, escalate to Dev-Lead for architecture review

---

## Implementation Sequence

### Day 1 (May 8, 2026) — 4-5 hours
**Morning (2 hours):**
- [ ] Layer 1: Create domain models (Repository, ScanResult, WorkspaceConfig)
- [ ] Setup Angular Material (if not done)

**Afternoon (3 hours):**
- [ ] Layer 2: Start FileSystemService
- [ ] Layer 2: Start RepositoryScannerService (basic structure)
- [ ] **Prototype:** Test scanning on real directories (performance check)

---

### Day 2 (May 9, 2026) — 4-5 hours
**Morning (3 hours):**
- [ ] Layer 2: Complete RepositoryScannerService
- [ ] TDD cycles: Write tests → Implement → Refactor
- [ ] Integration test: Scan both workspaces

**Afternoon (2 hours):**
- [ ] Layer 3: Create RepositoryStore/State service
- [ ] Connect scanner to state management

---

### Day 3 (May 10, 2026) — 4-5 hours
**Morning (2 hours):**
- [ ] Layer 4: Update AppComponent to trigger scan
- [ ] Layer 4: Add loading spinner

**Afternoon (3 hours):**
- [ ] BDD scenarios validation
- [ ] Code review (13-point checklist)
- [ ] Bug fixes
- [ ] Documentation updates

---

## Testing Strategy

### Unit Tests (Jasmine + Karma)
- `file-system.service.spec.ts` — Mock Node.js fs API
- `repository-scanner.service.spec.ts` — Test scanning logic with mock filesystem
- `workspace-config.service.spec.ts` — Test configuration
- `repository.store.spec.ts` — Test state updates

**Target Coverage:** 80%+ line coverage

### Integration Tests
- `app.component.spec.ts` — Test scan triggered on load
- `scanner-integration.spec.ts` — Test AppComponent → Scanner → State flow

**Scenarios:**
- Scan completes successfully
- Scan handles errors gracefully
- Loading state updates correctly

### BDD Tests (Jasmine)
- `repository-discovery.spec.ts` — Implement Gherkin scenarios as Jasmine tests

---

## Rollback Plan

**If story cannot be completed by Day 3:**
1. Commit all working code to feature branch
2. Create technical debt ticket for incomplete items
3. Move story back to "Not Started" status
4. Re-estimate story points
5. Discuss in Sprint Retrospective

**Rollback Triggers:**
- Filesystem performance unresolvable
- Browser limitation cannot be overcome
- Critical blocker discovered

---

**Status:** READY FOR IMPLEMENTATION  
**Created:** 2026-05-07 (Dev-Lead)  
**Next Step:** TDD-Orchestrator to begin Layer 1 (Domain Models)
