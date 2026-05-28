import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface EditState {
  editingId: string | null;
  editValues: Record<string, string>;
}

@Injectable({
  providedIn: 'root'
})
export class MetadataEditorService {
  private editState = new BehaviorSubject<EditState>({
    editingId: null,
    editValues: {}
  });

  editState$ = this.editState.asObservable();

  enableEdit(id: string, currentValue: string = ''): void {
    const state = this.editState.value;
    this.editState.next({
      editingId: id,
      editValues: { ...state.editValues, [id]: currentValue }
    });
  }

  saveDescription(id: string, newValue: string): string {
    const trimmed = newValue.trim().substring(0, 500);
    this.cancelEdit(id);
    return trimmed;
  }

  cancelEdit(id: string): void {
    const state = this.editState.value;
    const updated = { ...state.editValues };
    delete updated[id];
    this.editState.next({
      editingId: null,
      editValues: updated
    });
  }

  getEditValue(id: string): string {
    return this.editState.value.editValues[id] || '';
  }

  isEditing(id: string): boolean {
    return this.editState.value.editingId === id;
  }
}
