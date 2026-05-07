# Dev Dashboard - TDD Team Guide

## 🎯 Getting Started

Welcome to Sprint 1! This document provides everything you need to start TDD implementation.

## 📋 Sprint 1 Overview

**Stories:**
- **REPO-001-US-001**: Scan Workspace Directories (5 SP) — **Days 1-3**
- **REPO-001-US-002**: Extract Repository Metadata (3 SP) — **Days 4-5**

**Success Criteria:**
- ✅ Scan completes in < 5 seconds for 50+ repositories
- ✅ All BDD scenarios passing
- ✅ Test coverage ≥ 80%
- ✅ No TypeScript errors

## 🏗️ Project Structure (Created)

```
src/frontend/
├── src/
│   ├── app/
│   │   ├── domain/                    # ✅ Layer 1 - COMPLETE
│   │   │   ├── repository.model.ts
│   │   │   ├── workspace-config.model.ts
│   │   │   ├── scan-result.model.ts
│   │   │   └── index.ts
│   │   ├── services/                  # 🔴 Layer 2 - READY FOR TDD
│   │   │   ├── filesystem.service.ts          # TODO methods marked
│   │   │   ├── filesystem.service.spec.ts     # TODO tests marked
│   │   │   ├── workspace-config.service.ts    # TODO methods marked
│   │   │   ├── workspace-config.service.spec.ts
│   │   │   ├── repository-scanner.service.ts  # TODO methods marked
│   │   │   ├── repository-scanner.service.spec.ts
│   │   │   └── index.ts
│   │   ├── state/                     # 🔴 Layer 3 - READY FOR TDD
│   │   │   ├── repository.store.ts            # Store definition complete
│   │   │   ├── repository-state.service.ts    # TODO methods marked
│   │   │   ├── repository-state.service.spec.ts
│   │   │   └── index.ts
│   │   ├── components/                # 🔴 Layer 4 - READY FOR TDD
│   │   │   ├── repository-list/
│   │   │   │   ├── repository-list.component.ts     # TODO methods marked
│   │   │   │   ├── repository-list.component.html   # Template complete
│   │   │   │   ├── repository-list.component.scss   # Styles complete
│   │   │   │   └── repository-list.component.spec.ts
│   │   │   └── index.ts
│   │   ├── app.component.ts           # TODO methods marked
│   │   ├── app.component.html         # Template complete
│   │   ├── app.component.scss         # Styles complete
│   │   └── app.component.spec.ts
│   ├── environments/
│   │   ├── environment.ts
│   │   └── environment.prod.ts
│   ├── index.html
│   ├── main.ts
│   └── styles.scss
├── e2e/
│   └── repository-scanning.spec.ts    # BDD scenarios ready
├── package.json
├── tsconfig.json
├── angular.json
├── karma.conf.js
├── playwright.config.ts
└── README.md
```

## 🚀 Setup Instructions

### 1. Install Dependencies

```bash
cd /Users/oboukhris-palo/dev-dashboard/src/frontend
npm install
```

### 2. Verify Build

```bash
# This will fail initially (expected) - services not implemented
npm run build
```

### 3. Run Tests (Watch Mode)

```bash
# Terminal 1: Karma test runner
npm test
```

### 4. Start Development Server

```bash
# Terminal 2: Angular dev server
npm start
```

Navigate to `http://localhost:4200/`

## 🔴 RED → 🟢 GREEN → 🔵 REFACTOR Workflow

### Example: Implementing FileSystemService.directoryExists()

#### 🔴 RED Phase

**File:** `src/app/services/filesystem.service.spec.ts`

```typescript
describe('directoryExists', () => {
  it('should return true for existing directory', (done) => {
    // Arrange
    const existingPath = '/Users/oboukhris-palo/workspace';
    
    // Act
    service.directoryExists(existingPath).subscribe(result => {
      // Assert
      expect(result).toBe(true);
      done();
    });
  });
});
```

**Run test:** `npm test` → ❌ FAILS (method throws "Not implemented")

---

#### 🟢 GREEN Phase

**File:** `src/app/services/filesystem.service.ts`

```typescript
directoryExists(path: string): Observable<boolean> {
  // Minimal implementation to pass test
  // For browser environment, use mock data
  const mockDirectories = [
    '/Users/oboukhris-palo/workspace',
    '/Users/oboukhris-palo/Documents/workspace'
  ];
  
  return of(mockDirectories.includes(path));
}
```

