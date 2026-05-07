# Implementation Plan: REPO-001-US-002 — Extract Repository Metadata

**Story Key:** REPO-001-US-002  
**Story Title:** Extract Repository Metadata  
**Epic:** REPO-001 — Repository Discovery & Scanning  
**Priority:** High (Critical Path)  
**Story Points:** 3  
**Estimated Duration:** 2 days (8-10 hours)

**Created:** 2026-05-07 (Dev-Lead)  
**Status:** Ready for Implementation

---

## Story Overview

**User Story:**
> As a developer  
> I want repository metadata extracted automatically  
> So that I don't have to manually enter basic information

**Acceptance Criteria:**
- [ ] Extract repository name from directory name
- [ ] Extract absolute path to repository
- [ ] Read README.md if present
- [ ] Extract first paragraph of README as default description
- [ ] Handle missing README files gracefully (empty description)

---

## Layer-by-Layer Implementation Plan

### Layer 1: Domain Models (Enhancement)

**Objective:** Extend existing Repository model with metadata fields

**Tasks:**
- [ ] Update `Repository` interface
  - [ ] Add property: `description?: string` (optional, from README)
  - [ ] Add property: `readmeExists: boolean`
  - [ ] Add property: `readmeFirstParagraph?: string`
- [ ] Create `RepositoryMetadata` interface (if needed)
  - [ ] Properties: `name: string`, `path: string`, `description: string`, `readmeExists: boolean`

**Files to Create/Modify:**
- `src/app/models/repository.model.ts` (modify)
- `src/app/models/repository-metadata.model.ts` (optional)

**BDD Coverage:**
- ✅ Domain models support metadata extraction requirements

**Definition of Done:**
- [ ] Repository interface updated with description field
- [ ] TypeScript strict checks passing
- [ ] JSDoc comments updated

**Estimated Time:** 1 hour

---

### Layer 2: Core Services (Business Logic)

**Objective:** Implement README parsing and metadata extraction

**Tasks:**
- [ ] Create `ReadmeParserService`
  - [ ] Method: `async readReadme(repoPath: string): Promise<string | null>` — Read README.md file
  - [ ] Method: `extractFirstParagraph(content: string): string` — Parse first paragraph
  - [ ] Method: `stripMarkdown(content: string): string` — Remove markdown formatting
  - [ ] Supported files: README.md, Readme.md, readme.md (case-insensitive check)
  - [ ] Error handling: File not found, empty file, invalid encoding
- [ ] Create `MetadataExtractorService`
  - [ ] Method: `async extractMetadata(repo: Repository): Promise<Repository>` — Orchestration
  - [ ] Method: `extractName(path: string): string` — Extract name from path
  - [ ] Method: `async extractDescription(path: string): Promise<string>` — Read and parse README
  - [ ] Integration with `ReadmeParserService`
- [ ] Update `RepositoryScannerService` (from US-001)
  - [ ] Call `MetadataExtractorService.extractMetadata()` for each discovered repository
  - [ ] Enrich Repository objects with metadata before returning

**Files to Create:**
- `src/app/services/readme-parser.service.ts`
- `src/app/services/readme-parser.service.spec.ts`
- `src/app/services/metadata-extractor.service.ts`
- `src/app/services/metadata-extractor.service.spec.ts`

**Files to Modify:**
- `src/app/services/repository-scanner.service.ts` (add metadata extraction)
- `src/app/services/repository-scanner.service.spec.ts` (update tests)

**BDD Coverage:**
- ✅ Scenario: "Extract name and path"
- ✅ Scenario: "Parse README for description"
- ✅ Scenario: "Handle missing README"

**Technical Constraints:**
- Use Node.js `fs/promises.readFile()` OR mock for browser
- Markdown stripping: Use regex for simple cases (bold, italic, headers)
- First paragraph: Split by double newline `\n\n`, take first non-empty block
- Character limit: Truncate description to 200 characters if longer

