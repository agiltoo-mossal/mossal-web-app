import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-link',
  templateUrl: './link.component.html',
  styleUrls: ['./link.component.scss']
})
export class LinkComponent {
  form: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<LinkComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.form = new FormGroup({
      name: new FormControl(""),
      url: new FormControl("")
    })
  }

  cancel(): void {
    this.dialogRef.close();
  }

  addLink() {
    this.dialogRef.close(this.form.value);
  }
}
