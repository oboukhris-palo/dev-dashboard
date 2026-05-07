---
generated_from_template: user-story-tmpl.yml
generation_date: 2026-05-07
generator_agent: product-owner
story_key: REPO-003-US-003
epic_key: REPO-003
project_key: dev-dashboard
priority: High
status: To Do
story_points: 5
---

# REPO-003-US-003: Persist Metadata Locally

## User Story

**As a** developer  
**I want** my edits to persist across sessions  
**So that** I don't lose my metadata changes

---

## Acceptance Criteria

- [ ] All edits save to browser localStorage or local file
- [ ] Metadata persists after browser refresh
- [ ] Metadata persists after Apache service restart
- [ ] Handle storage quota gracefully

---

## BDD Scenarios

```gherkin
Feature: Metadata Persistence

  Scenario: Persist edits after refresh
    Given I have edited repository metadata
    When I refresh the page
    Then all my edits are still present

  Scenario: Persist across service restart
    Given I have edited repository metadata
    When the Apache service is restarted
    And I reload the application
    Then all my edits are still present
```

---

## Dependencies

### Prerequisites
- REPO-003-US-001 (Edit Repository Description) - Edits must exist before persistence
- REPO-003-US-002 (Edit Project Phase and Status) - Edits must exist before persistence

### Unblocks
- All editing features depend on this for data durability

---

## Technical Constraints

**From [Architecture Design](../../../02-architecture/architecture-design.md):**
- Persistence mechanism: localStorage (primary) OR local file system (fallback)
- Storage quota: 5MB browser localStorage (handles ~500 repositories)
- Data format: JSON-serialized repository objects
- Conflict resolution: Last-write-wins (no concurrent editing support)
- Save strategy: Immediate save on every edit (no batching)

**Technology Stack:**
- Browser `localStorage` API (client-side)
- OR Node.js `fs.promises` for file-based persistence (server-side)
- JSON serialization/deserialization

**Error Handling:**
- If localStorage quota exceeded, show error message and disable further edits
- If localStorage unavailable (private browsing), show warning and switch to in-memory storage
- Log errors to console for debugging

---

## Implementation Notes

**Persistence Service (localStorage):**
```typescript
@Injectable({ providedIn: 'root' })
export class PersistenceService {
  private readonly STORAGE_KEY = 'dev-dashboard-repositories';
  
  saveRepository(repo: Repository): void {
    try {
      const repos = this.loadAll();
      const index = repos.findIndex(r => r.path === repo.path);
      if (index >= 0) {
        repos[index] = repo;
      } else {
        repos.push(repo);
      }
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(repos));
    } catch (error) {
      if (error.name === 'QuotaExceededError') {
        this.handleQuotaExceeded();
      } else {
        console.error('Failed to save repository:', error);
      }
    }
  }
  
  loadAll(): Repository[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load repositories:', error);
      return [];
    }
  }
  
  private handleQuotaExceeded(): void {
    // Show error message to user
    // Disable further edits
    console.error('localStorage quota exceeded. Cannot save more data.');
  }
}
```

**Data Merge Strategy:**
1. On application load:
   - Scan workspace directories (REPO-001-US-001)
   - Load persisted metadata from localStorage
   - Merge by repository path (key)
   - Discovered repositories get metadata overlaid from localStorage
   - Orphaned metadata (no matching repository) is ignored

**Merge Algorithm:**
```typescript
mergeRepositories(discovered: Repository[], persisted: Repository[]): Repository[] {
  return discovered.map(repo => {
    const metadata = persisted.find(p => p.path === repo.path);
    return metadata ? { ...repo, ...metadata } : repo;
  });
}
```

---

## Test Strategy

**Unit Tests:**
- Test save single repository to localStorage
- Test load all repositories from localStorage
- Test quota exceeded error handling
- Test localStorage unavailable (private browsing)
- Test merge discovered and persisted data

**Integration Tests:**
- Test full edit → save → reload → verify workflow
- Test multiple repositories with different edits
- Test Apache service restart (manual verification)

**BDD Tests:**
- Implement both Gherkin scenarios above
- Verify edits persist after page refresh
- Verify edits persist after Apache restart

**Performance Tests:**
- Measure save time for 1, 10, 50 repositories
- Verify save completes in < 100ms
- Measure load time for 500 repositories (quota limit)

---

## Related Documents

- [Architecture Design](../../../02-architecture/architecture-design.md) - Section: Persistence Layer
- [Tech Spec](../../../02-architecture/tech-spec.md) - Section: Storage Schema, Data Model
- [Test Strategies](../../../03-testing/test-strategies.md) - Feature: repo-003-management/persist-metadata.feature
