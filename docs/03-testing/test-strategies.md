# Testing Strategy

**Project:** Dev-Dashboard  
**Version:** 1.0.0  
**Date:** 2026-05-07  
**Status:** Active  
**Owner:** Dev-Lead, QA Engineer

---

## Overview

This document defines the comprehensive testing strategy for the Dev-Dashboard application. The strategy covers unit, integration, end-to-end, performance, and security testing across all layers of the Angular Material SPA.

**Testing Philosophy:**
- **Test-Driven Development (TDD)**: Write tests before implementation
- **BDD Scenarios**: All user stories have executable BDD scenarios (Gherkin)
- **Coverage Targets**: 80%+ unit test coverage, 100% BDD coverage for acceptance criteria
- **Fast Feedback**: Unit tests < 1s, integration tests < 10s, E2E tests < 30s per scenario

---

## Testing Pyramid

```
           /\
          /  \         E2E Tests (10%)
         /    \        - User journey flows
        /------\       - Critical paths only
       /        \      
      /          \     Integration Tests (20%)
     /            \    - Service layer
    /--------------\   - State management
   /                \  - API contracts
  /------------------\ 
 /                    \ Unit Tests (70%)
/______________________\ - Components, services, utilities
```

---

## 1. Unit Testing

### Scope
- **Angular Components**: Business logic, event handlers, lifecycle hooks
- **Services**: Repository scanner, metadata parser, tech stack detector
- **Utilities**: File system helpers, README parser, sorting functions
- **State Management**: Elf stores (if used)

### Framework & Tools
- **Test Runner**: Jasmine + Karma (Angular default)
- **Utilities**: Angular Testing Library, jasmine-marbles (RxJS testing)
- **Coverage Tool**: Istanbul/nyc

### Coverage Targets
- **Overall**: 80%+ code coverage
- **Critical Services**: 90%+ coverage (scanner, metadata extractor)
- **Components**: 75%+ coverage (business logic only, not DOM)
- **Utilities**: 95%+ coverage (pure functions)

### Unit Test Guidelines
1. **Arrange-Act-Assert (AAA)** pattern for all tests
2. **Mock external dependencies** (filesystem, HTTP, browser APIs)
3. **Test behavior, not implementation** (avoid testing private methods)
4. **Keep tests fast** (< 100ms per test, no setTimeout unless necessary)
5. **One assertion per test** (or related assertions for same behavior)

### Example Unit Test Structure
```typescript
describe('RepositoryScannerService', () => {
  let service: RepositoryScannerService;
  let fileSystemMock: jasmine.SpyObj<FileSystemService>;

  beforeEach(() => {
    fileSystemMock = jasmine.createSpyObj('FileSystemService', ['readDir']);
    service = new RepositoryScannerService(fileSystemMock);
  });

  it('should identify git repositories by .git folder', () => {
    // Arrange
    fileSystemMock.readDir.and.returnValue(['.git', 'src', 'README.md']);
    
    // Act
    const isRepo = service.isGitRepository('/path/to/project');
    
    // Assert
    expect(isRepo).toBe(true);
  });
});
```

---

## 2. Integration Testing

### Scope
- **Service Layer Integration**: Scanner + Metadata + Tech Detection services working together
- **State Management**: Elf store updates trigger component re-renders
- **File System Operations**: Real filesystem interactions (sandboxed test directories)
- **Component Integration**: Parent-child component communication

### Framework & Tools
- **Test Runner**: Jasmine + Karma
- **Test Utilities**: Angular TestBed with real providers (no mocks)
- **Sandbox**: Temporary test directories for filesystem operations

### Coverage Targets
- **User Story Workflows**: 100% coverage (all acceptance criteria tested)
- **Component Interactions**: All parent-child flows tested
- **State Flows**: All Elf store mutations and selectors tested

### Integration Test Guidelines
1. **Use real services** (no mocks) to test integration points
2. **Setup/teardown test data** (create/delete test repos in `/tmp`)
3. **Test happy paths + error paths** (missing files, permission errors)
4. **Keep tests isolated** (no shared state between tests)
5. **Run in CI/CD pipeline** (must pass before merge)