**Definition of Done:**
- [ ] README parsing works for common markdown formats
- [ ] Graceful handling of missing/empty README files
- [ ] Unit test coverage ≥ 80%
- [ ] Integration test: Scanner → Metadata → Complete Repository object

**Estimated Time:** 6 hours

---

### Layer 3: State Management (Data Flow)

**Objective:** Update state management to include metadata

**Tasks:**
- [ ] Update `RepositoryStore` (or state service)
  - [ ] No changes needed (already handles Repository objects)
  - [ ] Verify description field is persisted in state
- [ ] Update selectors (if applicable)
  - [ ] Selector: `selectRepositoriesWithDescription()` — Filter repos with descriptions
  - [ ] Selector: `selectRepositoryCount()` — Get total count

**Files to Modify:**
- `src/app/state/repository.store.ts` (verify, no changes likely)
- `src/app/state/repository.query.ts` (add selectors if using Elf)

**BDD Coverage:**
- ✅ Metadata flows through state management

**Definition of Done:**
- [ ] State includes description field
- [ ] Selectors tested
- [ ] No breaking changes to existing state

**Estimated Time:** 1 hour

---

### Layer 4: UI Components (User Interface)

**Objective:** Display repository metadata in UI (basic list)

**Tasks:**
- [ ] Update `RepositoryListComponent` (from US-001)
  - [ ] Display repository name (bold)
  - [ ] Display repository path (truncated, with tooltip)
  - [ ] Display description (first 100 chars, with "..." if truncated)
  - [ ] Show placeholder text if no description: "(No description)"
- [ ] Add basic styling
  - [ ] Use Material Design typography
  - [ ] Card-like layout (prepare for Sprint 2 Material table)

**Files to Modify:**
- `src/app/components/repository-list/repository-list.component.html`
- `src/app/components/repository-list/repository-list.component.css`
- `src/app/components/repository-list/repository-list.component.ts`

**BDD Coverage:**
- ✅ Repository metadata displayed in UI

**Definition of Done:**
- [ ] Name, path, and description displayed
- [ ] UI is readable and clean
- [ ] Responsive (works on different screen sizes)

**Estimated Time:** 2 hours

---

## Architectural Constraints

### From architecture-design.md
- **Markdown Parsing:** Keep it simple — regex-based stripping for MVP
- **Description Length:** Truncate to 200 characters max
- **README Detection:** Case-insensitive (README.md, Readme.md, readme.md)
- **Performance:** Metadata extraction should not slow scan significantly (< 1 second overhead per repo)

### Technology Stack
- Angular 18+
- TypeScript 5+
- Node.js fs API (if Electron) OR mock data (if browser)
- Regex for markdown stripping (no external library needed)

### Design Patterns
- Service Layer pattern (ReadmeParserService, MetadataExtractorService)
- Strategy pattern (different README parsing strategies)
- Null Object pattern (empty description if README missing)

---

## Agent Communication Notes

### For TDD-Orchestrator
- **Depends on US-001:** Scanner must be working before starting this story
- **Start with Layer 2:** README parsing is the core logic (6 hours)
- **Test with real READMEs:** Use actual README files from test repositories
- **Edge cases matter:** Empty files, binary files, very long READMEs

### For TDD-RED Agent
- Write failing tests for `ReadmeParserService.extractFirstParagraph()`
- Test edge cases:
  - Empty README
  - README with only headers (no paragraphs)
  - README with code blocks (should skip)
  - Very long paragraph (truncate to 200 chars)
- Test markdown stripping:
  - `**bold**` → `bold`
  - `# Header` → `Header`
  - `[link](url)` → `link`

### For TDD-GREEN Agent
- Implement README reading with `fs.promises.readFile()`
- Use UTF-8 encoding
- First paragraph extraction:
  ```typescript
  const paragraphs = content.split(/\n\n+/).filter(p => p.trim().length > 0);
  return paragraphs[0] || '';
  ```
