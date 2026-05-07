---
generated_from_template: user-story-tmpl.yml
generation_date: 2026-05-07
generator_agent: product-owner
story_key: REPO-002-US-002
epic_key: REPO-002
project_key: dev-dashboard
priority: Medium
status: To Do
story_points: 3
---

# REPO-002-US-002: Interactive Repository Cards

## User Story

**As a** developer  
**I want** an interactive, easy-to-read interface  
**So that** I can quickly understand project details

---

## Acceptance Criteria

- [ ] Use Material Design components (mat-table or mat-card)
- [ ] Hover effects indicate interactivity
- [ ] Click on repository row highlights it
- [ ] Path is displayed as truncated text with tooltip showing full path
- [ ] Technology stack displayed as chips/badges

---

## BDD Scenarios

```gherkin
Feature: Interactive Repository Display

  Scenario: Hover interaction
    Given repositories are displayed
    When I hover over a repository row
    Then the row highlights with subtle background color change

  Scenario: View full path on hover
    Given a repository has path "/Users/oboukhris-palo/workspace/long-project-name"
    When I hover over the truncated path
    Then a tooltip displays the full path
```

---

## Dependencies

### Prerequisites
- REPO-002-US-001 (Display Repository List) must be completed
- Material table component must be implemented

### Blocks
- REPO-003-US-001 (Edit Repository Description) - Interactive elements enable editing

---

## Technical Constraints

**From [Architecture Design](../../../02-architecture/architecture-design.md):**
- Hover effects must be smooth (CSS transitions: 200ms)
- Path truncation at 40 characters with ellipsis
- Tooltip appears after 500ms hover delay
- Row highlighting must not affect table layout

**From [Design Systems](../../../02-architecture/design-systems.md):**
- **Hover Color**: Light Gray `#F0F0F0` background
- **Selected Row Color**: Tech Blue `#0066CC` with 10% opacity
- **Tooltip**: mat-tooltip with black background, white text
- **Tech Badges**: mat-chip-list with colors:
  - Node.js: Green `#00A651`
  - Angular: Red `#DD0031`
  - Java: Blue `#0066CC`
  - .NET: Purple `#7B3FF2`
  - Python: Orange `#FF8C42`

**Technology Stack:**
- Angular Material `MatTooltipModule` for path tooltips
- Angular Material `MatChipsModule` for tech stack badges
- CSS `:hover` pseudo-class for row highlighting

---

## Implementation Notes

**Hover Effect:**
```css
mat-row:hover {
  background-color: #F0F0F0;
  transition: background-color 200ms ease-in-out;
  cursor: pointer;
}
```

**Selected Row:**
```typescript
selectedRow: Repository | null = null;

onRowClick(row: Repository) {
  this.selectedRow = row;
}
```

```css
mat-row.selected {
  background-color: rgba(0, 102, 204, 0.1); /* Tech Blue with 10% opacity */
}
```

**Path Truncation:**
```html
<mat-cell *matCellDef="let row" 
          matTooltip="{{ row.path }}" 
          matTooltipShowDelay="500">
  {{ row.path | truncate:40 }}
</mat-cell>
```

**Tech Stack Badges:**
```html
<mat-cell *matCellDef="let row">
  <mat-chip-list>
    <mat-chip *ngFor="let tech of row.devStack" 
              [style.background-color]="getTechColor(tech)">
      {{ tech }}
    </mat-chip>
  </mat-chip-list>
</mat-cell>
```

---

## Test Strategy

**Unit Tests:**
- Test hover effect triggers on mouse enter/leave
- Test row click selects row
- Test path truncation at 40 characters
- Test tooltip displays full path
- Test tech badge colors match design system

**Integration Tests:**
- Test interaction with repository data
- Test hover and click across multiple rows
- Test tooltip appears after 500ms delay

**BDD Tests:**
- Implement both Gherkin scenarios above
- Verify hover changes row background
- Verify tooltip shows full path

**Visual Regression Tests:**
- Capture screenshots of hover state
- Capture screenshots of selected row state
- Verify tech badge colors match design system

---

## Related Documents

- [Architecture Design](../../../02-architecture/architecture-design.md) - Section: Interactive Components
- [Design Systems](../../../02-architecture/design-systems.md) - Section: Hover States, Tooltips, Tech Badges
- [Test Strategies](../../../03-testing/test-strategies.md) - Feature: repo-002-display/interactive-cards.feature
