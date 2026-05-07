---
generated_from_template: epic-tmpl.yml
generation_date: 2026-05-07
generator_agent: product-owner
epic_key: REPO-003
project_key: dev-dashboard
epic_name: Repository Metadata Management
priority: High
status: To Do
---

# EPIC-003: Repository Metadata Management

## Epic Overview

**Epic Key:** REPO-003  
**Epic Name:** Repository Metadata Management  
**Priority:** High  
**Status:** To Do

**Objective:**  
Allow users to edit and persist repository metadata (description, phase, status) to enable project tracking and context enrichment beyond auto-discovered data.

**Business Context:**  
While auto-discovery provides basic information, developers need to add custom descriptions, track project phases (Planning → Development → Testing → Production), and set project status (Active, Paused, Blocked). This metadata persists across sessions to maintain continuity and support long-term project management.

**Success Criteria:**
- ✅ Users can edit descriptions inline with immediate visual feedback
- ✅ Users can select phase and status from predefined dropdowns
- ✅ All edits persist to local storage or file system
- ✅ Metadata survives page refreshes and Apache service restarts
- ✅ Editing UI is intuitive (double-click to edit, Enter to save, Escape to cancel)

---

## Scope

### Features Included
1. **Description Editing** - Inline text editing with save/cancel actions
2. **Phase Selection** - Dropdown with 6 phase options (Planning, Development, Testing, Production, Maintenance, Archived)
3. **Status Selection** - Dropdown with 5 status options (Active, Paused, Blocked, Completed, Archived)
4. **Persistence Layer** - localStorage or local file system storage
5. **Data Recovery** - Restore metadata on page load

### Functional Boundaries
- **In Scope**: Inline editing, dropdown selection, local persistence, data recovery
- **Out of Scope**: Multi-repository batch editing, undo/redo functionality, versioned metadata history, cloud synchronization

---

## User Stories

| Story Key | Title | Status | Story Points | Priority |
|-----------|-------|--------|--------------|----------|
| REPO-003-US-001 | Edit Repository Description | To Do | 3 | High |
| REPO-003-US-002 | Edit Project Phase and Status | To Do | 3 | High |
| REPO-003-US-003 | Persist Metadata Locally | To Do | 5 | High |

**Total Story Points:** 11

---

## Dependencies

### Internal Dependencies
- **REPO-002 (Repository Information Display)** - Must complete before editing can be implemented
  - Requires: Display UI for repositories (edit targets)
  - Blocks: Cannot edit what isn't displayed

### External Dependencies
- Browser localStorage API (5MB quota limit)
- OR Node.js file system API (for local file-based persistence)
- Angular Reactive Forms for validation

### Blocked By
- REPO-002-US-001 (Display Repository List) must complete

---

## Timeline

**Target Start:** Week 5 (after REPO-002 completion)  
**Target Completion:** End of Sprint 3 (Week 6)

**Milestones:**
- Week 5: REPO-003-US-001 (Description Editing) + REPO-003-US-002 (Phase/Status Selection)
- Week 6: REPO-003-US-003 (Persistence) + Integration Testing

---

## Related Documents

- [Architecture Design](../../02-architecture/architecture-design.md) - State management and persistence strategy
- [Tech Spec](../../02-architecture/tech-spec.md) - Data model, validation rules, storage schema
- [Design Systems](../../02-architecture/design-systems.md) - Form inputs, dropdowns, inline editing patterns
- [Test Strategies](../../03-testing/test-strategies.md) - BDD scenarios for editing features
- [User Stories (PRD)](../../01-requirements/user-stories.md) - Complete user story definitions

---

## Technical Constraints

- **Storage Quota**: localStorage limited to 5MB (handles ~500 repositories)
- **Data Format**: JSON-serialized metadata objects
- **Conflict Resolution**: Last-write-wins (no concurrent editing support)
- **Validation**: 
  - Description: max 500 characters
  - Phase: enum validation (6 allowed values)
  - Status: enum validation (5 allowed values)
- **Performance**: Save operations must complete in < 100ms

---

## Acceptance Criteria (Epic-Level)

- [ ] All three user stories pass their BDD scenarios
- [ ] Description editing works with double-click → edit → save/cancel flow
- [ ] Phase and status dropdowns populate with correct options
- [ ] All edits persist after page refresh
- [ ] All edits persist after Apache service restart
- [ ] localStorage quota handling prevents data loss
- [ ] Code coverage ≥ 80% for editing and persistence modules
