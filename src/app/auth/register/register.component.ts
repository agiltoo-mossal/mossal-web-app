import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SnackBarService } from 'src/app/shared/services/snackbar.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  form: FormGroup;
  siteKey = '6LfgTC8nAAAAAO4so5yJa_HOaKfBCa9nM9ZqyIZf';
  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });
  constructor(
    private authService: AuthService,
    private snackBarService: SnackBarService,
    private _formBuilder: FormBuilder
  ) {}

  //##################
  hidePassword: boolean = true;
  hidePasswordConfirmed: boolean = true;
  user: any = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  ngOnInit(): void {
    this.form = new FormGroup({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      phone: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
      confirmPassword: new FormControl('', Validators.required),
      recaptcha: new FormControl('', Validators.required),
    });
  }

  async register() {
    if (this.form.invalid || !this.passwordAreSame()) {
      return;
    }
    const value = this.form.value;
    delete value.confirmPassword;
    delete value.recaptcha;
    try {
      await this.authService.register(value);
    } catch (error) {
      this.snackBarService.showErrorSnackBar();
    }
  }

  get firstNameCtrl(): FormControl {
    return this.form.controls['firstName'] as FormControl;
  }

  get lastNameCtrl(): FormControl {
    return this.form.controls['lastName'] as FormControl;
  }

  get emailCtrl(): FormControl {
    return this.form.controls['email'] as FormControl;
  }

  get passwordCtrl(): FormControl {
    return this.form.controls['password'] as FormControl;
  }

  get confirmPasswordCtrl(): FormControl {
    return this.form.controls['confirmPassword'] as FormControl;
  }

  passwordAreSame() {
    return this.passwordCtrl.value === this.confirmPasswordCtrl.value;
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }
  togglePasswordConfirmedVisibility() {
    this.hidePasswordConfirmed = !this.hidePasswordConfirmed;
  }
}
