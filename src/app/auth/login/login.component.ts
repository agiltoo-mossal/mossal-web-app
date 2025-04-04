import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SnackBarService } from 'src/app/shared/services/snackbar.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  hidePassword: boolean = true;
  form: FormGroup;
  missingUser = null;

  constructor(
    private authService: AuthService,
    private snackBarService: SnackBarService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {}

  login() {
    if (this.form.invalid) {
      return;
    }
    this.missingUser = null;
    this.authService.login(this.form.value).then(
      (result) => {},
      (error) => {
        this.missingUser = true;
      }
    );
  }
}
