import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule } from '@angular/forms';
import { ProjectPhase } from '@domain/phase.enum';
import { ProjectStatus } from '@domain/status.enum';

/**
 * Phase/Status Selector Component
 * 
 * Shows read-only badges by default, editable on click.
 * 
 * @layer Layer 4 - UI Components
 */
@Component({
  selector: 'app-phase-status-selector',
  standalone: true,
  imports: [CommonModule, MatSelectModule, MatFormFieldModule, MatChipsModule, FormsModule],
  template: `
    <div class="selector-container">
      <!-- Read-only view -->
      @if (!editingPhase && !editingStatus) {
        <div class="badge-container">
          @if (phase) {
            <span class="badge badge-phase" (click)="startPhaseEdit()" title="Click to edit">
              {{ phase }}
            </span>
          } @else {
            <span class="badge badge-empty" (click)="startPhaseEdit()" title="Click to set phase">
              No Phase
            </span>
          }
          
          @if (status) {
            <span class="badge badge-status" (click)="startStatusEdit()" title="Click to edit">
              {{ status }}
            </span>
          } @else {
            <span class="badge badge-empty" (click)="startStatusEdit()" title="Click to set status">
              No Status
            </span>
          }
        </div>
      }

      <!-- Edit mode -->
      @if (editingPhase) {
        <mat-form-field class="field-phase" appearance="outline">
          <mat-label>Phase</mat-label>
          <mat-select
            [(ngModel)]="selectedPhase"
            (selectionChange)="onPhaseChange($event.value)"
            (blur)="editingPhase = false"
            [attr.data-testid]="'select-phase-' + id">
            <mat-option>-- No Phase --</mat-option>
            @for (phase of phases; track phase) {
              <mat-option [value]="phase">{{ phase }}</mat-option>
            }
          </mat-select>
        </mat-form-field>
      }

      @if (editingStatus) {
        <mat-form-field class="field-status" appearance="outline">
          <mat-label>Status</mat-label>
          <mat-select
            [(ngModel)]="selectedStatus"
            (selectionChange)="onStatusChange($event.value)"
            (blur)="editingStatus = false"
            [attr.data-testid]="'select-status-' + id">
            <mat-option>-- No Status --</mat-option>
            @for (status of statuses; track status) {
              <mat-option [value]="status">{{ status }}</mat-option>
            }
          </mat-select>
        </mat-form-field>
      }
    </div>
  `,
  styles: [`
    .selector-container {
      display: flex;
      gap: 16px;
      align-items: center;
      padding: 8px 0;
    }

    .badge-container {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .badge {
      padding: 4px 12px;
      border-radius: 16px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      border: 1px solid transparent;
    }

    .badge:hover {
      opacity: 0.8;
      transform: scale(1.05);
    }

    .badge-phase {
      background-color: #7B3FF2;
      color: white;
    }

    .badge-status {
      background-color: #00A651;
      color: white;
    }

    .badge-empty {
      background-color: #F0F0F0;
      color: #808080;
      border: 1px dashed #808080;
    }

    .field-phase,
    .field-status {
      min-width: 150px;
    }

    ::ng-deep {
      .mat-mdc-select-trigger {
        padding-right: 8px;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PhaseStatusSelectorComponent {
  @Input() id!: string;
  @Input() phase?: ProjectPhase;
  @Input() status?: ProjectStatus;
  @Output() phaseChanged = new EventEmitter<ProjectPhase>();
  @Output() statusChanged = new EventEmitter<ProjectStatus>();

  phases = Object.values(ProjectPhase);
  statuses = Object.values(ProjectStatus);

  selectedPhase: ProjectPhase | undefined;
  selectedStatus: ProjectStatus | undefined;
  editingPhase = false;
  editingStatus = false;

  ngOnInit(): void {
    this.selectedPhase = this.phase;
    this.selectedStatus = this.status;
  }

  ngOnChanges(): void {
    this.selectedPhase = this.phase;
    this.selectedStatus = this.status;
  }

  startPhaseEdit(): void {
    this.editingPhase = true;
    this.editingStatus = false;
  }

  startStatusEdit(): void {
    this.editingStatus = true;
    this.editingPhase = false;
  }

  onPhaseChange(phase: ProjectPhase | undefined): void {
    if (phase) {
      this.phaseChanged.emit(phase);
    }
    this.editingPhase = false;
  }

  onStatusChange(status: ProjectStatus | undefined): void {
    if (status) {
      this.statusChanged.emit(status);
    }
    this.editingStatus = false;
  }
}
