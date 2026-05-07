---
generated_from_template: user-story-tmpl.yml
generation_date: 2026-05-07
generator_agent: product-owner
story_key: REPO-001-US-003
epic_key: REPO-001
project_key: dev-dashboard
priority: Medium
status: To Do
story_points: 3
---

# REPO-001-US-003: Detect Technology Stack

## User Story

**As a** developer  
**I want** the technology stack detected automatically  
**So that** I know what technologies are used without opening files

---

## Acceptance Criteria

- [ ] Detect Node.js/JavaScript from `package.json`
- [ ] Detect Java/Maven from `pom.xml`
- [ ] Detect .NET/C# from `*.csproj` files
- [ ] Detect Python from `requirements.txt` or `pyproject.toml`
- [ ] Detect Angular from `angular.json`
- [ ] Support multiple technologies per repository (e.g., "Angular, Node.js")

---

## BDD Scenarios

```gherkin
Feature: Technology Stack Detection

  Scenario: Detect JavaScript project
    Given a repository contains "package.json"
    When technology detection runs
    Then "Node.js" is added to the tech stack

  Scenario: Detect Angular project
    Given a repository contains "angular.json"
    When technology detection runs
    Then "Angular" is added to the tech stack

  Scenario: Detect multi-technology project
    Given a repository contains "package.json" and "requirements.txt"
    When technology detection runs
    Then "Node.js, Python" is displayed as the tech stack
```

---

## Dependencies

### Prerequisites
- REPO-001-US-001 (Scan Workspace Directories) must be completed
- Repository paths available for file detection

### Blocks
- REPO-002-US-001 (Display Repository List) - Tech stack must be detected before display

---

## Technical Constraints

**From [Architecture Design](../../../02-architecture/architecture-design.md):**
- Detection must check for specific file markers (not file contents)
- Multiple technologies should be comma-separated string
- Detection order: Angular, Node.js, Java, .NET, Python (alphabetical for display)
- Technology detection must be fast (< 100ms per repository)

**Technology Stack:**
- Node.js `fs.promises.access` for file existence checks
- No file content parsing required (only check file existence)

**Detection Rules:**
```typescript
const TECH_MARKERS = {
  'Angular': ['angular.json'],
  'Node.js': ['package.json'],
  'Java': ['pom.xml'],
  '.NET': ['*.csproj'],  // Glob pattern
  'Python': ['requirements.txt', 'pyproject.toml']
};
```

---

## Implementation Notes

**Technology Detection Algorithm:**
1. For each discovered repository:
   - Check for presence of marker files
   - For `.csproj`, use glob pattern to match any file ending in `.csproj`
   - Collect all detected technologies
   - Sort alphabetically for consistent display
   - Join with comma separator (e.g., "Angular, Node.js, Python")
   - Store in `devStack` field

**Data Structure Update:**
```typescript
interface Repository {
  // ... existing fields
  devStack: string[];  // Array of detected technologies, e.g., ['Angular', 'Node.js']
}
```

**Display Format:**
- Array join with ", " separator: `['Angular', 'Node.js']` → `"Angular, Node.js"`

---

## Test Strategy

**Unit Tests:**
- Test detection of each technology individually
- Test multi-technology detection
- Test repository with no detectable technologies (empty array)
- Test glob pattern matching for `*.csproj`

**Integration Tests:**
- Test detection across multiple repositories
- Test performance (< 100ms per repository)

**BDD Tests:**
- Implement all three Gherkin scenarios above
- Verify tech stack appears in dashboard after detection

---

## Related Documents

- [Architecture Design](../../../02-architecture/architecture-design.md) - Section: Technology Detection
- [Tech Spec](../../../02-architecture/tech-spec.md) - Section: File Markers
- [Test Strategies](../../../03-testing/test-strategies.md) - Feature: repo-001-discovery/detect-tech-stack.feature
