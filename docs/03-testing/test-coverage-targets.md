# Test Coverage Targets

**Project:** Dev-Dashboard  
**Version:** 1.0.0  
**Date:** 2026-05-07  
**Status:** Active

---

## Overview

This document defines coverage targets for all testing layers and maps BDD scenarios to acceptance criteria for complete traceability.

---

## 1. Unit Test Coverage Targets

### By Component Type

| Component Type | Target | Rationale |
|----------------|--------|-----------|
| **Services** | 90% | Business logic critical, must be reliable |
| **Components** | 75% | Focus on logic, skip trivial DOM |
| **Utilities** | 95% | Pure functions, easy to test |
| **Pipes** | 90% | Data transformation logic |
| **Guards** | 85% | Routing logic |
| **Directives** | 80% | DOM manipulation |

### By Epic

| Epic | Files | Target | Critical Services |
|------|-------|--------|-------------------|
| **REPO-001** (Discovery) | 8-10 | 90% | RepositoryScannerService, MetadataExtractor |
| **REPO-002** (Display) | 5-7 | 75% | RepositoryListComponent, CardComponent |
| **REPO-003** (Management) | 6-8 | 85% | EditService, PersistenceService |
| **REPO-004** (Deployment) | 2-3 | 80% | BuildScript (if Angular code) |

### Overall Target
- **Minimum**: 80% statement coverage
- **Stretch Goal**: 85% statement coverage
- **Critical Services**: 90% minimum

---

## 2. Integration Test Coverage

### Service Integration Flows

| Flow | Services Involved | Test Count | Priority |
|------|------------------|------------|----------|
| **Scan → Extract** | Scanner + Metadata | 3 tests | High |
| **Extract → Detect** | Metadata + TechDetector | 4 tests | High |
| **Scan → Display** | Scanner + State + Component | 2 tests | High |
| **Edit → Persist** | EditService + Storage | 5 tests | High |
| **Full Flow** | All services end-to-end | 2 tests | Medium |

### Component Integration

| Parent → Child | Test Count | Priority |
|----------------|------------|----------|
| Dashboard → RepositoryList | 2 tests | High |
| RepositoryList → RepositoryCard | 3 tests | High |
| RepositoryCard → EditField | 4 tests | High |

**Total Integration Tests**: ~25 tests  
**Target**: 100% of defined integration points

---

## 3. E2E Test Coverage (BDD Scenarios)

### Epic REPO-001: Repository Discovery & Scanning

#### REPO-001-US-001: Scan Workspace Directories
**Acceptance Criteria**: 5  
**BDD Scenarios**: 2

| AC | BDD Scenario | Feature File |
|----|--------------|--------------|
| Scans primary workspace | ✅ Discover repositories in primary workspace | scan-workspace.feature |
| Scans secondary workspace | ✅ Discover repositories in secondary workspace | scan-workspace.feature |
| Detects .git directories | ✅ (covered in scenario 1) | scan-workspace.feature |
| Completes in < 5s | ⚠️ Performance test (manual) | - |
| Sorts alphabetically | ⚠️ Add to display tests | display-list.feature |

**Coverage**: 3/5 ACs directly, 2/5 via other tests = **100%**

---

#### REPO-001-US-002: Extract Repository Metadata
**Acceptance Criteria**: 5  
**BDD Scenarios**: 3

| AC | BDD Scenario | Feature File |
|----|--------------|--------------|
| Extract name from dir | ✅ Extract name and path | extract-metadata.feature |
| Extract absolute path | ✅ Extract name and path | extract-metadata.feature |
| Read README.md | ✅ Parse README for description | extract-metadata.feature |
| Extract first paragraph | ✅ Parse README for description | extract-metadata.feature |
| Handle missing README | ✅ Handle missing README | extract-metadata.feature |

**Coverage**: 5/5 ACs = **100%**

---

#### REPO-001-US-003: Detect Technology Stack
**Acceptance Criteria**: 6  
**BDD Scenarios**: 3