**Run test:** `npm test` → ✅ PASSES

---

#### 🔵 REFACTOR Phase

**File:** `src/app/services/filesystem.service.ts`

```typescript
private readonly MOCK_DIRECTORIES = [
  '/Users/oboukhris-palo/workspace',
  '/Users/oboukhris-palo/Documents/workspace'
];

directoryExists(path: string): Observable<boolean> {
  // Refactored: Extracted constant, added comment
  // TODO: Replace with real filesystem API when using Electron/Tauri
  return of(this.MOCK_DIRECTORIES.includes(path));
}
```

**Run test:** `npm test` → ✅ STILL PASSES

**Commit:** `git commit -m "feat(filesystem): implement directoryExists with mock data"`

---

## 📝 TODO Annotations Guide

Each file contains `@todo` annotations for TDD phases:

```typescript
/**
 * @todo RED: Write test for existing directory
 * @todo RED: Write test for non-existing directory
 * @todo GREEN: Implement logic
 * @todo REFACTOR: Optimize for performance
 */
directoryExists(path: string): Observable<boolean> {
  throw new Error('Not implemented');
}
```

### Workflow:
1. Find `@todo RED` in spec file
2. Write failing test
3. Run `npm test` → Verify it fails
4. Find corresponding `@todo GREEN` in source file
5. Implement minimal code
6. Run `npm test` → Verify it passes
7. Find `@todo REFACTOR`
8. Improve code quality
9. Run `npm test` → Verify still passes
10. Commit changes

---

## 🎯 Sprint 1 Day-by-Day Plan

### Day 1 (May 8) - FileSystemService

**Morning (4 hours):**
1. ✅ Setup complete (npm install)
2. 🔴 RED: Write tests for `directoryExists()`
3. 🟢 GREEN: Implement `directoryExists()`
4. 🔴 RED: Write tests for `listDirectories()`
5. 🟢 GREEN: Implement `listDirectories()` with mock data

**Afternoon (4 hours):**
6. 🔴 RED: Write tests for `isGitRepository()`
7. 🟢 GREEN: Implement `isGitRepository()`
8. 🔴 RED: Write tests for `readFile()`
9. 🟢 GREEN: Implement `readFile()`
10. 🔵 REFACTOR: Review and optimize
11. ⚠️ **CRITICAL**: Prototype scanning on real mock data (50+ repos)

**Goal:** FileSystemService 100% implemented and tested

---

### Day 2 (May 9) - RepositoryScannerService

**Morning (4 hours):**
1. 🔴 RED: Write tests for WorkspaceConfigService
2. 🟢 GREEN: Implement WorkspaceConfigService (localStorage)
3. 🔴 RED: Write tests for `scanWorkspaces()` (happy path)
4. 🟢 GREEN: Implement basic scanning logic

**Afternoon (4 hours):**
5. 🔴 RED: Write tests for recursive scanning
6. 🟢 GREEN: Implement `scanDirectory()` recursion
7. 🔴 RED: Write tests for exclude patterns
8. 🟢 GREEN: Implement `shouldExclude()`
9. 🔴 RED: Write performance test (< 5 seconds for 50+ repos)
10. 🟢 GREEN: Optimize with parallel scanning
11. 🔵 REFACTOR: Extract helper methods

**Goal:** RepositoryScannerService 100% implemented, performance validated

---

### Day 3 (May 10) - State & UI

**Morning (3 hours):**
1. 🔴 RED: Write tests for RepositoryStateService
2. 🟢 GREEN: Implement state management with Elf
3. 🔴 RED: Write tests for loading/error state transitions
4. 🟢 GREEN: Implement state side effects
5. 🔵 REFACTOR: Optimize observables

**Afternoon (3 hours):**
6. 🔴 RED: Write tests for AppComponent
7. 🟢 GREEN: Implement scan trigger logic
8. 🔴 RED: Write tests for RepositoryListComponent
9. 🟢 GREEN: Implement card rendering
10. 🧪 Run E2E tests: `npm run e2e`
11. ✅ BDD scenarios validation
12. 📊 Coverage check: `npm run test:coverage` (target ≥80%)
13. 🔍 Code review checklist
14. 📝 Update current-sprint.md with Day 3 completion

**Goal:** REPO-001-US-001 100% complete, all acceptance criteria met

---

## 🧪 Testing Commands

