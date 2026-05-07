<\!-- Client-specific instructions for: dev-dashboard -->
<\!-- Inherits from: .gene2-core/.github/copilot-instructions.md -->
<\!-- Last updated: 2026-05-07 (Sprint 1 Active) -->

# Dev-Dashboard Project

## Project Summary

**Local Angular Material SPA for managing code repositories on developer's laptop**

- **Purpose**: Centralized view of all local git repositories with metadata management
- **Tech Stack**: Angular, Material Design, TypeScript
- **Deployment**: WAR file to local Apache service (auto-launch)
- **Auth**: None (local use only)
- **Workspaces**: 
  - `/Users/oboukhris-palo/workspace`
  - `/Users/oboukhris-palo/Documents/workspace`

## Current Status

**Phase**: Implementation (Sprint 1 Active) 🚀  
**Date**: 2026-05-07  
**Sprint**: Sprint 1 (May 8-14, 2026) — 2 stories, 8 SP

**Sprint 1 Stories**:
- 🔴 **REPO-001-US-001**: Scan Workspace Directories (5 SP) — In Progress
- ⚪ **REPO-001-US-002**: Extract Repository Metadata (3 SP) — Not Started

**Completed**:
- ✅ Requirements & User Stories (10 stories across 4 epics)
- ✅ Design System finalized in Penpot (3 boards, 336 shapes)
- ✅ Planning Phase complete (iteration, deployment, risks, success criteria)
- ✅ Angular project structure created (`/src/frontend/`)
- ✅ Layer-by-layer architecture scaffolded (Domain → Services → State → Components)
- ✅ Test infrastructure configured (Karma, Jasmine, Playwright)
- ✅ TDD skeleton with @todo annotations ready

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
│   └── frontend/                 # ✅ Angular 18 project created
│       ├── src/app/
│       │   ├── domain/           # ✅ Layer 1: Repository, ScanResult, WorkspaceConfig models
│       │   ├── services/         # 🔴 Layer 2: FileSystem, Scanner, Config services (TODO)
│       │   ├── state/            # 🔴 Layer 3: Elf store + RepositoryStateService (TODO)
│       │   └── components/       # 🔴 Layer 4: AppComponent, RepositoryListComponent (TODO)
│       ├── e2e/                  # BDD E2E tests (Playwright)
│       ├── TDD-GUIDE.md          # Developer guide for RED-GREEN-REFACTOR workflow
│       └── package.json          # Angular 18 + Material + Elf dependencies
└── logs/                         # Agent session logs
```

## Implementation Status

### Architecture Pattern
**Layer-by-Layer TDD** (Framework: `.gene2-core/.github/workflows/05-implementation.workflows.md`)
1. **Layer 1** - Domain Models (interfaces, no tests) ✅
2. **Layer 2** - Core Services (FileSystem, Scanner, Config) 🔴
3. **Layer 3** - State Management (Elf store + facade service) 🔴
4. **Layer 4** - UI Components (Material cards, toolbar) 🔴

### TDD Workflow
- All services have `@todo RED/GREEN/REFACTOR` annotations
- Test files scaffolded with jasmine.SpyObj mocks
- E2E tests defined with BDD scenarios (Playwright)
- Coverage target: ≥80% (configured in `karma.conf.js`)

### Browser Limitations
**Mock filesystem required** (no real filesystem access in browser)
- FileSystemService uses mock data for development
- Real implementation deferred to Electron/Tauri wrapper (future)
- Mock data includes 50+ repositories for performance testing

### Critical Performance Risk
**RISK-S1-001**: Scanner > 5 seconds for 100 repos
- **Mitigation**: Day 1 prototype with parallel scanning (`forkJoin`)
- **Test**: Performance test in `repository-scanner.service.spec.ts`

## Development Guidelines

- **TDD Required**: Follow RED → GREEN → REFACTOR cycle (see `src/frontend/TDD-GUIDE.md`)
- **Material Design**: Use Angular Material components consistently
- **OnPush Strategy**: All components use `ChangeDetectionStrategy.OnPush`
- **Standalone Components**: No NgModules (Angular 18 standalone pattern)
- **Path Aliases**: Use `@domain/*`, `@services/*`, `@state/*`, `@components/*`
- **Test Data IDs**: `data-testid="{element}-{descriptor}-{component}"` pattern

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

**For complete framework documentation**, see `.gene2-core/.github/copilot-instructions.md`
