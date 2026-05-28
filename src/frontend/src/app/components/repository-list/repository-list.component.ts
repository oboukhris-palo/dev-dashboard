import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { Repository } from '@domain/repository.model';
import { RepositoryStateService } from '@state/repository-state.service';
import { InlineDescriptionEditComponent } from './inline-description-edit.component';
import { PhaseStatusSelectorComponent } from './phase-status-selector.component';
import { updateDescription, updatePhase, updateStatus } from '@state/repository.store';
import { ProjectPhase } from '@domain/phase.enum';
import { ProjectStatus } from '@domain/status.enum';

export type SortField = 'name' | 'phase' | 'status';
export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

/**
 * Repository List Component
 * 
 * Displays grid of repository cards with metadata.
 * 
 * @epic REPO-002 - Repository Information Display
 * @story REPO-002-US-001 - Display Repository Information
 * @layer Layer 4 - UI Components
 * 
 * @tdd-instructions
 * 1. Write failing component tests (RED phase)
 * 2. Implement component logic (GREEN phase)
 * 3. Refactor for quality (REFACTOR phase)
 */
@Component({
  selector: 'app-repository-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatSelectModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatInputModule,
    FormsModule,
    InlineDescriptionEditComponent,
    PhaseStatusSelectorComponent
  ],
  templateUrl: './repository-list.component.html',
  styleUrls: ['./repository-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RepositoryListComponent {
  private readonly repositoryState = inject(RepositoryStateService);

  private readonly sortSubject = new BehaviorSubject<SortConfig>({ field: 'name', direction: 'asc' });
  private readonly selectedIdSubject = new BehaviorSubject<string | null>(null);
  private readonly searchTermSubject = new BehaviorSubject<string>('');

  readonly sort$ = this.sortSubject.asObservable();
  readonly selectedId$ = this.selectedIdSubject.asObservable();
  readonly searchTerm$ = this.searchTermSubject.asObservable();

  readonly repositories$: Observable<Repository[]> = this.repositoryState.repositories$;

  searchTerm = '';

  readonly sortedRepositories$: Observable<Repository[]> = combineLatest([
    this.repositories$,
    this.sort$,
    this.searchTerm$
  ]).pipe(
    map(([repos, sort, searchTerm]) => {
      const filtered = this.filterRepositories(repos, searchTerm);
      return this.sortRepositories(filtered, sort);
    })
  );

  get currentSort(): SortConfig {
    return this.sortSubject.getValue();
  }

  get selectedRepositoryId(): string | null {
    return this.selectedIdSubject.getValue();
  }

  selectRepository(repository: Repository): void {
    this.selectedIdSubject.next(repository.id);
  }

  isSelected(repository: Repository): boolean {
    return repository.id === this.selectedRepositoryId;
  }

  updateDescriptionValue(repoId: string, newDescription: string): void {
    updateDescription(repoId, newDescription);
  }
updatePhaseValue(repoId: string, phase: ProjectPhase): void {
    updatePhase(repoId, phase);
  }

  updateStatusValue(repoId: string, status: ProjectStatus): void {
    updateStatus(repoId, status);
  }

  
  truncatePath(path: string, maxLength = 40): string {
    if (path.length <= maxLength) return path;
    return path.substring(0, maxLength) + '...';
  }

  setSortField(field: SortField): void {
    const current = this.sortSubject.getValue();
    if (current.field === field) {
      this.sortSubject.next({ field, direction: current.direction === 'asc' ? 'desc' : 'asc' });
    } else {
      this.sortSubject.next({ field, direction: 'asc' });
    }
  }

  setSortFieldFromString(field: string): void {
    if (field === 'name' || field === 'phase' || field === 'status') {
      this.setSortField(field);
    }
  }

  onSearchChange(term: string): void {
    this.searchTerm = term;
    this.searchTermSubject.next(term.toLowerCase().trim());
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.searchTermSubject.next('');
  }

  filterRepositories(repos: Repository[], searchTerm: string): Repository[] {
    if (!searchTerm) return repos;
    
    return repos.filter(repo => {
      const nameMatch = repo.name.toLowerCase().includes(searchTerm);
      const descMatch = (repo.description || '').toLowerCase().includes(searchTerm);
      const metaDescMatch = (repo.metadata?.description || '').toLowerCase().includes(searchTerm);
      const pathMatch = repo.path.toLowerCase().includes(searchTerm);
      const techMatch = repo.techStack?.some(tech => tech.toLowerCase().includes(searchTerm));
      
      return nameMatch || descMatch || metaDescMatch || pathMatch || techMatch;
    });
  }

  sortRepositories(repos: Repository[], sort: SortConfig): Repository[] {
    return [...repos].sort((a, b) => {
      const aVal = (a[sort.field] ?? '').toLowerCase();
      const bVal = (b[sort.field] ?? '').toLowerCase();
      const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return sort.direction === 'asc' ? cmp : -cmp;
    });
  }

  /**
   * Handle card click (open in file explorer)
   * 
   * @param repository - Repository to open
   * 
   * @todo RED: Write test for card click
   * @todo GREEN: Implement file explorer opening
   * 
   * @future Enhancement for opening repositories
   */
  onCardClick(repository: Repository): void {
    // TODO: Implement repository opening
    // In browser: Just log for now
    // In Electron: Use shell.openPath(repository.path)
    console.log('Opening repository:', repository.path);
  }

  /**
   * Open repository in VSCode Insiders
   * 
   * @param repository - Repository to open
   */
  openInVSCode(repository: Repository): void {
    // Open VSCode Insiders with the repository path
    // This uses the vscode-insiders:// URL scheme
    const vscodeUrl = `vscode-insiders://file${repository.path}`;
    window.location.href = vscodeUrl;
  }

  /**
   * TrackBy function for ngFor performance
   * 
   * @param index - Item index
   * @param repository - Repository item
   * @returns string - Unique identifier (path)
   */
  trackByPath(index: number, repository: Repository): string {
    return repository.path;
  }

  /**
   * Get GitHub official language color for the given technology name.
   * Based on GitHub's linguist colors: https://github.com/github/linguist/blob/master/lib/linguist/languages.yml
   *
   * @param tech - Technology name (e.g. 'Angular', 'Node.js', 'Java', '.NET', 'Python', 'TypeScript')
   * @returns string - Hex color code matching GitHub's official colors
   */
  getLanguageColor(tech: string): string {
    const colors: { [key: string]: string } = {
      'TypeScript': '#3178c6',
      'JavaScript': '#f1e05a',
      'Angular': '#dd0031',
      'Node.js': '#68a063',
      'Java': '#b07219',
      'C#': '#178600',
      '.NET': '#178600',
      'Python': '#3572A5',
      'HTML': '#e34c26',
      'CSS': '#563d7c',
      'SCSS': '#c6538c',
      'Shell': '#89e051',
      'Ruby': '#701516',
      'Go': '#00ADD8',
      'Rust': '#dea584',
      'PHP': '#4F5D95',
      'Swift': '#ffac45',
      'Kotlin': '#A97BFF',
      'C++': '#f34b7d',
      'C': '#555555'
    };
    
    return colors[tech] || '#858585';
  }

  /**
   * Calculate percentage for each language in the tech stack.
   * Distributes equally for simplicity (real GitHub uses lines of code).
   *
   * @param techStack - Array of technologies
   * @param tech - Specific technology to calculate percentage for
   * @returns number - Percentage value (0-100)
   */
  getLanguagePercentage(techStack: string[], tech: string): number {
    if (!techStack || techStack.length === 0) return 0;
    // Equal distribution for now (could be enhanced with actual file counts)
    return 100 / techStack.length;
  }
}
