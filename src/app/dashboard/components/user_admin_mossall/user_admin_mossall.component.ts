import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';
import { SnackBarService } from 'src/app/shared/services/snackbar.service';
import {
  DisableEmailNotificationGQL,
  EnableEmailNotificationGQL,
  FetchCurrentAdminGQL,
  UpdateMyAdminPasswordGQL,
  UpdateMyAdminProfileGQL,
  User,
} from 'src/graphql/generated';

@Component({
  selector: 'app-user-admin-mossall',
  templateUrl: './user_admin_mossall.component.html',
  styleUrls: ['./user_admin_mossall.component.scss'],
})
export class UserAdminMossallComponent {
  password: boolean = true;
  newPassword: boolean = true;
  ConfirmPassword: boolean = true;
  toggleMailActivation: boolean = false;
  updateProfileForm: FormGroup;
  updatePasswordForm: FormGroup;
  passwordNotEqual = false;
  isLoading = false;
  user: User;

  constructor(
    private updateMyAdminPasswordGQL: UpdateMyAdminPasswordGQL,
    private fb: FormBuilder,
    private snackBarService: SnackBarService,
    private fetchCurrentAdminGQL: FetchCurrentAdminGQL,
    private updateMyAdminProfileGQL: UpdateMyAdminProfileGQL,
    private enableEmailNotificationGQL: EnableEmailNotificationGQL,
    private disableEmailNotificationGQL: DisableEmailNotificationGQL,
    private authService: AuthService
  ) {
    this.updatePasswordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(
            /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/
          ),
        ],
      ],
      confirmPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(
            /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/
          ),
        ],
      ],
    });

    this.updateProfileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      phoneNumber: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\+221(78|77|76|70|75)\d{7}$/),
        ],
      ],
      address: [''],
    });

    this.getCurrentUser();
  }

  get phoneNumber() {
    return this.updateProfileForm.controls['phoneNumber'];
  }

  updatePassword() {
    if (this.updatePasswordForm.invalid || this.isLoading) {
      this.updatePasswordForm.markAllAsTouched();
      return;
    }
    const value = this.updatePasswordForm.value;
    if (value.newPassword !== value.confirmPassword) {
      this.passwordNotEqual = true;
      // this.updatePasswordForm.controls['confirmPassword'].reset();
      return;
    }
    this.isLoading = true;
    this.updateMyAdminPasswordGQL
      .mutate({
        oldPassword: value.oldPassword,
        newPassword: value.newPassword,
      })
      .subscribe(
        (result) => {
          this.isLoading = false;
          if (result.data.updateMyAdminPassword) {
            this.snackBarService.showSuccessSnackBar(
              'Mot de passe modifié avec succès'
            );
            this.authService.logout();
          } else {
            this.snackBarService.showErrorSnackBar(
              5000,
              'Mot de passe incorrect'
            );
          }
        },
        (error) => {
          this.isLoading = false;
          this.snackBarService.showErrorSnackBar(
            5000,
            'Mot de passe incorrect'
          );
        }
      );
  }

  getCurrentUser(useCache = true) {
    let cache = 'cache-first';
    if (!useCache) {
      cache = 'no-cache';
    }
    this.fetchCurrentAdminGQL
      .fetch({}, { fetchPolicy: 'no-cache' })
      .subscribe((result) => {
        if (result.data) {
          this.user = result.data.fetchCurrentAdmin as User;
          this.updateProfileForm.patchValue(result?.data?.fetchCurrentAdmin);
          this.updateProfileForm.controls['email'].disable();
          this.toggleMailActivation =
            result?.data?.fetchCurrentAdmin?.enableEmailNotification;
        }
      });
  }

  updateProfile() {
    if (this.updateProfileForm.invalid) {
      this.updateProfileForm.markAllAsTouched();
      return;
    }
    const value = this.updateProfileForm.value;
    delete value.email;
    this.updateMyAdminProfileGQL.mutate({ userInput: value }).subscribe(
      (result) => {
        if (result.data.updateMyAdminProfile) {
          this.snackBarService.showSuccessSnackBar(
            'Profile modifié avec succès'
          );
        } else {
          this.snackBarService.showErrorSnackBar(
            5000,
            'Une erreur est survenue'
          );
        }
      },
      (error) => {
        this.snackBarService.showErrorSnackBar(5000, 'Une erreur est survenue');
      }
    );
  }

  setToggleMailActivation() {
    this.toggleMailActivation = !this.toggleMailActivation;
    if (this.toggleMailActivation) {
      this.enableEmailNotificationGQL
        .mutate({ userId: this.user.id })
        .subscribe(
          (result) => {
            if (result.data.enableEmailNotification) {
              this.snackBarService.showSuccessSnackBar(
                'Notifications par email activées avec succés!'
              );
            } else {
              this.snackBarService.showErrorSnackBar();
            }
          },
          (error) => {
            this.snackBarService.showErrorSnackBar();
          }
        );
    } else {
      this.disableEmailNotificationGQL
        .mutate({ userId: this.user.id })
        .subscribe(
          (result) => {
            if (result.data.disableEmailNotification) {
              this.snackBarService.showSuccessSnackBar(
                'Notifications par email désactivées avec succés!'
              );
            } else {
              this.snackBarService.showErrorSnackBar();
            }
          },
          (error) => {
            this.snackBarService.showErrorSnackBar();
          }
        );
    }
  }
}
