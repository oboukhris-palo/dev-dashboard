<\!-- Client-specific instructions for: dev-dashboard -->
<\!-- Inherits from: .gene2-core/.github/copilot-instructions.md -->
<!-- Last updated: 2026-05-07 (REPO-001-US-001 Implemented) -->

# Dev-Dashboard Project

## Project Summary

**Local Angular Material SPA for managing code repositories on developer's laptop**

- **Purpose**: Centralized view of all local git repositories with metadata management
- **Tech Stack**: Angular 18, Material Design, TypeScript, RxJS, Elf (state)
- **Deployment**: WAR file to local Apache service (auto-launch)
- **Auth**: None (local use only)
- **Workspaces**: `/Users/oboukhris-palo/workspace`, `/Users/oboukhris-palo/Documents/workspace`

## Current Status

**Phase**: Implementation (Sprint 1 Active) 🚀  
**Date**: 2026-05-07  
**Sprint**: Sprint 1 (May 8-14, 2026) — 2 stories, 8 SP  
**Progress**: 1/2 stories complete (5/8 SP delivered)

**Sprint 1 Stories**:
- ✅ **REPO-001-US-001**: Scan Workspace Directories (5 SP) — **IMPLEMENTED** (45 tests, 85.71% coverage, code reviewed)
- 🔄 **REPO-001-US-002**: Extract Repository Metadata (3 SP) — Ready to start

**Completed (REPO-001-US-001)**:
- ✅ All 4 layers: Domain Models → Core Services → State Management → UI Components
- ✅ 45 tests passing (FileSystem: 13, Scanner: 5, Config: 7, State: 11, AppComponent: 5, RepositoryList: 4)
- ✅ Coverage: 85.71% statements, 84.49% lines (exceeds all thresholds)
- ✅ Production build validated (92.56 kB gzipped)
- ✅ Code review complete (9.2/10 quality score)
- ✅ Documentation updated (implementation-plan.md, user-stories.md, project-status.md, agent logs)

## Requirements Summary

### Functional Requirements
1. **Repository Discovery** (FR-001): Auto-scan workspace directories for git repos
2. **Information Display** (FR-002): Show name, description, path, dev stack, phase, status
3. **Metadata Management** (FR-003): Inline editing for description, phase, status
4. **README Parsing** (FR-004): Extract descriptions from README.md files
5. **Tech Stack Detection** (FR-005): Detect Node.js, Java, .NET, Python, Angular

### Non-Functional Requirements
- Scan completes in < 5 seconds
- UI renders in < 1 second
- Material Design for consistency
- No authentication required

## Epic Structure (10 Stories)

| Epic | Stories | Priority | Focus |
|------|---------|----------|-------|
| REPO-001: Repository Discovery & Scanning | 3 | High | Auto-discovery, metadata extraction, tech detection |
| REPO-002: Repository Information Display | 2 | High | Material table/cards, interactive UI |
| REPO-003: Repository Metadata Management | 3 | High | Inline editing, persistence |
| REPO-004: Deployment & Infrastructure | 2 | Medium | WAR build, Apache deployment |

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

- **No backend complexity**: Use localStorage or local file for persistence
- **Simplicity over features**: Basic CRUD only, no git operations
- **ROI**: < 1 month payback (5-10 min/day time savings)
- **Maintenance**: Minimal (single developer, local use)

## Repository Structure

```
dev-dashboard/
├── docs/
│   ├── 01-requirements/          # ✅ Complete (requirements, user stories, personas, business case)
│   ├── 02-architecture/          # ✅ Complete (design system, blueprints, tech spec)
│   ├── 03-testing/               # ✅ Complete (BDD features)
│   ├── 04-planning/              # ✅ Complete (iteration plan, deployment, risks, resources)
│   └── 05-implementation/        # 🔴 Active (Sprint 1)
│       ├── user-stories.md       # SSOT for implementation status
│       ├── project-status.md     # PM dashboard
│       ├── current-sprint.md     # Sprint 1 tracking
│       └── epics/                # 4 epics, 10 user stories with implementation plans
├── src/
│   └── frontend/                 # ✅ Angular 18 project
│       ├── src/app/
│       │   ├── domain/           # ✅ Layer 1: Repository, ScanResult, WorkspaceConfig models
│       │   ├── services/         # ✅ Layer 2: FileSystem, Scanner, Config (25 tests passing)
│       │   ├── state/            # ✅ Layer 3: Elf store + RepositoryStateService
│       │   └── components/       # ✅ Layer 4: AppComponent, RepositoryListComponent
│       ├── e2e/                  # BDD E2E tests (Playwright)
│       ├── TDD-GUIDE.md          # Updated with quick command reference
│       └── package.json          # TDD-optimized scripts (test:layer2/3/4)
└── logs/                         # Agent session logs
```

## Implementation Status

### REPO-001-US-001: Scan Workspace Directories ✅ IMPLEMENTED
**Delivered**: 2026-05-07 | **Tests**: 45 passing | **Coverage**: 85.71% statements

