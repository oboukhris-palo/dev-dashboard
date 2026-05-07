import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
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
export class RepositoryListComponent implements OnInit {

  repositories$: Observable<Repository[]>;

  constructor(
    private repositoryState: RepositoryStateService
  ) {
    this.repositories$ = this.repositoryState.repositories$;
  }

  ngOnInit(): void {
    // TODO: Add any initialization logic if needed
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
   * Get tech stack badge color
   * 
   * @param tech - Technology name
   * @returns string - Material color name
   * 
   * @todo RED: Write test for color mapping
   * @todo GREEN: Implement color logic
   */
  getTechColor(tech: string): string {
    // TODO: Implement tech color mapping
    // Node.js → 'accent' (green)
    // Angular → 'warn' (red)
    // Java → 'primary' (blue)
    // .NET → '' (purple - custom)
    // Default → '' (gray)
    
    return '';
  }
}
