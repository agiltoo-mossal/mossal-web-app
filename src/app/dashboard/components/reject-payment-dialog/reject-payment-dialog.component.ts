import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-reject-payment-dialog',
  templateUrl: './reject-payment-dialog.component.html',
  styleUrls: ['./reject-payment-dialog.component.scss']
})
export class RejectPaymentDialogComponent {

  motifRejet = '';

  constructor(private dialogRef: MatDialogRef<RejectPaymentDialogComponent>) {}

  get motifValide(): boolean {
    return this.motifRejet.trim().length > 0;
  }

  annuler(): void {
    this.dialogRef.close();
  }

  confirmer(): void {
    if (!this.motifValide) {
      return;
    }
    this.dialogRef.close(this.motifRejet.trim());
  }
}