| AC | BDD Scenario | Feature File |
|----|--------------|--------------|
| Detect Node.js (package.json) | ✅ Detect JavaScript project | detect-tech-stack.feature |
| Detect Java (pom.xml) | ⚠️ Add scenario | detect-tech-stack.feature |
| Detect .NET (*.csproj) | ⚠️ Add scenario | detect-tech-stack.feature |
| Detect Python (requirements.txt) | ⚠️ Add scenario | detect-tech-stack.feature |
| Detect Angular (angular.json) | ✅ Detect Angular project | detect-tech-stack.feature |
| Multiple technologies | ✅ Detect multi-technology project | detect-tech-stack.feature |

**Coverage**: 3/6 ACs directly = **50%** → **ACTION: Add 3 more scenarios**

---

### Epic REPO-002: Repository Information Display

#### REPO-002-US-001: Display Repository List
**Acceptance Criteria**: 5  
**BDD Scenarios**: 2

| AC | BDD Scenario | Feature File |
|----|--------------|--------------|
| Display in table/card layout | ✅ Display all repositories | display-list.feature |
| Show all columns | ✅ Display all repositories | display-list.feature |
| Renders in < 1s | ⚠️ Performance test | - |
| Responsive UI | ⚠️ Visual test (manual) | - |
| Sort by columns | ✅ Sort repositories by name | display-list.feature |

**Coverage**: 3/5 ACs directly, 2/5 manual = **100%**

---

#### REPO-002-US-002: Interactive Repository Cards
**Acceptance Criteria**: 5  
**BDD Scenarios**: 2

| AC | BDD Scenario | Feature File |
|----|--------------|--------------|
| Material Design components | ⚠️ Visual test | - |
| Hover effects | ✅ Hover interaction | interactive-cards.feature |
| Click highlights row | ⚠️ Add scenario | interactive-cards.feature |
| Truncated path with tooltip | ✅ View full path on hover | interactive-cards.feature |
| Tech stack as chips | ⚠️ Visual test | - |

**Coverage**: 2/5 ACs directly = **40%** → **ACTION: Add click scenario**

---

### Epic REPO-003: Repository Metadata Management

#### REPO-003-US-001: Edit Repository Description
**Acceptance Criteria**: 5  
**BDD Scenarios**: 3

| AC | BDD Scenario | Feature File |
|----|--------------|--------------|
| Double-click to edit | ✅ Edit description inline | edit-description.feature |
| Inline input appears | ✅ Edit description inline | edit-description.feature |
| Enter/click to save | ✅ Save edited description | edit-description.feature |
| Escape to cancel | ✅ Cancel editing | edit-description.feature |
| Changes persist | ✅ Save edited description | edit-description.feature |

**Coverage**: 5/5 ACs = **100%**

---

#### REPO-003-US-002: Edit Project Phase and Status
**Acceptance Criteria**: 4  
**BDD Scenarios**: 2

| AC | BDD Scenario | Feature File |
|----|--------------|--------------|
| Phase dropdown with options | ✅ Change project phase | edit-phase-status.feature |
| Status dropdown with options | ✅ Change project status | edit-phase-status.feature |
| Save on selection | ✅ (implied in scenarios) | edit-phase-status.feature |
| Persist across sessions | ⚠️ Add to persistence tests | persist-metadata.feature |

**Coverage**: 3/4 ACs directly = **75%** → **ACTION: Add persistence scenario**

---

#### REPO-003-US-003: Persist Metadata Locally
**Acceptance Criteria**: 4  
**BDD Scenarios**: 2

| AC | BDD Scenario | Feature File |
|----|--------------|--------------|
| Save to localStorage/file | ✅ (implementation detail) | persist-metadata.feature |
| Persist after browser refresh | ✅ Persist edits after refresh | persist-metadata.feature |
| Persist after service restart | ✅ Persist across service restart | persist-metadata.feature |
| Handle storage quota | ⚠️ Error handling test | - |

**Coverage**: 3/4 ACs directly = **75%** → **ACTION: Add quota test**

---

### Epic REPO-004: Deployment & Infrastructure

#### REPO-004-US-001: Build Production WAR File
**Acceptance Criteria**: 4  
**BDD Scenarios**: 1

