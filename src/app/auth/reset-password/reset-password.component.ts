import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  token: string;
  formGroup: FormGroup;
  resetSuccess: boolean;
  submitProcess: boolean;
  message: string;
  formError: string;
  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private formBuilder: FormBuilder
  ) {
    this.token = this.activatedRoute.snapshot.paramMap.get("token");
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.formGroup = this.formBuilder.group({
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    }), { validdator: this.passwordMatchValidator };
  }

  resetPassword() {
    this.formError = null;
    if(this.formGroup.invalid || this.submitProcess) {
      return;
    }
    const { newPassword, confirmPassword } = this.formGroup.value;
    if(newPassword !== confirmPassword) {
      this.formError = "Password not identical";
      return;
    }
    this.submitProcess = true;
    this.authService.resetPassword({ newPassword, token: this.token }).subscribe(
      result => {
        this.submitProcess = false;
        if(result.errors) {
        } else {
          this.message = "Password updated successfully!";
          this.resetSuccess = true;
          // this.formGroup.reset();
        }
      }, error => {
        this.submitProcess = false;
      }
    )
  }

  passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const newPassword = control.get('newPassword');
    const confirmPassword = control.get('confirmPassword');

    if (!newPassword || !confirmPassword) {
      return null; // Si l'un des champs est manquant, laissez la validation passer
    }

    if (newPassword.value !== confirmPassword.value) {
      return { 'passwordMismatch': true };
    }

    return null; // La validation passe si les mots de passe correspondent
  }
}
