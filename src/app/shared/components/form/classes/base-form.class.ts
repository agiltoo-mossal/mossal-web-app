import { FormGroup } from '@angular/forms';

export abstract class BaseForm {
  abstract formGroup: FormGroup;
  abstract submitProcess: boolean;
  abstract currentValue: any;

  constructor() {
  }

  markAllAsTouched(): void {
    Object.values(this.formGroup.controls).forEach(control => {
      control.markAllAsTouched();
    });
  }

  submit(): void {
    // console.log({valll: this.formGroup.value, valid: this.formGroup.valid})
    this.markAllAsTouched();
    if (this.formGroup.valid && !this.submitProcess) {
      if(this.currentValue) {
        this.update();
      } else {
        this.submitForm();
      }
    }
  }

  init() {
    this.initForm();
    this.formGroup.patchValue(this.currentValue);
  }

  abstract submitForm(): void;
  abstract update(): void;
  abstract initForm(): void;
}
