import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SnackBarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss'],
})
export class ConfirmDialogComponent implements OnInit {
  reason: string;
  reasonRequired: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    private snackBarService: SnackBarService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.reasonRequired = data.reasonRequired;
  }

  ngOnInit() {}

  onConfirm() {
    if (this.reasonRequired && !this.reason) {
      this.snackBarService.showSnackBar('Veuiilez saisir une raison');
      return;
    }
    this.dialogRef.close(this.reasonRequired ? this.reason : true);
  }

  onCancel() {
    this.dialogRef.close(false);
  }
}