| AC | BDD Scenario | Feature File |
|----|--------------|--------------|
| Angular prod build | ✅ Build WAR file | build-war.feature |
| Package as WAR | ✅ Build WAR file | build-war.feature |
| Self-contained | ✅ (verification in scenario) | build-war.feature |
| Build script documented | ⚠️ Documentation review | - |

**Coverage**: 3/4 ACs directly = **75%**

---

#### REPO-004-US-002: Deploy to Apache Service
**Acceptance Criteria**: Not fully defined in user stories
**BDD Scenarios**: Expected 2-3 scenarios

**ACTION**: Define acceptance criteria and BDD scenarios for deployment story.

---

## 4. BDD Coverage Summary

### Overall Coverage

| Epic | Stories | ACs Total | ACs Covered | BDD Scenarios | Coverage % |
|------|---------|-----------|-------------|---------------|------------|
| REPO-001 | 3 | 16 | 13 | 8 | 81% |
| REPO-002 | 2 | 10 | 7 | 4 | 70% |
| REPO-003 | 3 | 13 | 11 | 7 | 85% |
| REPO-004 | 2 | 4+ | 3 | 1 | 75% |
| **TOTAL** | **10** | **43+** | **34** | **20** | **79%** |

### Gap Analysis

**Actions Required to Reach 95% Coverage:**

1. **REPO-001-US-003**: Add 3 scenarios for Java, .NET, Python detection
2. **REPO-002-US-002**: Add 1 scenario for click interaction
3. **REPO-003-US-002**: Add 1 scenario for phase/status persistence
4. **REPO-003-US-003**: Add 1 scenario for storage quota handling
5. **REPO-004-US-002**: Define 2-3 scenarios for Apache deployment

**Total New Scenarios Needed**: 8-9  
**Projected Coverage After Additions**: **95%+**

---

## 5. Non-Functional Test Coverage

### Performance Tests

| Requirement | Target | Test Method | Priority |
|-------------|--------|-------------|----------|
| Scan 100 repos | < 5s | Automated timing test | High |
| Initial render | < 1s | Lighthouse CI | High |
| Edit responsiveness | < 100ms | Manual + automated | Medium |
| Memory usage | < 100MB | Chrome DevTools profile | Medium |
| Bundle size | < 500KB gzip | Webpack analyzer | Low |

**Coverage**: 5/5 performance requirements = **100%**

---

### Security Tests

| Check | Method | Frequency | Priority |
|-------|--------|-----------|----------|
| XSS vulnerabilities | Manual review + ESLint | Per PR | High |
| Dependency CVEs | npm audit | Weekly | High |
| Path traversal | Unit tests | Per release | High |
| Input validation | Integration tests | Per PR | Medium |
| Secrets in code | Git pre-commit | Per commit | Medium |

**Coverage**: 5/5 security checks = **100%**

---

## 6. Coverage Tracking

### Measurement Tools
- **Unit Tests**: Istanbul/nyc (built into Angular CLI)
- **Integration Tests**: Istanbul/nyc
- **E2E Tests**: Playwright coverage (optional)
- **Overall**: Combined coverage report

### Reporting
- **Per PR**: Coverage report posted as comment
- **Dashboard**: Coverage badge in README
- **Trend**: Track coverage over time (weekly)

### Enforcement
- **Gate**: Block merge if coverage < 80%
- **Warning**: Flag if coverage decreases by > 2%
- **Review**: Manual review if critical service < 90%

---

## 7. Testing Roadmap

### Phase 5: Testing Strategy (Current)
- ✅ Define testing approach
- ✅ Set coverage targets
- ✅ Map BDD scenarios to ACs
- ⚠️ Identify gaps (8-9 scenarios needed)
- ⏳ Create feature files

### Phase 6: Implementation (Next)
- Write unit tests (TDD approach)
- Write integration tests
- Implement E2E tests (Playwright)
- Achieve 80%+ coverage

### Phase 7: Continuous Improvement
- Add missing BDD scenarios (gaps)
- Increase coverage to 85%+
- Optimize test execution time
- Add visual regression tests (optional)

---

**Status:** ACTIVE | **Version:** 1.0 | **Last Updated:** 2026-05-07
