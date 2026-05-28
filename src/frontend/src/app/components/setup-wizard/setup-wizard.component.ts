import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

/**
 * Setup Wizard Component
 * 
 * Initial configuration wizard that appears when no workspaces are configured.
 * Allows users to select local folders to scan for repositories.
 * 
 * @epic REPO-001 - Repository Discovery & Scanning
 * @story Initial Setup UX Enhancement
 * @layer Layer 4 - UI Components
 */
@Component({
  selector: 'app-setup-wizard',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './setup-wizard.component.html',
  styleUrls: ['./setup-wizard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SetupWizardComponent {
  workspacePaths = signal<string[]>([]);
  isScanning = signal<boolean>(false);

  constructor(private dialogRef: MatDialogRef<SetupWizardComponent>) {}

  /**
   * Open native directory picker and add selected path
   */
  async addWorkspace(): Promise<void> {
    try {
      // Use File System Access API (modern browsers)
      if ('showDirectoryPicker' in window) {
        const directoryHandle = await (window as any).showDirectoryPicker({
          mode: 'read',
          startIn: 'documents'
        });
        
        // Note: We can't get the full path from the File System Access API directly
        // Instead, we'll use the directory name and store the handle
        const path = directoryHandle.name;
        this.addPath(path);
      } else {
        // Fallback: Show input dialog
        const path = prompt('Enter the full path to your workspace directory:');
        if (path && path.trim()) {
          this.addPath(path.trim());
        }
      }
    } catch (error) {
      console.error('Error selecting directory:', error);
      // User cancelled or error occurred - show fallback input
      const path = prompt('Enter the full path to your workspace directory:');
      if (path && path.trim()) {
        this.addPath(path.trim());
      }
    }
  }

  /**
   * Add a workspace path to the list
   */
  private addPath(path: string): void {
    const currentPaths = this.workspacePaths();
    if (!currentPaths.includes(path)) {
      this.workspacePaths.set([...currentPaths, path]);
    }
  }

  /**
   * Remove a workspace path from the list
   */
  removePath(path: string): void {
    const currentPaths = this.workspacePaths();
    this.workspacePaths.set(currentPaths.filter(p => p !== path));
  }

  /**
   * Scan workspaces and close wizard
   */
  scanWorkspaces(): void {
    const paths = this.workspacePaths();
    if (paths.length > 0) {
      // Save to localStorage
      localStorage.setItem('dev-dashboard-workspace-paths', JSON.stringify(paths));
      
      // Close dialog and trigger scan
      this.dialogRef.close({ shouldScan: true, workspacePaths: paths });
    }
  }

  /**
   * Close wizard without scanning
   */
  cancel(): void {
    this.dialogRef.close({ shouldScan: false });
  }
}
