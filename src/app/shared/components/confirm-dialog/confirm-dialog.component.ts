import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit {
  reason: string;
  reasonRequired: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.reasonRequired = data.reasonRequired;
  }

  ngOnInit() {}

  onConfirm() {
    this.dialogRef.close(this.reasonRequired ? this.reason : true);
  }

  onCancel() {
    this.dialogRef.close(false);
  }
}
