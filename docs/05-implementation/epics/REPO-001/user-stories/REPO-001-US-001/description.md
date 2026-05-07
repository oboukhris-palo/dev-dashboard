---
generated_from_template: user-story-tmpl.yml
generation_date: 2026-05-07
generator_agent: product-owner
story_key: REPO-001-US-001
epic_key: REPO-001
project_key: dev-dashboard
priority: High
status: To Do
story_points: 5
---

# REPO-001-US-001: Scan Workspace Directories

## User Story

**As a** developer  
**I want** the application to automatically scan my workspace directories  
**So that** I can see all my code repositories without manual configuration

---

## Acceptance Criteria

- [ ] Application scans `/Users/oboukhris-palo/workspace` on load
- [ ] Application scans `/Users/oboukhris-palo/Documents/workspace` on load
- [ ] Scan detects presence of `.git` directory to identify repositories
- [ ] Scan completes within 5 seconds
- [ ] Repositories are sorted alphabetically by name

---

## BDD Scenarios

```gherkin
Feature: Repository Discovery

  Scenario: Discover repositories in primary workspace
    Given the application loads
    When the scanner runs on "/Users/oboukhris-palo/workspace"
    Then all directories containing ".git" folders are identified as repositories
    And each repository appears in the dashboard

  Scenario: Discover repositories in secondary workspace
    Given the application loads
    When the scanner runs on "/Users/oboukhris-palo/Documents/workspace"
    Then all git repositories are discovered
    And repositories from both workspaces are combined in the list
```

---

## Dependencies

### Prerequisites
- File system read access to workspace directories
- Node.js `fs` module or Angular service for file system operations

### Blocks
- REPO-001-US-002 (Extract Repository Metadata) - Cannot extract metadata until repositories are discovered
- REPO-002-US-001 (Display Repository List) - Cannot display repositories until they are discovered

---

## Technical Constraints

**From [Architecture Design](../../../02-architecture/architecture-design.md):**
- Scanning must be asynchronous (non-blocking UI)
- Recursive directory traversal required (max depth: 3 levels to avoid deep nesting)
- Performance target: < 5 seconds for 30 repositories
- Memory constraint: < 50MB for repository list in memory

**Technology Stack:**
- Angular service for scanning logic
- Node.js `fs.promises` API for async file operations
- RxJS Observables for reactive scanning updates

**Error Handling:**
- Gracefully handle permission denied errors (skip inaccessible directories)
- Log errors to console without blocking scan completion
- Display warning banner if scan fails

---

## Implementation Notes

**Scanning Algorithm:**
1. Read both workspace directory paths from configuration
2. For each workspace, recursively traverse directories (max depth: 3)
3. Check for `.git` directory presence to identify repositories
4. Extract directory name as repository name
5. Store repository path as absolute path
6. Sort results alphabetically by name

**Configuration:**
```typescript
const WORKSPACE_PATHS = [
  '/Users/oboukhris-palo/workspace',
  '/Users/oboukhris-palo/Documents/workspace'
];
const MAX_SCAN_DEPTH = 3;
const SCAN_TIMEOUT_MS = 5000;
```

---

## Test Strategy

**Unit Tests:**
- Test recursive directory traversal
- Test `.git` directory detection
- Test alphabetical sorting
- Test scan timeout handling

**Integration Tests:**
- Test scanning both workspace directories
- Test combining results from multiple workspaces
- Test performance with 30+ repositories

**BDD Tests:**
- Implement both Gherkin scenarios above
- Verify repositories appear in dashboard after scan

---

## Related Documents

- [Architecture Design](../../../02-architecture/architecture-design.md) - Section: Repository Scanning
- [Tech Spec](../../../02-architecture/tech-spec.md) - Section: File System Access
- [Test Strategies](../../../03-testing/test-strategies.md) - Feature: repo-001-discovery/scan-workspace.feature