- Markdown stripping (simple regex):
  ```typescript
  let plain = text.replace(/\*\*(.+?)\*\*/g, '$1'); // bold
  plain = plain.replace(/\*(.+?)\*/g, '$1'); // italic
  plain = plain.replace(/^#+\s+/gm, ''); // headers
  plain = plain.replace(/\[(.+?)\]\(.+?\)/g, '$1'); // links
  return plain;
  ```

### For TDD-REFACTOR Agent
- Extract regex patterns to constants
- Consider using a lightweight markdown library (e.g., `marked` or `markdown-it`) if regex becomes complex
- Add caching for README content (avoid re-reading same file)
- Optimize for batch processing (read multiple READMEs in parallel)

---

## BDD Scenario Mapping

### Scenario 1: Extract name and path
**Acceptance Criteria Covered:** ✅ AC-1, AC-2  
**Layers Involved:** Layer 2 (Extractor)  
**Test Location:** `metadata-extractor.service.spec.ts`

**Gherkin:**
```gherkin
Given a repository exists at "/Users/oboukhris-palo/workspace/my-project"
When the scanner processes this repository
Then the name is extracted as "my-project"
And the path is stored as "/Users/oboukhris-palo/workspace/my-project"
```

**Test Strategy:**
- Mock repository with known path
- Assert `extractName()` returns last segment of path
- Assert path is absolute and unchanged

---

### Scenario 2: Parse README for description
**Acceptance Criteria Covered:** ✅ AC-3, AC-4  
**Layers Involved:** Layer 2 (Parser, Extractor)  
**Test Location:** `readme-parser.service.spec.ts`

**Gherkin:**
```gherkin
Given a repository contains a README.md file
And the README contains text content
When metadata is extracted
Then the first paragraph is used as the description
And markdown formatting is stripped
```

