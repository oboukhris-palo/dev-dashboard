import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RepositoryListComponent } from './repository-list.component';
import { RepositoryStateService } from '@state/repository-state.service';
import { of, take } from 'rxjs';
import { Repository } from '@domain/repository.model';

/**
 * Unit Tests for RepositoryListComponent
 * 
 * @epic REPO-002 - Repository Information Display
 * @story REPO-001-US-003 - Detect Technology Stack (Badge rendering)
 * @layer Layer 4 - UI Components
 */
describe('RepositoryListComponent', () => {
  let component: RepositoryListComponent;
  let fixture: ComponentFixture<RepositoryListComponent>;

  const mockRepo: Repository = {
    id: '/workspace/my-project',
    name: 'my-project',
    path: '/workspace/my-project',
    description: 'A sample project.',
    techStack: ['Angular', 'Node.js']
  };

  beforeEach(async () => {
    const stateMock = jasmine.createSpyObj('RepositoryStateService', [], {
      repositories$: of([mockRepo])
    });

    await TestBed.configureTestingModule({
      imports: [RepositoryListComponent],
      providers: [
        { provide: RepositoryStateService, useValue: stateMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RepositoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ─── Test 12: Render tech stack badges ───────────────────────────────────

  describe('Test 12 — Render tech stack badges', () => {
    it('should render a badge for each technology in techStack', () => {
      const badges = fixture.nativeElement.querySelectorAll('[data-testid^="badge-tech-"]');
      expect(badges.length).toBe(2);
    });

    it('should render badge with correct data-testid for Angular', () => {
      const badge = fixture.nativeElement.querySelector('[data-testid="badge-tech-Angular"]');
      expect(badge).toBeTruthy();
    });

    it('should render badge with correct data-testid for Node.js', () => {
      const badge = fixture.nativeElement.querySelector('[data-testid="badge-tech-Node.js"]');
      expect(badge).toBeTruthy();
    });
  });

  // ─── Test 13: Badge colors match specification ───────────────────────────

  describe('Test 13 — getTechColor returns correct hex codes', () => {
    it('should return #DD0031 for Angular', () => {
      expect(component.getTechColor('Angular')).toBe('#DD0031');
    });

    it('should return #68A063 for Node.js', () => {
      expect(component.getTechColor('Node.js')).toBe('#68A063');
    });

    it('should return #0066CC for Java', () => {
      expect(component.getTechColor('Java')).toBe('#0066CC');
    });

    it('should return #7B3FF2 for .NET', () => {
      expect(component.getTechColor('.NET')).toBe('#7B3FF2');
    });

    it('should return #FFD43B for Python', () => {
      expect(component.getTechColor('Python')).toBe('#FFD43B');
    });

    it('should return #757575 for unknown technology', () => {
      expect(component.getTechColor('Rust')).toBe('#757575');
    });
  });

  // ─── Test 14: Handle empty tech stack ────────────────────────────────────

  describe('Test 14 — Handle empty tech stack', () => {
    beforeEach(async () => {
      const repoNoTech: Repository = {
        id: '/workspace/no-tech',
        name: 'no-tech',
        path: '/workspace/no-tech',
        techStack: []
      };

      const stateMock = jasmine.createSpyObj('RepositoryStateService', [], {
        repositories$: of([repoNoTech])
      });

      await TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        imports: [RepositoryListComponent],
        providers: [
          { provide: RepositoryStateService, useValue: stateMock }
        ]
      }).compileComponents();

      fixture = TestBed.createComponent(RepositoryListComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should not render any tech badges when techStack is empty', () => {
      const badges = fixture.nativeElement.querySelectorAll('[data-testid^="badge-tech-"]');
      expect(badges.length).toBe(0);
    });
  });

  // ─── Test 15: Sorting ─────────────────────────────────────────────────────

  describe('Test 15 — Sorting', () => {
    const repoC: Repository = { id: '/c', name: 'charlie', path: '/c', phase: 'Production', status: 'Active' };
    const repoA: Repository = { id: '/a', name: 'alpha', path: '/a', phase: 'Development', status: 'Inactive' };
    const repoB: Repository = { id: '/b', name: 'bravo', path: '/b', phase: 'Maintenance', status: 'Active' };

    let multiFixture: ComponentFixture<RepositoryListComponent>;
    let multiComponent: RepositoryListComponent;

    beforeEach(async () => {
      const stateMock = jasmine.createSpyObj('RepositoryStateService', [], {
        repositories$: of([repoC, repoA, repoB])
      });

      await TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        imports: [RepositoryListComponent],
        providers: [{ provide: RepositoryStateService, useValue: stateMock }]
      }).compileComponents();

      multiFixture = TestBed.createComponent(RepositoryListComponent);
      multiComponent = multiFixture.componentInstance;
      multiFixture.detectChanges();
    });

    it('should default sort by name ascending', (done) => {
      multiComponent.sortedRepositories$.subscribe(sorted => {
        expect(sorted[0].name).toBe('alpha');
        expect(sorted[1].name).toBe('bravo');
        expect(sorted[2].name).toBe('charlie');
        done();
      });
    });

    it('should sort by name descending when toggled', (done) => {
      multiComponent.setSortField('name'); // toggle to desc
      multiComponent.sortedRepositories$.subscribe(sorted => {
        expect(sorted[0].name).toBe('charlie');
        expect(sorted[2].name).toBe('alpha');
        done();
      });
    });

    it('should sort by phase ascending', (done) => {
      multiComponent.setSortField('phase');
      multiComponent.sortedRepositories$.subscribe(sorted => {
        expect(sorted[0].phase).toBe('Development');
        expect(sorted[1].phase).toBe('Maintenance');
        expect(sorted[2].phase).toBe('Production');
        done();
      });
    });

    it('should sort by status ascending', (done) => {
      multiComponent.setSortField('status');
      multiComponent.sortedRepositories$.subscribe(sorted => {
        expect(sorted[0].status).toBe('Active');
        expect(sorted[2].status).toBe('Inactive');
        done();
      });
    });

    it('should toggle direction when same field selected twice', () => {
      multiComponent.setSortField('phase'); // asc
      expect(multiComponent.currentSort).toEqual({ field: 'phase', direction: 'asc' });
      multiComponent.setSortField('phase'); // toggle to desc
      expect(multiComponent.currentSort).toEqual({ field: 'phase', direction: 'desc' });
    });

    it('should reset to asc when switching to a different field', () => {
      multiComponent.setSortField('phase');  // asc
      multiComponent.setSortField('phase');  // desc
      multiComponent.setSortField('status'); // new field → asc
      expect(multiComponent.currentSort).toEqual({ field: 'status', direction: 'asc' });
    });

    it('should render sort control buttons', () => {
      const sortControls = multiFixture.nativeElement.querySelector('[data-testid="sort-controls"]');
      expect(sortControls).toBeTruthy();
      const nameBtn = multiFixture.nativeElement.querySelector('[data-testid="sort-btn-name"]');
      const phaseBtn = multiFixture.nativeElement.querySelector('[data-testid="sort-btn-phase"]');
      const statusBtn = multiFixture.nativeElement.querySelector('[data-testid="sort-btn-status"]');
      expect(nameBtn).toBeTruthy();
      expect(phaseBtn).toBeTruthy();
      expect(statusBtn).toBeTruthy();
    });

    it('should not mutate the original array', () => {
      const repos = [repoC, repoA, repoB];
      const sorted = multiComponent.sortRepositories(repos, { field: 'name', direction: 'asc' });
      expect(repos[0].name).toBe('charlie'); // original unchanged
      expect(sorted[0].name).toBe('alpha');
    });
  });

  // ─── Test 16: Repository Selection ────────────────────────────────────────

  describe('Test 16 — Interactive selection and path truncation', () => {
    it('should select repository on click', () => {
      component.selectRepository(mockRepo);
      expect(component.selectedRepositoryId).toBe(mockRepo.id);
    });

    it('should report isSelected true when repository is selected', () => {
      component.selectRepository(mockRepo);
      expect(component.isSelected(mockRepo)).toBe(true);
    });

    it('should report isSelected false when repository is not selected', () => {
      const otherRepo: Repository = { id: '/other', name: 'other', path: '/other' };
      expect(component.isSelected(otherRepo)).toBe(false);
    });

    it('should switch selection when new repository is selected', () => {
      const repo2: Repository = { id: '/repo2', name: 'repo2', path: '/repo2' };
      component.selectRepository(mockRepo);
      expect(component.isSelected(mockRepo)).toBe(true);
      component.selectRepository(repo2);
      expect(component.isSelected(mockRepo)).toBe(false);
      expect(component.isSelected(repo2)).toBe(true);
    });

    it('should truncate long paths to 40 chars with ellipsis', () => {
      const longPath = '/Users/oboukhris-palo/workspace/dev-dashboard-very-long-name';
      const truncated = component.truncatePath(longPath, 40);
      expect(truncated).toBe('/Users/oboukhris-palo/workspace/dev-dash...');
      expect(truncated.length).toBe(43); // 40 + '...'
    });

    it('should not truncate short paths', () => {
      const shortPath = '/Users/test';
      const result = component.truncatePath(shortPath, 40);
      expect(result).toBe(shortPath);
    });

    it('should render selected state to selectedId$ observable', (done) => {
      component.selectRepository(mockRepo);
      component.selectedId$.pipe(take(1)).subscribe(id => {
        expect(id).toBe(mockRepo.id);
        done();
      });
    });

    it('should render tooltip with full path on subtitle', (done) => {
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        const subtitle = fixture.nativeElement.querySelector('mat-card-subtitle');
        expect(subtitle).toBeTruthy();
        expect(subtitle.getAttribute('ng-reflect-message')).toBe(mockRepo.path);
        done();
      });
    });
  });
});
