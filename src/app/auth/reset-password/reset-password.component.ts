import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {
  hidePassword: boolean = true;
  form: FormGroup;
  help: string = "Mot de passe doit contenir: 8 caracteres, 1 chiffre, 1 Majuscule, 1 Minuscule";

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.form = this.fb.group({
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/)
      ]],
      confirm: ['']
    })
  }

  get notSame() {
    return (this.form.value.password !== this.form.value.confirm) && this.password.touched && this.confirm.touched;
  }

  get password() {
    return this.form.controls['password'];
  }

  get confirm() {
    return this.form.controls['confirm'];
  }

  get formValid(): boolean {
    return this.form.valid && this.form.value.password === this.form.value.confirm;
  }

  reset() {
    if(!this.formValid) {
      return;
    }
    this.authService.resetPassword(this.form.value.password);
  }
}
