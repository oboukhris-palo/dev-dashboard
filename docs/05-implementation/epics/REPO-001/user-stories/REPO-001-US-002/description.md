---
generated_from_template: user-story-tmpl.yml
generation_date: 2026-05-07
generator_agent: product-owner
story_key: REPO-001-US-002
epic_key: REPO-001
project_key: dev-dashboard
priority: High
status: To Do
story_points: 3
---

# REPO-001-US-002: Extract Repository Metadata

## User Story

**As a** developer  
**I want** repository metadata extracted automatically  
**So that** I don't have to manually enter basic information

---

## Acceptance Criteria

- [ ] Extract repository name from directory name
- [ ] Extract absolute path to repository
- [ ] Read README.md if present
- [ ] Extract first paragraph of README as default description
- [ ] Handle missing README files gracefully (empty description)

---

## BDD Scenarios

```gherkin
Feature: Metadata Extraction

  Scenario: Extract name and path
    Given a repository exists at "/Users/oboukhris-palo/workspace/my-project"
    When the scanner processes this repository
    Then the name is extracted as "my-project"
    And the path is stored as "/Users/oboukhris-palo/workspace/my-project"

  Scenario: Parse README for description
    Given a repository contains a README.md file
    And the README contains text content
    When metadata is extracted
    Then the first paragraph is used as the description
    And markdown formatting is stripped

  Scenario: Handle missing README
    Given a repository has no README.md file
    When metadata is extracted
    Then the description field is empty
    And no error is thrown
```

---

## Dependencies

### Prerequisites
- REPO-001-US-001 (Scan Workspace Directories) must be completed
- Repository data structure defined with fields: name, path, description

### Blocks
- REPO-002-US-001 (Display Repository List) - Cannot display metadata until it's extracted

---

## Technical Constraints

**From [Architecture Design](../../../02-architecture/architecture-design.md):**
- README parsing must handle markdown syntax (strip formatting)
- First paragraph defined as: text until first blank line
- Description max length: 500 characters (truncate if longer)
- Metadata extraction must be synchronous per repository (async across repositories)

**Technology Stack:**
- Node.js `fs.promises.readFile` for README access
- Markdown parser library (e.g., `marked` or `commonmark`) for stripping formatting
- Regular expressions for paragraph extraction

**Error Handling:**
- If README read fails (permissions, encoding), set description to empty string
- Log errors to console without blocking metadata extraction
- Continue extraction for other repositories

---

## Implementation Notes

**Metadata Extraction Algorithm:**
1. For each discovered repository:
   - Extract name from directory name (e.g., `/path/to/my-project` → `my-project`)
   - Store absolute path as-is
   - Check for `README.md` existence
   - If README exists:
     - Read file contents (UTF-8 encoding)
     - Strip markdown formatting
     - Extract first paragraph (text until first blank line)
     - Truncate to 500 characters if needed
   - If README missing or read fails:
     - Set description to empty string

**Data Structure:**
```typescript
interface Repository {
  name: string;           // Extracted from directory name
  path: string;           // Absolute file system path
  description: string;    // First paragraph from README (empty if no README)
  devStack: string[];     // Populated by REPO-001-US-003
  phase: string;          // Default: empty (set by user later)
  status: string;         // Default: empty (set by user later)
}
```

---

## Test Strategy

**Unit Tests:**
- Test name extraction from various path formats
- Test README parsing with markdown formatting
- Test first paragraph extraction
- Test truncation at 500 characters
- Test empty description when README missing

**Integration Tests:**
- Test metadata extraction for repository with README
- Test metadata extraction for repository without README
- Test handling of malformed README files

**BDD Tests:**
- Implement all three Gherkin scenarios above
- Verify description appears in dashboard after extraction

---

## Related Documents

- [Architecture Design](../../../02-architecture/architecture-design.md) - Section: Metadata Extraction
- [Tech Spec](../../../02-architecture/tech-spec.md) - Section: Data Model
- [Test Strategies](../../../03-testing/test-strategies.md) - Feature: repo-001-discovery/extract-metadata.feature
