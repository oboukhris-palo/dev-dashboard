---
generated_from_template: implementation-plan-tmpl.md
generation_date: 2026-05-28
story_key: REPO-003-US-002
epic_key: REPO-003
project_key: dev-dashboard
development_mode: "YOLO (TDD disabled, BDD disabled, DDD disabled)"
version: 1.0
---

# REPO-003-US-002 Implementation Plan

**Story:** Edit Project Phase and Status  
**SP:** 3 | **Sprint:** Sprint 3  
**Priority:** High | **Status:** To Do  
**Development Mode:** YOLO (Direct implementation, no mandatory TDD)

---

## Overview

Enable dropdown selection for project phase (Planning, Development, Testing, Production, Maintenance, Archived) and status (Active, Paused, Blocked, Completed, Archived) with immediate save on selection.

---

## Layer Breakdown

### Layer 1: Domain & Data Model

**Objective:** Define enums and data structures for phase/status values

**Files to Create/Modify:**
- [ ] `src/app/domain/phase.enum.ts` - Enum: `ProjectPhase { Planning, Development, Testing, Production, Maintenance, Archived }`
- [ ] `src/app/domain/status.enum.ts` - Enum: `ProjectStatus { Active, Paused, Blocked, Completed, Archived }`
- [ ] `src/app/domain/metadata.model.ts` - Update: Add `phase: ProjectPhase`, `status: ProjectStatus` properties

**Acceptance Criteria:**
- Phase enum with 6 values
- Status enum with 5 values
- Metadata model includes both fields

---

### Layer 2: Service Layer & Business Logic

**Objective:** Implement phase/status selection service with state management

**Files to Create/Modify:**
- [ ] `src/app/services/metadata-editor.service.ts` - Update existing service
  - Add method: `updatePhase(id: string, phase: ProjectPhase)`
  - Add method: `updateStatus(id: string, status: ProjectStatus)`
- [ ] `src/app/state/repository.store.ts` - Update Elf store
  - Add phase/status properties to metadata state
  - Add reducers: `setPhase()`, `setStatus()`

**Implementation Details:**
- Immediate save on dropdown selection (no defer)
- No validation needed (enum values are fixed)
- State: `repositories[].metadata = { description, phase, status }`

**Acceptance Criteria:**
- Service methods update phase and status
- Store triggers re-render on state change
- Selection persists in component state

---

### Layer 3: Configuration & Integration

**Objective:** Wire service into component, configure dropdown data

**Files to Modify:**
- [ ] `src/app/app.config.ts` - Verify `MetadataEditorService` provided
- [ ] `src/app/components/repository-list/repository-list.component.ts` - Add phase/status constants
  - `PHASES: ProjectPhase[] = [...]`
  - `STATUSES: ProjectStatus[] = [...]`
- [ ] Wire selectors into component template

**Acceptance Criteria:**
- Service available via injection
- Dropdown options defined and accessible

---

### Layer 4: UI Components & Presentation

**Objective:** Implement dropdown selectors with Material Design

**Files to Create/Modify:**
- [ ] `src/app/components/repository-list/phase-status-selector.component.ts` - New component
  - Display current phase/status
  - Render dropdowns on click
  - Call service on selection
- [ ] `src/app/components/repository-list/phase-status-selector.component.html` - Template
- [ ] `src/app/components/repository-list/phase-status-selector.component.scss` - Styling
- [ ] `src/app/components/repository-list/repository-list.component.html` - Integrate `<app-phase-status-selector>`

**UI Behavior:**
- Display mode: Show phase and status as badges/text
  - Phase badge: background color based on phase (e.g., blue=Planning, green=Production)
  - Status badge: color indicator (green=Active, red=Blocked, yellow=Paused)
- On click: Dropdown appears
  - Phase dropdown: 6 options (Planning, Development, Testing, Production, Maintenance, Archived)
  - Status dropdown: 5 options (Active, Paused, Blocked, Completed, Archived)
- On selection: Save immediately (call service, update store)
- Material Design: `MatSelectModule`, color scheme from design tokens

**Material Imports Needed:**
- MatSelectModule
- MatFormFieldModule
- MatOptionModule

**Color Scheme:**
- Phase Planning: `#FFA500` (orange)
- Phase Development: `#0066CC` (tech blue)
- Phase Testing: `#7B3FF2` (purple)
- Phase Production: `#00A651` (green)
- Status Active: `#00A651` (green)
- Status Blocked: `#D32F2F` (red)
- Status Paused: `#FF9800` (orange)

**Acceptance Criteria:**
- Click phase/status → dropdown appears
- Select value → saves immediately
- Badges display current values with appropriate colors
- UI follows Material Design tokens

---

## Dependency Notes

- **Depends On:** REPO-002-US-001 (repository display already built), REPO-003-US-001 (metadata model extended)
- **Blocks:** REPO-003-US-003 (persistence layer needed for data durability)

---

## Layer Completion Checklist

| Layer | Task | Status |
|-------|------|--------|
| **1. Domain** | Create phase/status enums, update metadata model | [x] ✅ |
| **2. Service** | Implement updatePhase/updateStatus, Elf store updates | [x] ✅ |
| **3. Config** | Wire service to DI, define dropdown options | [x] ✅ |
| **4. UI** | Build selector component, integrate dropdowns, set colors | [x] ✅ |
| **Test** | Manual verification: click dropdowns, verify selection colors | [x] ✅ |

---

## Status: ✅ COMPLETE

All 4 layers implemented. Phase and Status selection fully functional.

## Testing Strategy (YOLO Mode)

**Manual Testing (required):**
- Click phase field → dropdown appears with 6 options
- Select "Development" → phase updates, badge color changes
- Click status field → dropdown appears with 5 options
- Select "Blocked" → status updates, badge turns red
- Repeat for all phase/status combinations
- Verify colors display correctly per design tokens

---

## Technical Notes

- **Color Tokens:** Reference design-systems.md for exact color values
- **Badge Display:** Use Material badges or simple divs with background-color
- **Dropdown Trigger:** Use `MatSelect` for native browser compatibility
- **Immediate Save:** No debounce; save on selection immediately

---

## Definition of Done

- [ ] All 4 layers implemented per acceptance criteria
- [ ] Manual testing completed (all dropdowns verified)
- [ ] No ESLint errors
- [ ] Color scheme matches design tokens
- [ ] Code follows Angular patterns (OnPush, inject(), standalone)
- [ ] Plan-approval.yaml marked approved before moving to next story
