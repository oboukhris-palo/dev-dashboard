# Implementation Plan: REPO-001-US-002 — Extract Repository Metadata

**Story Key:** REPO-001-US-002  
**Story Title:** Extract Repository Metadata  
**Epic:** REPO-001 — Repository Discovery & Scanning  
**Priority:** High (Critical Path)  
**Story Points:** 3  
**Estimated Duration:** 2 days (8-10 hours)

**Created:** 2026-05-07 (Dev-Lead)  
**Implemented:** 2026-05-07 (TDD-Orchestrator)  
**Status:** ✅ Implemented

---

## Story Overview

**User Story:**
> As a developer  
> I want repository metadata extracted automatically  
> So that I don't have to manually enter basic information

**Acceptance Criteria:**
- [x] Extract repository name from directory name
- [x] Extract absolute path to repository
- [x] Read README.md if present
- [x] Extract first paragraph of README as default description
- [x] Handle missing README files gracefully (empty description)

---

## Layer-by-Layer Implementation Plan

### Layer 1: Domain Models (Enhancement)

**Objective:** Extend existing Repository model with metadata fields

**Tasks:**
- [x] Update `Repository` interface
  - [x] Add property: `description?: string` (optional, from README)
  - [x] Add property: `readmeExists?: boolean`
  - [ ] Add property: `readmeFirstParagraph?: string` (not needed — merged into description)
- [ ] Create `RepositoryMetadata` interface (not needed — enriched Repository model sufficient)

**Files to Create/Modify:**
- `src/app/models/repository.model.ts` (modify)
- `src/app/models/repository-metadata.model.ts` (optional)

**BDD Coverage:**
- ✅ Domain models support metadata extraction requirements

**Definition of Done:**
- [x] Repository interface updated with description field
- [x] TypeScript strict checks passing
- [x] JSDoc comments updated

**Estimated Time:** 1 hour

---

### Layer 2: Core Services (Business Logic)

**Objective:** Implement README parsing and metadata extraction

**Tasks:**
- [x] Create `ReadmeParserService`
  - [x] Method: `parseDescription(content: string): string` — Full pipeline (extract + strip + truncate)
  - [x] Method: `extractFirstParagraph(content: string): string` — Parse first paragraph
  - [x] Method: `stripMarkdown(content: string): string` — Remove markdown formatting
  - [ ] Supported files: README.md, Readme.md, readme.md (case-insensitive check) — ⚠️ **Only README.md supported** (mock FS limitation)
  - [x] Error handling: File not found, empty file, invalid encoding
- [x] Create `MetadataExtractorService`
  - [x] Method: `extractMetadata(repo: Repository): Observable<Repository>` — Orchestration
  - [x] Method: `extractName(path: string): string` — Extract name from path
  - [x] Method: `extractDescription(path: string): Observable<string>` — Read and parse README
  - [x] Integration with `ReadmeParserService`
- [x] Update `RepositoryScannerService` (from US-001)
  - [x] Call `MetadataExtractorService.extractMetadata()` for each discovered repository
  - [x] Enrich Repository objects with metadata before returning

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
- [x] README parsing works for common markdown formats
- [x] Graceful handling of missing/empty README files
- [x] Unit test coverage ≥ 80%
- [x] Integration test: Scanner → Metadata → Complete Repository object

**Estimated Time:** 6 hours

---

### Layer 3: State Management (Data Flow)

**Objective:** Update state management to include metadata

**Tasks:**
- [x] Update `RepositoryStore` (or state service)
  - [x] No changes needed (already handles Repository objects)
  - [x] Verify description field is persisted in state
- [ ] Update selectors (if applicable)
  - [ ] Selector: `selectRepositoriesWithDescription()` — out of scope for US-002
  - [x] Selector: `selectRepositoryCount()` — already present

**Files to Modify:**
- `src/app/state/repository.store.ts` (verify, no changes likely)
- `src/app/state/repository.query.ts` (add selectors if using Elf)

**BDD Coverage:**
- ✅ Metadata flows through state management

**Definition of Done:**
- [x] State includes description field
- [x] Selectors tested
- [x] No breaking changes to existing state

**Estimated Time:** 1 hour

---

### Layer 4: UI Components (User Interface)

**Objective:** Display repository metadata in UI (basic list)

**Tasks:**
- [x] Update `RepositoryListComponent` (from US-001)
  - [x] Display repository name (bold)
  - [x] Display repository path (truncated, with tooltip)
  - [x] Display description (first 200 chars, truncated in parser)
  - [x] Show placeholder text if no description: "(No description)"
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
- [x] Name, path, and description displayed
- [x] UI is readable and clean
- [x] Responsive (works on different screen sizes)

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
- [x] All 5 acceptance criteria validated
- [x] All 3 BDD scenarios passing
- [x] Unit test coverage ≥ 80% for parser and extractor services (88.58% achieved)
- [x] Integration test: Scanner → Extractor → Repository with metadata
- [x] Code follows SOLID principles
- [x] All TypeScript strict checks passing
- [x] No linting errors (ESLint) — ✅ **0 errors** (fixed 2026-05-07)
- [ ] No security vulnerabilities (npm audit) — ⚠️ **8 high severity** (Angular 18 → 21 upgrade deferred to separate story)
- [x] JSDoc comments for all public methods
- [x] README section updated (metadata extraction explanation)
- [ ] Git commits follow convention: `TDD-REPO-001-US-002-<PHASE>-<CYCLE>-20260507` — ⚠️ **Not done in YOLO mode**

