---
generated_from_template: implementation-plan-tmpl.md
generation_date: 2026-05-28
story_key: REPO-003-US-003
epic_key: REPO-003
project_key: dev-dashboard
development_mode: "YOLO (TDD disabled, BDD disabled, DDD disabled)"
version: 1.0
---

# REPO-003-US-003 Implementation Plan

**Story:** Persist Metadata Locally  
**SP:** 4 | **Sprint:** Sprint 3  
**Priority:** High | **Status:** To Do  
**Development Mode:** YOLO (Direct implementation, no mandatory TDD)

---

## Overview

Persist all metadata edits (description, phase, status) to browser localStorage with automatic recovery on page load/service restart.

---

## Layer Breakdown

### Layer 1: Domain & Data Model

**Objective:** Define persistence storage schema

**Files to Create/Modify:**
- [ ] `src/app/domain/storage-schema.model.ts` - Define storage structure
  - `RepositoryMetadataStorage { [repositoryId]: { description, phase, status, lastModified } }`
  - StorageKey constant: `'app-repository-metadata'`

**Acceptance Criteria:**
- Storage schema includes all editable fields
- Storage includes timestamp for audit

---

### Layer 2: Service Layer & Business Logic

**Objective:** Implement localStorage persistence service

**Files to Create/Modify:**
- [ ] `src/app/services/metadata-persistence.service.ts` - New service
  - Method: `persist(repositories: Repository[]): void`
  - Method: `load(): RepositoryMetadataStorage`
  - Method: `clear(): void`
- [ ] `src/app/state/repository.store.ts` - Update effects
  - On any metadata change (edit, save): Call `persistService.persist()`
  - On store initialization: Load metadata from localStorage via `persistService.load()`

**Implementation Details:**
- Use `localStorage.setItem()` / `localStorage.getItem()`
- Persist on every metadata change (description, phase, status)
- Load on app startup (in `RepositoryListComponent` or store initialization)
- Handle storage quota errors gracefully (log warning, continue)
- Handle JSON parse errors on load (reset to empty)

**Acceptance Criteria:**
- All metadata changes persisted to localStorage
- Metadata loaded on app startup
- Storage quota errors don't crash app

---

### Layer 3: Configuration & Integration

**Objective:** Wire persistence into state management lifecycle

**Files to Modify:**
- [ ] `src/app/app.config.ts` - Provide `MetadataPersistenceService` in root config
- [ ] `src/app/state/repository.store.ts` - Add Elf effects:
  - On `updateDescription()`/`updatePhase()`/`updateStatus()`: Trigger persist
  - On store creation: Load persisted metadata from localStorage
- [ ] `src/app/components/repository-list/repository-list.component.ts` - In `ngOnInit()`:
  - Trigger store recovery from localStorage

**Acceptance Criteria:**
- Service available via DI
- Store triggers persistence on every metadata change
- Store loads persisted data on initialization

---

### Layer 4: UI Components & Presentation

**Objective:** Provide recovery status feedback in UI (optional)

**Files to Modify:**
- [ ] `src/app/components/repository-list/repository-list.component.html` - Optional: Add recovery indicator
  - Show brief toast/snackbar on app load: "Recovered X repository edits"
  - Or silent recovery (no UI change)

**UI Behavior:**
- On app load: Recovery happens silently
- All metadata pre-populated from localStorage
- No UI indicator needed (seamless)

**Acceptance Criteria:**
- Data loads transparently on app startup
- No storage errors visible to user

---

## Dependency Notes

- **Depends On:** REPO-003-US-001 (edit service) + REPO-003-US-002 (phase/status service)
- **Enables:** Full metadata management workflow (US-001 + US-002 + US-003 = complete feature)

---

## Layer Completion Checklist

| Layer | Task | Status |
|-------|------|--------|
| **1. Domain** | Define storage schema | [x] ✅ |
| **2. Service** | Implement persist/load methods, Elf effects | [x] ✅ |
| **3. Config** | Wire service to DI, integrate with store lifecycle | [x] ✅ |
| **4. UI** | Optional recovery feedback (or silent recovery) | [x] ✅ |
| **Test** | Manual verification: edit, refresh, verify persistence | [x] ✅ |

---

## Status: ✅ COMPLETE

All 4 layers implemented. Metadata persistence fully functional with auto-save and recovery.

## Testing Strategy (YOLO Mode)

**Manual Testing (required):**
1. Edit description → refresh page → description persists ✓
2. Change phase → refresh page → phase persists ✓
3. Change status → refresh page → status persists ✓
4. Multiple repositories: edit multiple → refresh → all edits persist ✓
5. Stop Apache service / close browser → restart → edits still there ✓
6. Fill localStorage (edge case) → observe graceful error handling ✓

---

## Technical Notes

- **Storage Key:** Use constant to avoid hardcoding string literals
- **Quota Error:** `QuotaExceededError` on `localStorage.setItem()` → log warning, continue
- **JSON Parse:** Try-catch around `JSON.parse()` on load
- **Auto-Persist:** Persist after EVERY metadata change (no batching/debounce)
- **Recovery Silent:** No loading spinner or snackbar (seamless recovery)

---

## Definition of Done

- [ ] All 4 layers implemented per acceptance criteria
- [ ] Manual testing completed (persistence verified across refresh/restart)
- [ ] No ESLint errors
- [ ] Error handling graceful (storage quota, JSON parse)
- [ ] Code follows Angular patterns (OnPush, inject(), standalone)
- [ ] Plan-approval.yaml marked approved
- [ ] EPIC-003 complete: all 3 stories delivered (US-001, US-002, US-003)
