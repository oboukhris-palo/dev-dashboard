import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RepositoryStateService } from '@state/repository-state.service';
import { MetadataPersistenceService } from '@services/metadata-persistence.service';
import { RepositoryListComponent } from './components/repository-list/repository-list.component';
import { SetupWizardComponent } from './components/setup-wizard/setup-wizard.component';

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
    MatDialogModule,
    RepositoryListComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  private readonly repositoryState = inject(RepositoryStateService);
  private readonly metadataPersistence = inject(MetadataPersistenceService);
  private readonly dialog = inject(MatDialog);
  
  title = 'Dev Dashboard';

  // Observables for template
  loading$ = this.repositoryState.loading$;
  error$ = this.repositoryState.error$;
  repositoriesCount$ = this.repositoryState.repositoriesCount$;

  ngOnInit(): void {
    // Check if workspaces are configured
    this.checkConfigurationAndScan();
  }

  /**
   * Check if workspaces are configured, show wizard if not, otherwise scan
   */
  private checkConfigurationAndScan(): void {
    const configuredPaths = localStorage.getItem('dev-dashboard-workspace-paths');
    
    if (!configuredPaths || JSON.parse(configuredPaths).length === 0) {
      // Show setup wizard
      this.openSetupWizard();
    } else {
      // Auto-scan on load
      this.onScanClick();
    }
  }

  /**
   * Open the setup wizard dialog
   */
  openSetupWizard(): void {
    const dialogRef = this.dialog.open(SetupWizardComponent, {
      width: '700px',
      disableClose: true,
      panelClass: 'setup-wizard-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.shouldScan) {
        // User configured workspaces, trigger scan
        this.onScanClick();
      }
    });
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
