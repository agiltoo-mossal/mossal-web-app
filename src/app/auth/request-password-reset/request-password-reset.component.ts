import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SnackBarService } from 'src/app/shared/services/snackbar.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-request-password-reset',
  templateUrl: './request-password-reset.component.html',
  styleUrls: ['./request-password-reset.component.scss'],
})
export class RequestPasswordResetComponent implements OnInit {
  formGroup: FormGroup;
  message: string;
  isSubmitProcess: boolean;
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private snackBarService: SnackBarService
  ) {}

  ngOnInit(): void {
    // this.initForm();
  }

  // initForm() {
  //   this.formGroup = this.formBuilder.group({
  //     email: [this.data && this.data.email ? this.data.email : '', Validators.required]
  //   });
  //   if(this.data && this.data.disabled) {
  //     this.formGroup.controls['email'].disable();
  //   }
  // }

  // cancel() {
  //   this.dialogRef.close();
  // }

  // requestPasswordReset() {
  //   this.message = null;
  //   if(this.formGroup.invalid || this.isSubmitProcess) {
  //     return;
  //   }
  //   this.isSubmitProcess = true;
  //   if(this.data && this.data.disabled && this.formGroup.value.email !== this.data.email) {
  //     this.message = "Data corrupted";
  //     return;
  //   }
  //   this.authService.requestPasswordReset(this.formGroup.value.email).subscribe(
  //     result => {
  //       this.isSubmitProcess = false;
  //       if(result.errors) {
  //         this.snackBarService.showErrorSnackBar();
  //       } else {
  //         this.message = "An e-mail has been sent to "+this.formGroup.value.email;
  //         // this.formGroup.reset();
  //       }
  //     }, error => {
  //       this.isSubmitProcess = false;
  //       this.snackBarService.showErrorSnackBar();
  //     }
  //   )
  // }
}
