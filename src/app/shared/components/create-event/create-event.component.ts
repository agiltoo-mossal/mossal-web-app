import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrl: './create-event.component.scss',
})
export class CreateEventComponent implements OnInit {
  eventForm: FormGroup;
  title: string;
  action: string = 'Créer';

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CreateEventComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.eventForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      id: [null],
    });
  }
  ngOnInit(): void {
    this.title = 'Créer un  nouvel événement';
    if (this.data) {
      this.eventForm.patchValue(this.data);
      this.title = 'Modifier un événement';
      this.action = 'Modifier';
    }
  }
  get startDate() {
    return this.eventForm.get('startDate');
  }
  get endDate() {
    return this.eventForm.get('endDate');
  }
  onSubmit(): void {
    if (
      new Date(this.startDate?.getRawValue()).getTime() >
      new Date(this.endDate?.getRawValue()).getTime()
    ) {
      this.startDate?.setErrors({ invalidDate: true });
      this.endDate?.setErrors({ invalidDate: true });
      return;
    }
    if (this.eventForm.valid) {
      this.dialogRef.close(this.eventForm.getRawValue());
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