```bash
# Unit tests (watch mode)
npm test

# Unit tests (single run)
npm test -- --watch=false

# Coverage report
npm run test:coverage
# View: open coverage/dev-dashboard/index.html

# E2E tests
npm run e2e

# Lint
npm run lint
```

---

## 📊 Coverage Targets

Must achieve **≥80%** in all categories:

- **Statements**: 80%
- **Branches**: 80%
- **Functions**: 80%
- **Lines**: 80%

**Check:** `npm run test:coverage`

---

## ⚠️ Critical Notes

### Browser Limitations

**Current Environment:** Browser (no real filesystem access)

**Solution:** Use mock data for development

**Mock Data Structure:**
```typescript
const MOCK_REPOSITORIES = [
  { 
    path: '/Users/oboukhris-palo/workspace/repo1',
    hasGit: true,
    subdirs: []
  },
  { 
    path: '/Users/oboukhris-palo/workspace/repo2',
    hasGit: true,
    subdirs: []
  },
  // Add 50+ repositories for performance testing
];
```

### Performance Testing

**RISK-S1-001:** Scanner performance > 5 seconds

**Mitigation (Day 1, Hour 7-8):**
1. Create mock dataset with 50+ repositories
2. Run scan and measure duration
3. If > 5 seconds, optimize with:
   - Parallel directory traversal (`forkJoin`)
   - Skip excluded directories early
   - Limit recursion depth

**Test:**
```typescript
it('should scan 50+ repositories in < 5 seconds', (done) => {
  const startTime = Date.now();
  service.scanWorkspaces().subscribe(result => {
    const duration = Date.now() - startTime;
    expect(duration).toBeLessThan(5000);
    expect(result.repositories.length).toBeGreaterThanOrEqual(50);
    done();
  });
}, 10000);
```

---

## 🐛 Troubleshooting

### Tests Not Running

```bash
# Clear Angular cache
rm -rf .angular/

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Import Path Errors

Verify `tsconfig.json` paths:
```json
"paths": {
  "@domain/*": ["src/app/domain/*"],
  "@services/*": ["src/app/services/*"],
  "@state/*": ["src/app/state/*"],
  "@components/*": ["src/app/components/*"]
}
```

### Coverage Not Updating

```bash
# Delete old coverage data
rm -rf coverage/

# Run fresh coverage
npm run test:coverage
```

---

## 📚 Reference Documents

### Implementation Plans
- [REPO-001-US-001 Implementation Plan](../../docs/05-implementation/epics/REPO-001/user-stories/REPO-001-US-001/implementation-plan.md)
- [REPO-001-US-002 Implementation Plan](../../docs/05-implementation/epics/REPO-001/user-stories/REPO-001-US-002/implementation-plan.md)

### User Stories
- [REPO-001-US-001 Description](../../docs/05-implementation/epics/REPO-001/user-stories/REPO-001-US-001/description.md)
- [REPO-001-US-002 Description](../../docs/05-implementation/epics/REPO-001/user-stories/REPO-001-US-002/description.md)

### Sprint Planning
- [Current Sprint](../../docs/05-implementation/current-sprint.md)
- [Project Status](../../docs/project-status.md)

---

## ✅ Definition of Done (DoD)

Before marking a story as complete:

- [ ] All acceptance criteria met
- [ ] All unit tests passing
- [ ] All integration tests passing
- [ ] All BDD scenarios passing (E2E)
- [ ] Code coverage ≥ 80%
- [ ] No linting errors
- [ ] No TypeScript errors
- [ ] Code reviewed (self-review checklist)
- [ ] Documentation updated (if needed)
- [ ] Committed with descriptive message

---

## 🎉 Ready to Start!

**Your first task:**

1. `cd /Users/oboukhris-palo/dev-dashboard/src/frontend`
2. `npm install`
3. Open `src/app/services/filesystem.service.spec.ts`
4. Find first `@todo RED` comment
5. Write failing test
6. Run `npm test`
7. Watch it fail ❌
8. Implement minimal code ✅
9. Watch it pass 🎉
10. Refactor and commit 🚀

**Good luck with Sprint 1!** 💪

---

**Questions?** Check:
- [Frontend README](README.md)
- [Implementation Plans](../../docs/05-implementation/epics/REPO-001/user-stories/)
- [Sprint Planning](../../docs/05-implementation/current-sprint.md)
