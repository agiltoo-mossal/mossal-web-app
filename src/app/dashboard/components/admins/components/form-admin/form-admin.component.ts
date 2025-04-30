import { Component, Input, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { SearchService } from 'src/app/shared/services/search/search.service';
import { SnackBarService } from 'src/app/shared/services/snackbar.service';
import {
  FetchOrganizationCollaboratorGQL,
  InviteAdminGQL,
  LockUserGQL,
  UnlockUserGQL,
  UpdateCollaboratorGQL,
  User,
} from 'src/graphql/generated';

@Component({
  selector: 'app-form-admin',
  templateUrl: './form-admin.component.html',
  styleUrl: './form-admin.component.scss',
})
export class FormAdminComponent {
  @Input() formType: string;
  formText: string = '';
  collaboratorForm: FormGroup;
  collaborator: User;
  @Input() collaboratorId: string;
  isLoading: boolean = false;

  phoneNumberExists: boolean = false;
  bankAccountNumberExists: boolean = false;
  uniqueIdentifierExists: boolean = false;
  emailExists: boolean = false;

  constructor(
    private fb: FormBuilder,
    private inviteAdminGQL: InviteAdminGQL,
    private router: Router,
    private snackBarService: SnackBarService,
    private fetchOrganizationCollaboratorGQL: FetchOrganizationCollaboratorGQL,
    private updateCollaboratorGQL: UpdateCollaboratorGQL,

    private searchService: SearchService,
    private lockUserGQL: LockUserGQL,
    private unlockUserGQL: UnlockUserGQL
  ) {
    this.collaboratorForm = this.fb.group({
      email: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNumber: [
        '',
        [
          Validators.required,

          Validators.pattern(/^\+221(78|77|76|70|75)\d{7}$/),
        ],
      ],
      address: [''],
      position: ['', Validators.required],
      uniqueIdentifier: ['', Validators.required],
      salary: [0, Validators.required],
      //wizallAccountNumber: [''],
      // bankAccountNumber: [''],
    });
  }

  ngOnInit(): void {
    this.formText =
      this.formType == 'edit'
        ? "Modifier les infos de l'admin "
        : 'Création compte admin';

    this.initSearch();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.getCollab();
  }

  // Méthode pour soumettre le formulaire
  submitForm() {
    console.log(this.collaboratorForm.invalid, this.isLoading);
    if (this.collaboratorForm.invalid || this.isLoading) {
      this.collaboratorForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    console.log(this.formType);
    if (this.formType == 'edit') {
      this.edit();
      return;
    }

    this.inviteAdminGQL
      .mutate({ adminInput: this.collaboratorForm.value })
      .subscribe(
        (result) => {
          this.isLoading = false;
          if (result.data) {
            this.router.navigate(['/dashboard/admins']);
            this.snackBarService.showSuccessSnackBar(
              "Invitation envoyé à l'admin"
            );
          }
        },
        (error) => {
          this.snackBarService.showSnackBar('une erreur est survenue');
          this.isLoading = false;
        }
      );
  }

  edit() {
    console.log(this.collaboratorForm.invalid, this.isLoading);
    console.log(this.collaboratorForm.getRawValue());

    /* if (this.collaboratorForm.invalid || this.isLoading) {
      this.collaboratorForm.markAllAsTouched();
      return;
    } */
    this.isLoading = true;
    const value = {
      ...this.collaboratorForm.value,
      salary: Number(this.collaboratorForm.value.salary || 0),
    };
    delete value.email;
    this.updateCollaboratorGQL
      .mutate({ collaboratorInput: value, collaboratorId: this.collaboratorId })
      .subscribe(
        (result) => {
          this.isLoading = false;
          if (result.data) {
            this.router.navigate(['/dashboard/admins']);
            this.snackBarService.showSuccessSnackBar(
              'Admin modifié avec succés'
            );
          }
        },
        (error) => {
          this.isLoading = false;
        }
      );
  }

  getCollab() {
    if (this.collaboratorId) {
      this.fetchOrganizationCollaboratorGQL
        .fetch(
          { collaboratorId: this.collaboratorId },
          { fetchPolicy: 'no-cache' }
        )
        .subscribe((result) => {
          this.collaborator = result.data.fetchOrganizationCollaborator as User;
          this.collaboratorForm.patchValue(this.collaborator);
        });
    }
  }

  get phoneNumber() {
    return this.collaboratorForm.controls['phoneNumber'];
  }

  checkPhone() {
    this.collaboratorForm
      .get('phoneNumber')
      .valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((value) =>
          this.searchService.phoneNumberExists(value, true, this.collaboratorId)
        )
      )
      .subscribe((result) => {
        this.collaboratorForm.controls['phoneNumber'].setErrors(null);
        this.collaboratorForm.controls['phoneNumber'].updateValueAndValidity();
        this.phoneNumberExists = result;
        if (result) {
          this.collaboratorForm.controls['phoneNumber'].setErrors({
            phoneNumberExists: true,
          });
        }
      });
  }

  checkEmail() {
    this.collaboratorForm
      .get('email')
      .valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((value) =>
          this.searchService.emailExists(value, true, this.collaboratorId)
        )
      )
      .subscribe((result) => {
        this.emailExists = result;
        this.collaboratorForm.controls['email'].setErrors(null);
        this.collaboratorForm.controls['email'].updateValueAndValidity();

        if (result) {
          this.collaboratorForm.controls['email'].setErrors({
            emailExists: true,
          });
        }
      });
  }

  // checkBankAccount() {
  //   this.collaboratorForm.get('bankAccountNumber').valueChanges.pipe(
  //     debounceTime(300),
  //     distinctUntilChanged(),
  //     switchMap(value => this.searchService.bankAccountNumberExists(value, true, this.collaboratorId))
  //   ).subscribe(result => {
  //     this.bankAccountNumberExists = result;

  //   });
  // }

  checkUniqueIdentifier() {
    this.collaboratorForm
      .get('uniqueIdentifier')
      .valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((value) =>
          this.searchService.uniqueIdentifierExists(
            value,
            true,
            this.collaboratorId
          )
        )
      )
      .subscribe((result) => {
        this.collaboratorForm.controls['uniqueIdentifier'].setErrors(null);
        this.collaboratorForm.controls[
          'uniqueIdentifier'
        ].updateValueAndValidity();
        if (result) {
          this.collaboratorForm.controls['uniqueIdentifier'].setErrors({
            uniqueIdentifierExists: true,
          });
        }
        this.uniqueIdentifierExists = result;
      });
  }

  initSearch() {
    this.checkPhone();
    // this.checkBankAccount();
    this.checkUniqueIdentifier();
    this.checkEmail();
  }

  get hasErrors() {
    return (
      this.bankAccountNumberExists ||
      this.phoneNumberExists ||
      this.uniqueIdentifierExists ||
      this.emailExists
    );
  }

  lockUser = (userId: string) => {
    this.lockUserGQL.mutate({ userId }).subscribe((result) => {
      if (result.data.lockUser) {
        this.snackBarService.showSuccessSnackBar(
          'Utilisateur bloqué avec succès!'
        );
        this.getCollab();
      } else {
        this.snackBarService.showErrorSnackBar();
      }
    });
  };

  unlockUser = (userId: string) => {
    this.unlockUserGQL.mutate({ userId }).subscribe((result) => {
      if (result.data.unlockUser) {
        this.snackBarService.showSuccessSnackBar(
          'Utilisateur débloqué avec succès!'
        );
        this.getCollab();
      } else {
        this.snackBarService.showErrorSnackBar();
      }
    });
  };
}
