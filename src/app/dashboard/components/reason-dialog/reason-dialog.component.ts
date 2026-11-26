import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface ReasonDialogData {
  title: string;
  icon: string;
  message: string;
  reasonLabel: string;
  requiredMessage: string;
  warning?: string;
  confirmLabel: string;
  variant?: 'default' | 'danger';
}

@Component({
  selector: 'app-reason-dialog',
  templateUrl: './reason-dialog.component.html',
  styleUrls: ['./reason-dialog.component.scss'],
})
export class ReasonDialogComponent {
  reason = '';
  showError = false;

  constructor(
    private dialogRef: MatDialogRef<ReasonDialogComponent, string>,
    @Inject(MAT_DIALOG_DATA) public data: ReasonDialogData,
  ) {}

  cancel(): void {
    this.dialogRef.close();
  }

  confirm(): void {
    const reason = this.reason.trim();
    if (!reason) {
      this.showError = true;
      return;
    }
    this.dialogRef.close(reason);
  }

  onReasonChange(): void {
    if (this.reason.trim()) this.showError = false;
  }
}
