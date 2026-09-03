import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface ResetApprovalFlowDialogData {
  hasPendingOrders: boolean;
}

@Component({
  selector: 'app-reset-approval-flow-dialog',
  templateUrl: './reset-approval-flow-dialog.component.html',
  styleUrls: ['./reset-approval-flow-dialog.component.scss'],
})
export class ResetApprovalFlowDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ResetApprovalFlowDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ResetApprovalFlowDialogData,
  ) {}

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}