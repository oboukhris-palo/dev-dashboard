import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Observable } from 'rxjs';
import { RepositoryStateService } from '@state/repository-state.service';
import { RepositoryListComponent } from './components/repository-list/repository-list.component';

/**
 * Root Application Component
 * 
 * Main container component with toolbar and repository list.
 * Triggers initial scan on load.
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
  
  title = 'Dev Dashboard';

  // Observables for template
  loading$ = this.repositoryState.loading$;
  error$ = this.repositoryState.error$;
  repositoriesCount$ = this.repositoryState.repositoriesCount$;

  constructor(
    private repositoryState: RepositoryStateService
  ) { }

  ngOnInit(): void {
    // TODO: Implement initial scan
    // Trigger workspace scan when component initializes
    // @todo RED: Write test for ngOnInit calling scanWorkspaces
    // @todo GREEN: Call this.onScanClick()
    
    throw new Error('Not implemented');
  }

  /**
   * Handle scan button click
   * Triggers full workspace scan
   * 
   * @todo RED: Write test for scan button click
   * @todo RED: Write test for loading state during scan
   * @todo GREEN: Implement scan trigger
   */
  onScanClick(): void {
    // TODO: Implement scan trigger
    // Call repositoryState.scanWorkspaces().subscribe()
    
    throw new Error('Not implemented');
  }
}
