import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface ApproveConfirmationDialogData {
  libelle: string;
  montantTotal: number;
  nombreBeneficiaires: number;
}

@Component({
  selector: 'app-approve-confirmation-dialog',
  templateUrl: './approve-confirmation-dialog.component.html',
  styleUrls: ['./approve-confirmation-dialog.component.scss']
})
export class ApproveConfirmationDialogComponent {

  constructor(
    private dialogRef: MatDialogRef<ApproveConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ApproveConfirmationDialogData,
  ) {}

  formatMontant(montant: number): string {
    return montant.toLocaleString('fr-FR') + ' XOF';
  }

  annuler(): void {
    this.dialogRef.close(false);
  }

  confirmer(): void {
    this.dialogRef.close(true);
  }
}