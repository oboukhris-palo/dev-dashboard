---
generated_from_template: user-story-tmpl.yml
generation_date: 2026-05-07
generator_agent: product-owner
story_key: REPO-003-US-002
epic_key: REPO-003
project_key: dev-dashboard
priority: High
status: To Do
story_points: 3
---

# REPO-003-US-002: Edit Project Phase and Status

## User Story

**As a** developer  
**I want** to set project phase and status  
**So that** I can track which projects are active, paused, or completed

---

## Acceptance Criteria

- [ ] Click phase field to show dropdown with options: "Planning", "Development", "Testing", "Production", "Maintenance", "Archived"
- [ ] Click status field to show dropdown with options: "Active", "Paused", "Blocked", "Completed", "Archived"
- [ ] Selected value saves immediately on selection
- [ ] Changes persist across sessions

---

## BDD Scenarios

```gherkin
Feature: Phase and Status Management

  Scenario: Change project phase
    Given a repository has phase "Planning"
    When I click the phase field
    And I select "Development" from the dropdown
    Then the phase is updated to "Development"
    And the change is saved

  Scenario: Change project status
    Given a repository has status "Active"
    When I click the status field
    And I select "Paused" from the dropdown
    Then the status is updated to "Paused"
    And the status indicator color changes accordingly
```

---

## Dependencies

### Prerequisites
- REPO-002-US-001 (Display Repository List) must be completed
- Phase and status fields displayed in table

### Blocks
- REPO-003-US-003 (Persist Metadata Locally) - Changes need persistence layer

---

## Technical Constraints

**From [Architecture Design](../../../02-architecture/architecture-design.md):**
- Dropdown selection must save immediately (no explicit "Save" button)
- Phase options: Planning, Development, Testing, Production, Maintenance, Archived
- Status options: Active, Paused, Blocked, Completed, Archived
- Status must have visual indicator (color-coded)

**From [Design Systems](../../../02-architecture/design-systems.md):**
- **Dropdown**: mat-select with panel width matching column width
- **Status Colors**:
  - Active: Green `#00A651`
  - Paused: Orange `#FF8C42`
  - Blocked: Red `#DD0031`
  - Completed: Purple `#7B3FF2`
  - Archived: Gray `#808080`
- **Phase Colors**: No color coding (plain text)

**Technology Stack:**
- Angular Material `MatSelectModule` for dropdown
- Angular Reactive Forms for selection handling

---

## Implementation Notes

**Phase Dropdown:**
```typescript
phaseOptions = ['Planning', 'Development', 'Testing', 'Production', 'Maintenance', 'Archived'];

onPhaseChange(row: Repository, newPhase: string) {
  row.phase = newPhase;
  this.persistenceService.saveRepository(row);
}
```

```html
<mat-cell *matCellDef="let row">
  <mat-select [(value)]="row.phase" 
              (selectionChange)="onPhaseChange(row, $event.value)">
    <mat-option *ngFor="let phase of phaseOptions" [value]="phase">
      {{ phase }}
    </mat-option>
  </mat-select>
</mat-cell>
```

**Status Dropdown with Color Indicator:**
```typescript
statusOptions = ['Active', 'Paused', 'Blocked', 'Completed', 'Archived'];

getStatusColor(status: string): string {
  const colors = {
    'Active': '#00A651',
    'Paused': '#FF8C42',
    'Blocked': '#DD0031',
    'Completed': '#7B3FF2',
    'Archived': '#808080'
  };
  return colors[status] || '#000000';
}

onStatusChange(row: Repository, newStatus: string) {
  row.status = newStatus;
  this.persistenceService.saveRepository(row);
}
```

```html
<mat-cell *matCellDef="let row">
  <mat-select [(value)]="row.status" 
              (selectionChange)="onStatusChange(row, $event.value)">
    <mat-option *ngFor="let status of statusOptions" [value]="status">
      <span [style.color]="getStatusColor(status)">{{ status }}</span>
    </mat-option>
  </mat-select>
</mat-cell>
```

---

## Test Strategy

**Unit Tests:**
- Test phase dropdown populates with correct options
- Test status dropdown populates with correct options
- Test phase change saves immediately
- Test status change saves immediately
- Test status color mapping for all 5 status values

**Integration Tests:**
- Test phase change persistence (verify REPO-003-US-003)
- Test status change persistence (verify REPO-003-US-003)
- Test multiple repositories can have different phases/statuses

**BDD Tests:**
- Implement both Gherkin scenarios above
- Verify phase dropdown displays and saves correctly
- Verify status dropdown displays and saves correctly
- Verify status color changes when status changes

**Visual Tests:**
- Verify status colors match design system
- Verify dropdown panel width matches column width
- Verify selected value displays correctly after selection

---

## Related Documents

- [Architecture Design](../../../02-architecture/architecture-design.md) - Section: Dropdown Components
- [Tech Spec](../../../02-architecture/tech-spec.md) - Section: Enum Values
- [Design Systems](../../../02-architecture/design-systems.md) - Section: Dropdowns, Status Colors
- [Test Strategies](../../../03-testing/test-strategies.md) - Feature: repo-003-management/edit-phase-status.feature