### Example Integration Test Structure
```typescript
describe('Repository Discovery Flow', () => {
  let scanner: RepositoryScannerService;
  let metadata: MetadataService;
  let testRepoPath: string;

  beforeEach(() => {
    testRepoPath = createTempRepository(); // Helper creates test repo
    scanner = TestBed.inject(RepositoryScannerService);
    metadata = TestBed.inject(MetadataService);
  });

  afterEach(() => {
    deleteTempRepository(testRepoPath);
  });

  it('should scan, extract metadata, and display repository', async () => {
    // Scan workspace
    const repos = await scanner.scan([testRepoPath]);
    expect(repos.length).toBe(1);

    // Extract metadata
    const enriched = await metadata.enrich(repos[0]);
    expect(enriched.name).toBe('test-repo');
    expect(enriched.description).toContain('Test project');
  });
});
```

---

## 3. End-to-End (E2E) Testing

### Scope
- **User Journeys**: Complete flows from user perspective
- **Critical Paths**: Repository scan → display → edit → persist
- **Browser Testing**: Real browser interactions (Chrome, Firefox)

### Framework & Tools
- **Test Runner**: Playwright (modern, fast, reliable)
- **Alternative**: Cypress (if team prefers)
- **Test Organization**: Feature files matching BDD scenarios

### Coverage Targets
- **User Stories**: 100% BDD scenario coverage
- **Critical Paths**: All happy paths + major error paths
- **Browser Support**: Chrome (primary), Firefox (secondary)

### E2E Test Guidelines
1. **Follow BDD scenarios exactly** (Gherkin → Playwright steps)
2. **Use Page Object Model (POM)** for maintainability
3. **Test real user interactions** (clicks, typing, navigation)
4. **Avoid implementation details** (no class names, use data-testid)
5. **Keep tests independent** (no test depends on another)
6. **Run nightly or pre-release** (slower than unit tests)

### Example E2E Test Structure
```typescript
// features/repository-discovery.spec.ts
import { test, expect } from '@playwright/test';
import { DashboardPage } from './pages/dashboard.page';

test.describe('Repository Discovery', () => {
  test('should discover repositories in primary workspace', async ({ page }) => {
    // Given the application loads
    const dashboard = new DashboardPage(page);
    await dashboard.navigate();

    // When the scanner runs on workspace directory
    await dashboard.waitForScanComplete();

    // Then all git repositories are identified
    const repos = await dashboard.getRepositoryList();
    expect(repos.length).toBeGreaterThan(0);
    
    // And each repository appears in the dashboard
    repos.forEach(repo => {
      expect(repo.name).toBeTruthy();
      expect(repo.path).toContain('/workspace/');
    });
  });
});
```

---

## 4. Performance Testing

### Scope
- **Scan Performance**: Scan 100+ repositories in < 5 seconds
- **UI Rendering**: Initial render < 1 second
- **Interaction Responsiveness**: Edits reflect in < 100ms
- **Memory Usage**: No memory leaks during long sessions

### Framework & Tools
- **Browser DevTools**: Chrome Performance profiler
- **Lighthouse**: Core Web Vitals measurement
- **Custom Metrics**: Angular performance monitoring

### Performance Targets
| Metric | Target | Measurement |
|--------|--------|-------------|
| Repository Scan | < 5 seconds (100 repos) | Scanner service timing |
| Initial Load | < 1 second | LCP (Largest Contentful Paint) |
| Edit Interaction | < 100ms | User input → UI update |
| Memory Usage | < 100MB baseline | Chrome DevTools Memory |
| Bundle Size | < 500KB (gzip) | Webpack bundle analyzer |