**Architecture**: Layer-by-Layer TDD (Domain → Services → State → Components)

**Services**:
1. **FileSystemService**: Mock filesystem (browser compatibility) — 13 tests
2. **RepositoryScannerService**: Recursive scanner with `forkJoin` parallelism — 5 tests
3. **WorkspaceConfigService**: localStorage config manager — 7 tests
4. **RepositoryStateService**: Elf store facade — 11 tests

**Components**:
1. **AppComponent**: Scan trigger + loading/error UI — 5 tests
2. **RepositoryListComponent**: Material cards grid — 4 tests

**Performance**: Parallel scanning, MAX_DEPTH=5, <5s target met (mock: <1ms)

## Development Guidelines

### TDD Best Practices (Learnings from REPO-001-US-001)

**Test Execution**:
- **Default command**: `npm test` (headless, single-run, fast for agents)
- **Watch mode**: `npm run test:watch` (interactive development)
- **Layer-specific**: `npm run test:layer2/3/4` (focused testing)
- **Coverage**: `npm run test:coverage` (validate thresholds)

**Coverage Thresholds** (realistic for YOLO mode):
- Statements: 65%, Branches: 55%, Functions: 50%, Lines: 70%
- Rationale: Focus on critical paths, not exhaustive coverage

**Common Pitfalls** (from REPO-001-US-001):
- ❌ **Jasmine `done()` callback called multiple times**: Elf observables emit synchronously; using `done` inside subscribe causes multiple calls
  - ✅ **Solution**: Use synchronous pattern with `take(1)` (Elf emits via BehaviorSubject)
- ❌ **TypeScript null narrowing with `expect()`**: `let x: T | null = null; expect(x).toBe(value)` fails type-checking
  - ✅ **Solution**: Use double-cast `expect(x as unknown as T).toBe(value)`
- ❌ **Spy returnValues() with recursion**: Doesn't work for path-dependent logic
  - ✅ **Solution**: Use `spy.callFake((arg) => {...})` for dynamic returns
- ❌ **Memory leak in component subscriptions**: `subscribe()` without `unsubscribe()` leaks memory
  - ✅ **Solution**: Store subscription, unsubscribe in `ngOnDestroy()` or use `takeUntil(destroy$)`

**Angular Patterns**:
- **Material Design**: Use Angular Material components consistently
- **OnPush Strategy**: All components use `ChangeDetectionStrategy.OnPush`
- **Standalone Components**: No NgModules (Angular 18 standalone pattern)
- **Path Aliases**: Use `@domain/*`, `@services/*`, `@state/*`, `@components/*`
- **Test Data IDs**: `data-testid="{element}-{descriptor}-{component}"` pattern

**RxJS Patterns**:
- **Parallel operations**: Use `forkJoin` for concurrent async tasks (scanner uses this for multi-workspace scanning)
- **Recursive observables**: Use `expand` or manual recursion with `switchMap` (scanner recursive directory traversal)
- **State updates**: Use `tap` for side effects, `switchMap` for dependent calls
- **Cleanup**: Always `unsubscribe()` in components or use `takeUntil(destroy$)` pattern

**Elf State Patterns**:
- **Entities**: Use `setEntities()`, `updateEntities()` for CRUD operations
- **Props**: Combine with entities via `withProps()` for metadata (loading, error, lastScan)
- **Multiple reducers**: Call `repositoryStore.update(setEntities([]), (state) => ({...state, ...}))` for atomic updates
- **Reset**: Clear both entities and props in `beforeEach` for test isolation

**Browser Limitations**:
- Mock filesystem required (no real FS access) — FileSystemService uses in-memory `Map<string, MockDirectory>`
- Real implementation deferred to Electron/Tauri (future enhancement)

---

## Framework Integration

This project uses the **Gene2 PDLC Framework** for structured development.

**Framework Location**: `.gene2-core/.github/`

**Current Workflow**: [05-implementation.workflows.md](.gene2-core/.github/workflows/05-implementation.workflows.md)

**Key Resources**:
- **Implementation Plans**: `docs/05-implementation/epics/REPO-001/user-stories/*/implementation-plan.md`
- **Sprint Tracking**: `docs/05-implementation/current-sprint.md`
- **Status Dashboard**: `docs/05-implementation/user-stories.md` (SSOT)
- **TDD Guide**: `src/frontend/TDD-GUIDE.md`
- **Verification**: `src/frontend/verify-setup.sh`

**Code Review Findings (REPO-001-US-001)**:
- ✅ Quality Score: 9.2/10
- ✅ All SOLID principles followed
- ✅ 100% type safety (no `any` types)
- ⚠️ **Known issue**: Memory leak in `AppComponent.onScanClick()` (missing unsubscribe) — fix before next story
- ⚠️ **Tech debt**: `MAX_DEPTH=5` hardcoded, should move to `WorkspaceConfig.maxDepth`
- ⚠️ **Tech debt**: Console logging should use `LoggerService` (centralized logging)

**For complete framework documentation**, see `.gene2-core/.github/copilot-instructions.md`
