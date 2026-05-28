import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  inject,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnInit,
  OnDestroy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Subject, takeUntil } from 'rxjs';
import { MetadataEditorService } from '@services/metadata-editor.service';

/**
 * Inline Description Edit Component
 * 
 * Displays repository description with double-click activation.
 * Edit mode: text input, Enter saves, Escape cancels.
 * 
 * @layer Layer 4 - UI Components
 */
@Component({
  selector: 'app-inline-description-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, MatInputModule, MatFormFieldModule],
  template: `
    <div
      *ngIf="!isEditing"
      (dblclick)="startEdit()"
      class="description-display"
      [title]="value">
      {{ value || 'No description' }}
    </div>

    <div *ngIf="isEditing" class="description-edit">
      <input
        #editInput
        matInput
        [(ngModel)]="editValue"
        (keydown.enter)="saveEdit()"
        (keydown.escape)="cancelEdit()"
        (blur)="saveEdit()"
        class="edit-input"
        maxlength="500"
        placeholder="Enter description (max 500 chars)">
      <span class="char-count">{{ editValue.length }}/500</span>
    </div>
  `,
  styles: [`
    .description-display {
      cursor: pointer;
      padding: 8px;
      min-height: 24px;
      border-radius: 4px;
      transition: background-color 0.2s;
      word-break: break-word;
      white-space: pre-wrap;
    }

    .description-display:hover {
      background-color: rgba(0, 102, 204, 0.05);
      border: 1px solid rgba(0, 102, 204, 0.1);
    }

    .description-edit {
      position: relative;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .edit-input {
      padding: 8px;
      border: 2px solid #0066CC;
      border-radius: 4px;
      font-family: inherit;
      font-size: 14px;
      min-height: 48px;
      resize: vertical;
    }

    .edit-input:focus {
      outline: none;
      border-color: #0066CC;
      box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
    }

    .char-count {
      font-size: 12px;
      color: #666;
      align-self: flex-end;
      margin-right: 8px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InlineDescriptionEditComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() id!: string;
  @Input() value: string = '';
  @Output() valueChanged = new EventEmitter<string>();

  @ViewChild('editInput') editInput?: ElementRef<HTMLInputElement>;

  private readonly editorService = inject(MetadataEditorService);
  private destroy$ = new Subject<void>();

  isEditing = false;
  editValue = '';

  ngOnInit(): void {
    this.editorService.editState$
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        this.isEditing = state.editingId === this.id;
        if (this.isEditing) {
          this.editValue = state.editValues[this.id] || this.value || '';
        }
      });
  }

  ngAfterViewInit(): void {
    if (this.isEditing && this.editInput) {
      setTimeout(() => this.editInput?.nativeElement.focus(), 0);
    }
  }

  startEdit(): void {
    this.editorService.enableEdit(this.id, this.value);
  }

  saveEdit(): void {
    const newValue = this.editorService.saveDescription(this.id, this.editValue);
    this.value = newValue;
    this.valueChanged.emit(newValue);
    this.isEditing = false;
  }

  cancelEdit(): void {
    this.editorService.cancelEdit(this.id);
    this.isEditing = false;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
