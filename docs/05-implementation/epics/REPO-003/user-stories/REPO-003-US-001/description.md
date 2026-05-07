---
generated_from_template: user-story-tmpl.yml
generation_date: 2026-05-07
generator_agent: product-owner
story_key: REPO-003-US-001
epic_key: REPO-003
project_key: dev-dashboard
priority: High
status: To Do
story_points: 3
---

# REPO-003-US-001: Edit Repository Description

## User Story

**As a** developer  
**I want** to edit repository descriptions  
**So that** I can add or update project context

---

## Acceptance Criteria

- [ ] Double-click description field to enable editing
- [ ] Inline text input appears with current description
- [ ] Press Enter or click outside to save
- [ ] Press Escape to cancel editing
- [ ] Changes persist to local storage or file system

---

## BDD Scenarios

```gherkin
Feature: Description Editing

  Scenario: Edit description inline
    Given a repository is displayed with description "Old description"
    When I double-click the description field
    Then an editable text input appears with "Old description"

  Scenario: Save edited description
    Given I have edited a description to "New description"
    When I press Enter or click outside the field
    Then the description is saved as "New description"
    And the change persists after page reload

  Scenario: Cancel editing
    Given I am editing a description
    When I press Escape
    Then the original description is restored
    And no changes are saved
```

---

## Dependencies

### Prerequisites
- REPO-002-US-001 (Display Repository List) must be completed
- Repository data displayed in table

### Blocks
- REPO-003-US-003 (Persist Metadata Locally) - Edits need persistence layer

---

## Technical Constraints

**From [Architecture Design](../../../02-architecture/architecture-design.md):**
- Editing must be inline (no modal dialogs)
- Double-click activates edit mode
- Enter key or blur event saves changes
- Escape key cancels editing
- Max description length: 500 characters

**From [Design Systems](../../../02-architecture/design-systems.md):**
- **Edit Mode Input**: mat-input with focus border in Tech Blue `#0066CC`
- **Input Height**: 48px
- **Input Width**: Full column width minus 16px padding
- **Validation**: Real-time character count display (e.g., "450/500")

**Technology Stack:**
- Angular Reactive Forms for validation
- Angular Material `MatInputModule` for text input
- RxJS `debounceTime` for auto-save (optional)

---

## Implementation Notes

**Inline Edit Component:**
```typescript
@Component({
  selector: 'app-inline-edit',
  template: `
    <div (dblclick)="enableEdit()" *ngIf="!isEditing">
      {{ value }}
    </div>
    <mat-form-field *ngIf="isEditing">
      <input matInput 
             [(ngModel)]="editValue"
             (keydown.enter)="save()"
             (keydown.escape)="cancel()"
             (blur)="save()"
             maxlength="500"
             #input>
      <mat-hint align="end">{{ editValue.length }}/500</mat-hint>
    </mat-form-field>
  `
})
export class InlineEditComponent {
  @Input() value: string;
  @Output() valueChange = new EventEmitter<string>();
  
  isEditing = false;
  editValue: string;
  
  enableEdit() {
    this.isEditing = true;
    this.editValue = this.value;
    setTimeout(() => this.input.nativeElement.focus(), 0);
  }
  
  save() {
    if (this.editValue !== this.value) {
      this.valueChange.emit(this.editValue);
    }
    this.isEditing = false;
  }
  
  cancel() {
    this.editValue = this.value;
    this.isEditing = false;
  }
}
```

**Table Integration:**
```html
<mat-cell *matCellDef="let row">
  <app-inline-edit 
    [(value)]="row.description"
    (valueChange)="onDescriptionChange(row, $event)">
  </app-inline-edit>
</mat-cell>
```

---

## Test Strategy

**Unit Tests:**
- Test double-click activates edit mode
- Test Enter key saves changes
- Test Escape key cancels editing
- Test blur event saves changes
- Test max length validation (500 characters)
- Test character count display

**Integration Tests:**
- Test editing description for multiple repositories
- Test persistence after save (verify REPO-003-US-003)

**BDD Tests:**
- Implement all three Gherkin scenarios above
- Verify inline edit activates on double-click
- Verify save on Enter and blur
- Verify cancel on Escape

**E2E Tests:**
- Test full edit workflow: double-click → edit → save → reload → verify
- Test cancel workflow: double-click → edit → cancel → verify original

---

## Related Documents

- [Architecture Design](../../../02-architecture/architecture-design.md) - Section: Inline Editing
- [Tech Spec](../../../02-architecture/tech-spec.md) - Section: Validation Rules
- [Design Systems](../../../02-architecture/design-systems.md) - Section: Form Inputs
- [Test Strategies](../../../03-testing/test-strategies.md) - Feature: repo-003-management/edit-description.feature
