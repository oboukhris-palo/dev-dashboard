import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { Repository } from '@domain/repository.model';
import { RepositoryStateService } from '@state/repository-state.service';

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
    MatIconModule
  ],
  templateUrl: './repository-list.component.html',
  styleUrls: ['./repository-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RepositoryListComponent {
  private readonly repositoryState = inject(RepositoryStateService);

  repositories$: Observable<Repository[]> = this.repositoryState.repositories$;

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
   * Get tech stack badge hex color for the given technology name.
   *
   * @param tech - Technology name (e.g. 'Angular', 'Node.js', 'Java', '.NET', 'Python')
   * @returns string - Hex color code for the badge background
   */
  getTechColor(tech: string): string {
    switch (tech) {
      case 'Angular': return '#DD0031';
      case 'Node.js': return '#68A063';
      case 'Java':    return '#0066CC';
      case '.NET':    return '#7B3FF2';
      case 'Python':  return '#FFD43B';
      default:        return '#757575';
    }
  }
}