**Test Strategy:**
- Create test README with multiple paragraphs
- Mock filesystem to return test README content
- Assert first paragraph extracted correctly
- Assert markdown formatting removed (**, *, #, links)

---

### Scenario 3: Handle missing README
**Acceptance Criteria Covered:** ✅ AC-5  
**Layers Involved:** Layer 2 (Parser, Extractor)  
**Test Location:** `readme-parser.service.spec.ts`

**Gherkin:**
```gherkin
Given a repository has no README.md file
When metadata is extracted
Then the description field is empty
And no error is thrown
```

**Test Strategy:**
- Mock filesystem to return "file not found" error
- Assert `readReadme()` returns `null`
- Assert `extractDescription()` returns empty string
- Assert no exception thrown

---

## Definition of Done

### Story-Level DoD
- [ ] All 5 acceptance criteria validated
- [ ] All 3 BDD scenarios passing
- [ ] Unit test coverage ≥ 80% for parser and extractor services
- [ ] Integration test: Scanner → Extractor → Repository with metadata
- [ ] Code follows SOLID principles
- [ ] All TypeScript strict checks passing
- [ ] No linting errors (ESLint)
- [ ] No security vulnerabilities (npm audit)
- [ ] JSDoc comments for all public methods
- [ ] README section updated (metadata extraction explanation)
- [ ] Git commits follow convention: `TDD-REPO-001-US-002-<PHASE>-<CYCLE>-20260509`

### Performance Criteria
- [ ] Metadata extraction adds < 1 second overhead per repository
- [ ] Batch processing: 50 repositories in < 10 seconds total
- [ ] Memory usage < 20MB for README parsing

### Code Review Checklist (13-point)
- [ ] 1. Single Responsibility Principle (separate parser and extractor)
- [ ] 2. Open/Closed Principle (extensible for other metadata sources)
- [ ] 3. Dependency Injection used
- [ ] 4. Error handling (missing files, encoding issues)
- [ ] 5. Edge cases covered (empty, binary, huge files)
- [ ] 6. Code is readable
- [ ] 7. No code duplication
- [ ] 8. Constants extracted (regex patterns, file names)
- [ ] 9. Type safety (no `any`)
- [ ] 10. Async/await used correctly
- [ ] 11. File reading best practices (UTF-8, error handling)
- [ ] 12. Markdown stripping tested
- [ ] 13. Description truncation implemented

---

## Dependencies

### Prerequisites
- [ ] REPO-001-US-001 (Scan Workspaces) completed
- [ ] RepositoryScannerService working and tested
- [ ] FileSystemService available

### Blocking Stories
- REPO-001-US-001 (must complete first)

### Blocked Stories
- REPO-002-US-001 (Display List) — needs metadata to display

---

## Risk Mitigation

### RISK-S1-002: README Parsing Complexity
**Probability:** Low (20%)  
**Impact:** Low (can fallback to simple text extraction)

**Mitigation Plan:**
- Start with simple regex-based stripping
- Test with 5-10 real README files from actual repositories
- If regex becomes complex: Use lightweight library (marked.js, 3KB gzipped)
- If parsing fails: Fallback to raw text (no stripping)

**Escalation:** If parsing takes > 2 hours to implement correctly, switch to simple text extraction

---

### RISK-S1-004: Large README Files
**Probability:** Low (10%)  
**Impact:** Low (performance degradation)

**Mitigation Plan:**
- Limit README reading to first 10KB (truncate if larger)
- Cache parsed descriptions (avoid re-reading)
- Show warning in logs if README > 100KB

---

## Implementation Sequence

### Day 1 (May 11, 2026) — 4-5 hours
**Morning (3 hours):**
- [ ] Layer 1: Update Repository model with description field
- [ ] Layer 2: Create ReadmeParserService (basic structure)
- [ ] TDD cycles: Test README reading and first paragraph extraction

**Afternoon (2 hours):**
- [ ] Layer 2: Implement markdown stripping
- [ ] TDD cycles: Test markdown formatting removal
- [ ] Test with real README files

---

### Day 2 (May 12, 2026) — 4-5 hours
**Morning (3 hours):**
- [ ] Layer 2: Create MetadataExtractorService
- [ ] Layer 2: Update RepositoryScannerService to call extractor
- [ ] Integration test: Scanner → Extractor → Repository with metadata

**Afternoon (2 hours):**
- [ ] Layer 4: Update RepositoryListComponent to display metadata
- [ ] BDD scenarios validation
- [ ] Code review and documentation

---

## Testing Strategy

### Unit Tests (Jasmine + Karma)
- `readme-parser.service.spec.ts` — Test README reading, parsing, markdown stripping
- `metadata-extractor.service.spec.ts` — Test name extraction, description extraction
- `repository-scanner.service.spec.ts` — Updated to test metadata enrichment

**Target Coverage:** 80%+ line coverage

### Integration Tests
- `scanner-metadata-integration.spec.ts` — Test Scanner → Extractor → Complete Repository

**Scenarios:**
- Repository with README → metadata extracted
- Repository without README → empty description
- README with markdown → formatting stripped

### BDD Tests (Jasmine)
- `metadata-extraction.spec.ts` — Implement Gherkin scenarios as Jasmine tests

---

## Test Data

### Sample README Content (for tests)
```markdown
# My Project

This is the first paragraph with **bold** and *italic* text.
It contains a [link](https://example.com) and some code.

This is the second paragraph which should not be extracted.
```

**Expected Output:**
```
"This is the first paragraph with bold and italic text. It contains a link and some code."
```

---

## Rollback Plan

**If story cannot be completed by Day 2 EOD:**
1. Commit all working code to feature branch
2. Revert changes to RepositoryScannerService (keep US-001 working)
3. Mark story as "Blocked" with detailed notes
4. Re-estimate story points if complexity underestimated
5. Discuss in Sprint Retrospective

**Rollback Triggers:**
- README parsing too complex (> 6 hours spent)
- Performance issues (metadata extraction too slow)
- Integration issues with scanner service

---

**Status:** READY FOR IMPLEMENTATION  
**Created:** 2026-05-07 (Dev-Lead)  
**Next Step:** Wait for REPO-001-US-001 completion, then TDD-Orchestrator begins Layer 1
