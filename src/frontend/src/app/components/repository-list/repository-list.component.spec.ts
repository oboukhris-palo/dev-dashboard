import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RepositoryListComponent } from './repository-list.component';
import { RepositoryStateService } from '@state/repository-state.service';
import { of } from 'rxjs';
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
});