### Performance Test Guidelines
1. **Test with realistic data** (50-100 repositories)
2. **Profile before optimizing** (measure, don't guess)
3. **Set performance budgets** in CI/CD (fail if exceeded)
4. **Test on lower-end hardware** (not just developer machines)

---

## 5. Security Testing

### Scope
- **Input Validation**: Sanitize file paths, descriptions
- **XSS Prevention**: No unescaped user input in DOM
- **Local Storage Security**: Encrypt sensitive data if needed
- **Dependency Vulnerabilities**: Regular npm audit scans

### Framework & Tools
- **Static Analysis**: ESLint security plugin
- **Dependency Scanning**: npm audit, Snyk
- **Manual Review**: Code review checklist

### Security Targets
| Check | Target | Tool |
|-------|--------|------|
| XSS Vulnerabilities | 0 | Manual review + ESLint |
| SQL Injection | N/A (no database) | - |
| Dependency CVEs | 0 critical, 0 high | npm audit |
| Path Traversal | Prevented | Unit tests |
| Secrets in Code | 0 | Git pre-commit hook |

### Security Test Guidelines
1. **Validate all user inputs** (descriptions, file paths)
2. **Run npm audit weekly** (fix critical/high immediately)
3. **Use Angular DomSanitizer** for any dynamic HTML
4. **Test path traversal attacks** (`../../etc/passwd`)
5. **Code review security checklist** before merge

---

## 6. BDD Scenario Consolidation

### Organization
All BDD scenarios from user stories are consolidated into feature files organized by epic:

```
docs/03-testing/features/
├── repo-001-discovery/
│   ├── scan-workspace.feature
│   ├── extract-metadata.feature
│   └── detect-tech-stack.feature
├── repo-002-display/
│   ├── display-list.feature
│   └── interactive-cards.feature
├── repo-003-management/
│   ├── edit-description.feature
│   ├── edit-phase-status.feature
│   └── persist-metadata.feature
└── repo-004-deployment/
    ├── build-war.feature
    └── deploy-apache.feature
```

### BDD Coverage
- **User Stories**: 10 stories with BDD scenarios
- **Acceptance Criteria Mapped**: 1:1 or 1:N (100% coverage)
- **Feature Files**: 8 files (one per user story)
- **Scenarios**: ~25 total scenarios

See `test-coverage-targets.md` for detailed BDD-to-AC mapping.

---

## 7. Test Data Strategy

### Test Repositories
Create mock repositories in `/tmp/dev-dashboard-test/` with various characteristics:

1. **Minimal Repo**: Just `.git` folder, no README
2. **Node.js Repo**: `package.json`, `angular.json`, README with description
3. **Java Repo**: `pom.xml`, README
4. **Multi-Tech Repo**: `package.json`, `requirements.txt`, `pom.xml`
5. **Large Repo**: 100+ files (performance testing)
6. **Edge Cases**: Special characters in name, deeply nested path

### Test Fixtures
- **Repository Metadata**: JSON files with sample data
- **README Content**: Various formats (short, long, empty, malformed)
- **Tech Stack Files**: Sample `package.json`, `pom.xml`, etc.

See `test-data-strategy.md` for detailed fixtures.

---

## 8. Test Environment

### Local Development
- **OS**: macOS (primary developer machine)
- **Browser**: Chrome 130+ (for E2E tests)
- **Node.js**: 20.x LTS
- **Angular**: 18.x

### CI/CD (Optional)
- **GitHub Actions**: Run unit + integration tests on PR
- **Nightly E2E**: Run full E2E suite once per night
- **Coverage Gates**: Block merge if < 80% coverage

---

## 9. Test Execution Schedule

### Developer Workflow
1. **Pre-commit**: Run affected unit tests (< 10s)
2. **Pre-push**: Run all unit tests (< 30s)
3. **PR Review**: Run unit + integration tests in CI

### Release Workflow
1. **Pre-release**: Run full test suite (unit + integration + E2E)
2. **Performance Check**: Run Lighthouse, verify targets met
3. **Security Scan**: Run npm audit, fix critical issues

### Continuous Monitoring
- **Weekly**: npm audit + dependency updates
- **Monthly**: Manual security review
- **Quarterly**: Load testing with 500+ repositories

---

## 10. Quality Gates

### Phase 5 Exit Criteria (Testing Strategy)
- ✅ BDD scenarios cover 100% of acceptance criteria
- ✅ Unit test coverage targets defined (80%+)
- ✅ Integration test strategy documented
- ✅ E2E test framework selected (Playwright)
- ✅ Performance targets established
- ✅ Security testing approach defined
- ✅ Test data and fixtures strategy documented

See `.github/gates/gate-03-testing.md` for detailed gate checklist.

---

## Appendix: Testing Resources

### Documentation
- [Angular Testing Guide](https://angular.io/guide/testing)
- [Playwright Documentation](https://playwright.dev/)
- [BDD with Gherkin](https://cucumber.io/docs/gherkin/)

### Tools
- [Jasmine](https://jasmine.github.io/)
- [Karma](https://karma-runner.github.io/)
- [Playwright](https://playwright.dev/)
- [Istanbul](https://istanbul.js.org/)

### Internal
- `test-coverage-targets.md` — Detailed coverage matrix
- `test-data-strategy.md` — Test fixtures and datasets
- `non-functional-testing-plan.md` — Performance and security details

---

**Status:** ACTIVE | **Version:** 1.0 | **Last Updated:** 2026-05-07