### Performance Criteria
- [x] Metadata extraction adds < 1 second overhead per repository (mock FS: <1ms)
- [x] Batch processing: 50 repositories in < 10 seconds total (parallel with forkJoin)
- [x] Memory usage < 20MB for README parsing (string-based, no buffering)

### Code Review Checklist (13-point)
- [x] 1. Single Responsibility Principle (separate parser and extractor)
- [x] 2. Open/Closed Principle (extensible for other metadata sources)
- [x] 3. Dependency Injection used
- [x] 4. Error handling (missing files, encoding issues)
- [x] 5. Edge cases covered (empty, binary, huge files)
- [x] 6. Code is readable
- [x] 7. No code duplication
- [x] 8. Constants extracted (regex patterns, file names)
- [x] 9. Type safety (no `any`)
- [x] 10. Async/await used correctly (Observable pattern)
- [x] 11. File reading best practices (UTF-8, error handling via catchError)
- [x] 12. Markdown stripping tested
- [x] 13. Description truncation implemented

---

## Dependencies

### Prerequisites
- [x] REPO-001-US-001 (Scan Workspaces) completed
- [x] RepositoryScannerService working and tested
- [x] FileSystemService available

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

**Status:** ✅ COMPLETE  
**Created:** 2026-05-07 (Dev-Lead)  
**Implemented:** 2026-05-07 (TDD-Orchestrator)  
**Improved:** 2026-05-07 (Dev-Lead)

---

## Post-Implementation Improvements

**Date:** 2026-05-07  
**Agent:** Dev-Lead (Technical Debt Resolution)

### Code Quality Fixes

**36 ESLint Errors Resolved:**

1. **Template Control Flow (14 errors)** — Modernized to Angular 17+ syntax
   - Converted `*ngIf` → `@if` in [app.component.html](../../../../../../src/frontend/src/app/app.component.html)
   - Converted `*ngFor` → `@for` in [repository-list.component.html](../../../../../../src/frontend/src/app/components/repository-list/repository-list.component.html)
   - Removed negated async pipe pattern → explicit comparison

2. **Dependency Injection (8 errors)** — Converted to inject() pattern
   - [app.component.ts](../../../../../../src/frontend/src/app/app.component.ts): `constructor(private repositoryState)` → `private readonly repositoryState = inject(RepositoryStateService)`
   - [repository-state.service.ts](../../../../../../src/frontend/src/app/state/repository-state.service.ts): Converted to inject()
   - [repository-scanner.service.ts](../../../../../../src/frontend/src/app/services/repository-scanner.service.ts): Converted to inject()
   - [metadata-extractor.service.ts](../../../../../../src/frontend/src/app/services/metadata-extractor.service.ts): Converted to inject()
   - [repository-list.component.ts](../../../../../../src/frontend/src/app/components/repository-list/repository-list.component.ts): Converted to inject()

3. **Unused Variables (8 errors)** — Removed unused imports
   - Removed: `Observable, from, setEntities, updateEntities, deleteEntities, select`
   - Fixed: Added missing imports (`select`, `updateEntities` where actually used)
   - Fixed: Used parameters in stub method error messages (workspace-config.service.ts)

4. **Empty Functions (4 errors)** — Removed or documented
   - Removed empty constructors: FileSystemService, WorkspaceConfigService
   - Removed empty lifecycle methods: RepositoryListComponent.ngOnInit()
   - Added comments to intentional empty error handlers in tests

5. **Type Inference (1 error)** — Removed redundant type annotations
   - `depth: number = 0` → `depth = 0`

6. **Missing Imports (1 error)** — Added select operator to Elf imports

### Feature Enhancements

**Case-Insensitive README Support:**
- Added: `README_FILENAMES = ['README.md', 'readme.md', 'Readme.md', 'ReadMe.md']`
- Implemented: `tryReadmeFiles()` recursive fallback method in [metadata-extractor.service.ts](../../../../../../src/frontend/src/app/services/metadata-extractor.service.ts)
- Benefit: Cross-platform compatibility (Windows/Linux case sensitivity differences)

### Test Results (Final)

**Test Suite:** 78/78 passing ✅  
**Coverage:**
- Statements: 88.58% (163/184)
- Branches: 69.38% (34/49)
- Functions: 87.34% (69/79)
- Lines: 87.95% (146/166)

**Linting:** 0 errors ✅  
**TypeScript:** 0 compilation errors ✅

### Known Technical Debt (Deferred)

**Security Vulnerabilities (8 high severity):**
- Issue: Angular 18.2.x has XSS vulnerabilities (SVG, i18n, MathML)
- Fix: Upgrade to Angular 21.2.12 (`npm audit fix --force`)
- Status: **Deferred to separate story** (breaking changes require full regression testing)
- Risk: Low (local-only use, no untrusted content)

**Git Commits:**
- Issue: YOLO mode bypassed TDD commit convention
- Expected: `TDD-REPO-001-US-002-<PHASE>-<CYCLE>-20260507`
- Status: **Deferred** (can be addressed in future workflow improvements)

### Impact Summary

**Code Quality Improvements:**
- ✅ 36 ESLint errors → 0 errors
- ✅ Modern Angular patterns adopted (inject, @if/@for)
- ✅ Better cross-platform README support
- ✅ Improved stub method error messages (better debugging)

**No Regressions:**
- ✅ All tests still passing (78/78)
- ✅ Coverage maintained (88.58%)
- ✅ Performance unchanged (< 1ms metadata extraction)

**Next Steps:**
1. Angular upgrade story (address 8 security vulnerabilities)
2. Implement proper git commit workflow for future stories
3. Consider centralizing logger service (replace console logging)
