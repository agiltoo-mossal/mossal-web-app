import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-request-reset-password',
  templateUrl: './request-reset-password.component.html',
  styleUrl: './request-reset-password.component.scss',
})
export class RequestResetPasswordComponent {
  form: FormGroup;
  help: string = 'Veuillez saisir un email valide';

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  get email() {
    return this.form.controls['email'];
  }
  reset() {
    console.log(this.form);
    if (!this.form.valid) {
      return;
    }
    this.authService.requestResetPassword(this.form.value.email);
  }
}
