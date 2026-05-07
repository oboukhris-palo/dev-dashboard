---
generated_from_template: user-story-tmpl.yml
generation_date: 2026-05-07
generator_agent: product-owner
story_key: REPO-002-US-001
epic_key: REPO-002
project_key: dev-dashboard
priority: High
status: To Do
story_points: 5
---

# REPO-002-US-001: Display Repository List

## User Story

**As a** developer  
**I want** to see all repositories in a clean, organized list  
**So that** I can quickly scan and find the project I need

---

## Acceptance Criteria

- [ ] Display repositories in Material Design table or card layout
- [ ] Show columns: Name, Description, Path, Dev Stack, Phase, Status
- [ ] List renders within 1 second after data loads
- [ ] UI is responsive and works on different screen sizes
- [ ] Table supports sorting by name, phase, and status

---

## BDD Scenarios

```gherkin
Feature: Repository List Display

  Scenario: Display all repositories
    Given 25 repositories have been discovered
    When the dashboard loads
    Then all 25 repositories are displayed in the table
    And each row shows name, description, path, dev stack, phase, and status

  Scenario: Sort repositories by name
    Given repositories are displayed
    When I click the "Name" column header
    Then repositories are sorted alphabetically by name
```

---

## Dependencies

### Prerequisites
- REPO-001 (Repository Discovery & Scanning) must be completed
  - All three user stories: US-001, US-002, US-003
- Repository data available with: name, path, description, devStack

### Blocks
- REPO-002-US-002 (Interactive Repository Cards) - Requires table/card layout
- REPO-003-US-001 (Edit Repository Description) - Cannot edit what isn't displayed

---

## Technical Constraints

**From [Architecture Design](../../../02-architecture/architecture-design.md):**
- UI must render within 1 second (NFR-002)
- Use Angular Material components exclusively
- Responsive design for screen widths ≥ 1024px
- Maximum 50 repositories per page (pagination if needed)

**From [Design Systems](../../../02-architecture/design-systems.md):**
- **Color Palette**: Palo IT Tech Blue `#0066CC`, Black `#000000`, White `#FFFFFF`, Light Gray `#F0F0F0`
- **Typography**: Roboto font family, sizes 16px (body), 20px (headers)
- **Spacing**: 16px padding between rows, 24px margins around table
- **Table Component**: mat-table with mat-sort directive
- **Tech Badges**: mat-chip with colors: Node.js `#00A651`, Angular `#DD0031`, Java `#0066CC`, .NET `#7B3FF2`, Python `#FF8C42`

**Technology Stack:**
- Angular Material `MatTableModule` for table
- Angular Material `MatSortModule` for sorting
- Angular Material `MatChipsModule` for tech stack badges

---

## Implementation Notes

**Component Structure:**
```typescript
@Component({
  selector: 'app-repository-list',
  templateUrl: './repository-list.component.html',
  styleUrls: ['./repository-list.component.css']
})
export class RepositoryListComponent implements OnInit {
  displayedColumns: string[] = ['name', 'description', 'path', 'devStack', 'phase', 'status'];
  dataSource: MatTableDataSource<Repository>;
  
  @ViewChild(MatSort) sort: MatSort;
  
  ngOnInit() {
    // Load repository data
    this.dataSource.sort = this.sort;
  }
}
```

**Table Layout:**
- Column widths: Name (15%), Description (30%), Path (25%), Dev Stack (15%), Phase (7.5%), Status (7.5%)
- Fixed header with scroll for rows exceeding viewport height
- Zebra striping for alternating row background colors

---

## Test Strategy

**Unit Tests:**
- Test component initialization
- Test data source binding
- Test sorting functionality for each sortable column
- Test rendering with 0, 1, 25, 50 repositories

**Integration Tests:**
- Test data flow from discovery service to display component
- Test sorting with real repository data
- Test responsive layout on 1024px, 1440px, 1920px widths

**BDD Tests:**
- Implement both Gherkin scenarios above
- Verify all repositories display correctly
- Verify sorting works as expected

**Performance Tests:**
- Measure render time with 25 repositories (target: < 1 second)
- Measure render time with 50 repositories (target: < 1.5 seconds)

---

## Related Documents

- [Architecture Design](../../../02-architecture/architecture-design.md) - Section: Component Architecture
- [Tech Spec](../../../02-architecture/tech-spec.md) - Section: Data Model
- [Design Systems](../../../02-architecture/design-systems.md) - Section: UI Components, Table Design
- [Test Strategies](../../../03-testing/test-strategies.md) - Feature: repo-002-display/display-list.feature
