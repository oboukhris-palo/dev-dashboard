import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RepositoryStateService } from '@state/repository-state.service';
import { MetadataPersistenceService } from '@services/metadata-persistence.service';
import { RepositoryListComponent } from './components/repository-list/repository-list.component';

/**
 * Root Application Component
 * 
 * Main container component with toolbar and repository list.
 * Triggers initial scan on load or shows setup wizard if not configured.
 * 
 * @epic REPO-001 - Repository Discovery & Scanning
 * @story REPO-001-US-001 - Scan Workspace Directories
 * @layer Layer 4 - UI Components
 * 
 * @tdd-instructions
 * 1. Write failing component tests (RED phase)
 * 2. Implement component logic (GREEN phase)
 * 3. Refactor for quality (REFACTOR phase)
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    RepositoryListComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  private readonly repositoryState = inject(RepositoryStateService);
  private readonly metadataPersistence = inject(MetadataPersistenceService);
  
  title = 'Dev Dashboard';

  // Observables for template
  loading$ = this.repositoryState.loading$;
  error$ = this.repositoryState.error$;
  repositoriesCount$ = this.repositoryState.repositoriesCount$;

  ngOnInit(): void {
    // Configuration handled by Electron setup wizard before app loads
    // Just trigger initial scan
    this.onScanClick();
  }

  /**
   * Handle scan button click
   * Triggers full workspace scan
   */
  onScanClick(): void {
    this.repositoryState.scanWorkspaces().subscribe({
      next: (result) => {
        console.log(`Scan complete: ${result.totalCount} repositories found in ${result.scanDurationMs}ms`);
      },
      error: (error) => {
        console.error('Scan failed:', error);
      }
    });
  }
}
