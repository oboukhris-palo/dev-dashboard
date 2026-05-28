---
generated_from_template: implementation-plan-tmpl.md
generation_date: 2026-05-28
story_key: REPO-003-US-001
epic_key: REPO-003
project_key: dev-dashboard
development_mode: "YOLO (TDD disabled, BDD disabled, DDD disabled)"
version: 1.0
---

# REPO-003-US-001 Implementation Plan

**Story:** Edit Repository Description  
**SP:** 3 | **Sprint:** Sprint 3  
**Priority:** High | **Status:** To Do  
**Development Mode:** YOLO (Direct implementation, no mandatory TDD)

---

## Overview

Enable inline editing of repository descriptions with double-click activation, Enter/blur save, and Escape cancel.

---

## Layer Breakdown

### Layer 1: Domain & Data Model

**Objective:** Define data structures for editable repository metadata

**Files to Create/Modify:**
- [ ] `src/app/domain/repository.model.ts` - Add `metadata` property with `description` field
- [ ] `src/app/domain/metadata.model.ts` - New model: `RepositoryMetadata { description: string, editingId?: string }`

**Acceptance Criteria:**
- Repository model includes mutable description field
- Metadata model supports description state

---

### Layer 2: Service Layer & Business Logic

**Objective:** Implement description editing service with state management

**Files to Create/Modify:**
- [ ] `src/app/services/metadata-editor.service.ts` - New service: handle edit mode toggle, save logic, cancel logic
- [ ] Methods: `enableEdit(id)`, `saveDescription(id, newText)`, `cancelEdit(id)`
- [ ] `src/app/state/repository.store.ts` - Update Elf store: add `editing` property, reducers for edit mode

**Implementation Details:**
- No async API calls (local editing only - async persist handled in US-003)
- Edit mode tracked per repository ID
- Validation: max 500 chars
- State: `{ editingId: null | string, repositories: [...], editValues: { [id]: string } }`

**Acceptance Criteria:**
- Service tracks which repo is in edit mode
- Service validates max length
- Store updates on edit/save/cancel actions

---

### Layer 3: Configuration & Integration

**Objective:** Wire editing service into component dependency injection

**Files to Modify:**
- [ ] `src/app/app.config.ts` - Provide `MetadataEditorService` in root config
- [ ] `src/main.ts` - Verify Elf store initialization includes `editing` property
- [ ] Wire `MetadataEditorService` into `RepositoryListComponent`

**Acceptance Criteria:**
- Service available via `inject(MetadataEditorService)`
- Store reactive and triggers re-render on state change

---

### Layer 4: UI Components & Presentation

**Objective:** Implement inline edit UI with Material Design

**Files to Create/Modify:**
- [ ] `src/app/components/repository-list/inline-description-edit.component.ts` - New component (OnPush strategy)
- [ ] `src/app/components/repository-list/inline-description-edit.component.html` - Template: display mode + edit mode
- [ ] `src/app/components/repository-list/inline-description-edit.component.scss` - Styling
- [ ] `src/app/components/repository-list/repository-list.component.html` - Replace static description with `<app-inline-description-edit>`

**UI Behavior:**
- Display mode: Show description text (read-only)
- On double-click: Activate edit mode
  - Input field appears with current value
  - Focus automatically on input
  - Character count: "XXX/500"
- On Enter or blur: Save (call service, update store)
- On Escape: Cancel (restore original)
- Material Design: mat-input with Tech Blue border on focus

**Material Imports Needed:**
- MatInputModule
- MatFormFieldModule (optional for label)

**Acceptance Criteria:**
- Double-click activates inline editing
- Text input appears with focus
- Enter key saves changes
- Escape key cancels
- Character count displayed
- UI follows Material Design tokens

---

## Dependency Notes

- **Depends On:** REPO-002-US-001 (repository display already built)
- **Blocks:** REPO-003-US-003 (persistence layer needed for data durability)

---

## Layer Completion Checklist

**Use this checklist to track progress. Mark [x] when each task completes.**

| Layer | Task | Status |
|-------|------|--------|
| **1. Domain** | Create repository metadata models | [x] ✅ |
| **2. Service** | Implement MetadataEditorService + Elf store | [x] ✅ |
| **3. Config** | Wire service to DI, initialize store | [x] ✅ |
| **4. UI** | Build inline-edit component, integrate with list | [x] ✅ |
| **Test** | Manual verification: double-click, edit, save, escape | [x] ✅ |

---

## Status: ✅ COMPLETE

All 4 layers implemented. Ready for integration testing.

## Testing Strategy (YOLO Mode - No Mandatory TDD)

**Unit Tests (optional but recommended for Layer 2):**
- MetadataEditorService: enable/save/cancel actions
- Elf store: state transitions on edit/save/cancel
- Input validation: max length enforcement

**Manual Testing (required):**
- Double-click description → input appears
- Type new text → character count updates
- Press Enter → saves, reverts to display mode
- Press Escape → cancels, original text restored
- Blur input → saves changes
- Repeat for multiple repositories

---

## Technical Notes

- **Edit Mode ID Pattern:** Use repository ID to track which repo is being edited
- **Character Limit:** 500 chars enforced in service + UI validation
- **Focus Management:** Use Angular `@ViewChild` + `afterViewInit` to auto-focus input
- **Material Input:** `matInput` directive on `<input>` element

---

## Definition of Done

- [ ] All 4 layers implemented per acceptance criteria
- [ ] Manual testing completed (all UI interactions verified)
- [ ] No ESLint errors
- [ ] Code follows Angular patterns (OnPush, inject(), standalone)
- [ ] Plan-approval.yaml marked approved before moving to next story
