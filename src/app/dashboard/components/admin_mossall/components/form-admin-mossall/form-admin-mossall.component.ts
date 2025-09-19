import { Component, Input, SimpleChanges, OnInit, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { SearchService } from 'src/app/shared/services/search/search.service';
import { SnackBarService } from 'src/app/shared/services/snackbar.service';
import {
  FetchMossallAdminGQL,
  InviteAdminGQL,
  LockUserGQL,
  UnlockUserGQL,
  UpdateCollaboratorGQL,
  User,
} from 'src/graphql/generated';

@Component({
  selector: 'app-form-admin-mossall',
  templateUrl: './form-admin-mossall.component.html',
  styleUrl: './form-admin-mossall.component.scss',
})
export class FormAdminMossallComponent implements OnInit, OnChanges {
  @Input() formType: string = '';
  formText: string = '';
  collaboratorForm: FormGroup;
  collaborator: User;
  @Input() collaboratorId: string = '';
  isLoading: boolean = false;

  phoneNumberExists: boolean = false;
  uniqueIdentifierExists: boolean = false;
  emailExists: boolean = false;

  constructor(
    private fb: FormBuilder,
    private inviteAdminGQL: InviteAdminGQL,
    private router: Router,
    private snackBarService: SnackBarService,
    private updateCollaboratorGQL: UpdateCollaboratorGQL,
    private searchService: SearchService,
    private lockUserGQL: LockUserGQL,
    private unlockUserGQL: UnlockUserGQL,
    private fetchMossallAdmin: FetchMossallAdminGQL
  ) {
    this.collaboratorForm = this.fb.group({
      uniqueIdentifier: ['', Validators.required], // Matricule
      firstName: ['', Validators.required], // Prénom
      lastName: ['', Validators.required], // Nom
      email: ['', [Validators.required, Validators.email]], // Email avec validation email
      phoneNumber: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\+221(78|77|76|70|75)\d{7}$/), // Pattern pour numéros sénégalais
        ],
      ],
      address: [''], // Adresse (optionnelle)
      position: ['', Validators.required], // Fonction
    });
  }

  ngOnInit(): void {
    this.formText =
      this.formType === 'edit'
        ? "Modifier les infos de l'administrateur"
        : 'Création compte administrateur';

    this.initSearch();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.getAdmin();
    if (this.formType == 'edit') {
      this.collaboratorForm.controls['email'].disable();
    }
  }

  /**
   * Méthode pour soumettre le formulaire
   */
  submitForm(): void {
    console.log('Form invalid:', this.collaboratorForm.invalid, 'Loading:', this.isLoading);

    if (this.collaboratorForm.invalid || this.isLoading || this.hasErrors) {
      this.collaboratorForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    if (this.formType === 'edit') {
      this.editAdmin();
    } else {
      this.createAdmin();
    }
  }

  private createAdmin(): void {
    this.inviteAdminGQL
      .mutate({ adminInput: this.collaboratorForm.value })
      .subscribe({
        next: (result) => {
          this.isLoading = false;
          if (result.data) {
            this.router.navigate(['/dashboard/admin_mossall']);
            this.snackBarService.showSuccessSnackBar(
              "Invitation envoyée à l'admin mossall"
            );
          }
        },
        error: (error) => {
          console.error('Erreur lors de la création:', error);
          this.snackBarService.showSnackBar('Une erreur est survenue lors de la création');
          this.isLoading = false;
        }
      });
  }


  private editAdmin(): void {
    const formValue = { ...this.collaboratorForm.value };

    delete formValue.email;

    this.updateCollaboratorGQL
      .mutate({
        collaboratorInput: formValue,
        collaboratorId: this.collaboratorId
      })
      .subscribe({
        next: (result) => {
          this.isLoading = false;
          if (result.data) {
            this.router.navigate(['/dashboard/admin_mossall']);
            this.snackBarService.showSuccessSnackBar(
              'Admin mossall modifié avec succès'
            );
          }
        },
        error: (error) => {
          console.error('Erreur lors de la modification:', error);
          this.snackBarService.showSnackBar('Une erreur est survenue lors de la modification');
          this.isLoading = false;
        }
      });
  }


  private getAdmin(): void {
    if (this.collaboratorId) {
      this.fetchMossallAdmin
        .fetch(
          { adminId: this.collaboratorId },
          { fetchPolicy: 'no-cache' }
        )
        .subscribe({
          next: (result) => {
            this.collaborator = result.data.fetchMossallAdmin as User;
            this.collaboratorForm.patchValue(this.collaborator);
          },
          error: (error) => {
            console.error('Erreur lors du chargement du collaborateur:', error);
            this.snackBarService.showSnackBar('Erreur lors du chargement des données');
          }
        });
    }
  }


  get phoneNumber() {
    return this.collaboratorForm.controls['phoneNumber'];
  }


  private checkPhone(): void {
    this.collaboratorForm
      .get('phoneNumber')?.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((value) =>
          this.searchService.phoneNumberExists(value, true, this.collaboratorId)
        )
      )
      .subscribe((result) => {
        const phoneControl = this.collaboratorForm.controls['phoneNumber'];

        const currentErrors = phoneControl.errors || {};
        delete currentErrors['phoneNumberExists'];

        this.phoneNumberExists = result;

        if (result) {
          phoneControl.setErrors({ ...currentErrors, phoneNumberExists: true });
        } else if (Object.keys(currentErrors).length === 0) {
          phoneControl.setErrors(null);
        } else {
          phoneControl.setErrors(currentErrors);
        }
      });
  }

  private checkEmail(): void {
    this.collaboratorForm
      .get('email')?.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((value) =>
          this.searchService.emailExists(value, true, this.collaboratorId)
        )
      )
      .subscribe((result) => {
        const emailControl = this.collaboratorForm.controls['email'];

        // Réinitialiser les erreurs
        const currentErrors = emailControl.errors || {};
        delete currentErrors['emailExists'];

        this.emailExists = result;

        if (result) {
          emailControl.setErrors({ ...currentErrors, emailExists: true });
        } else if (Object.keys(currentErrors).length === 0) {
          emailControl.setErrors(null);
        } else {
          emailControl.setErrors(currentErrors);
        }
      });
  }


  private checkUniqueIdentifier(): void {
    this.collaboratorForm
      .get('uniqueIdentifier')?.valueChanges
      .pipe(
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
        const uniqueIdControl = this.collaboratorForm.controls['uniqueIdentifier'];

        const currentErrors = uniqueIdControl.errors || {};
        delete currentErrors['uniqueIdentifierExists'];

        this.uniqueIdentifierExists = result;

        if (result) {
          uniqueIdControl.setErrors({ ...currentErrors, uniqueIdentifierExists: true });
        } else if (Object.keys(currentErrors).length === 0) {
          uniqueIdControl.setErrors(null);
        } else {
          uniqueIdControl.setErrors(currentErrors);
        }
      });
  }

  private initSearch(): void {
    this.checkPhone();
    this.checkUniqueIdentifier();
    this.checkEmail();
  }

  get hasErrors(): boolean {
    return (
      this.phoneNumberExists ||
      this.uniqueIdentifierExists ||
      this.emailExists
    );
  }

  lockUser = (userId: string): void => {
    this.lockUserGQL.mutate({ userId }).subscribe({
      next: (result) => {
        if (result.data?.lockUser) {
          this.snackBarService.showSuccessSnackBar(
            'Utilisateur bloqué avec succès!'
          );
          this.getAdmin();
        } else {
          this.snackBarService.showErrorSnackBar();
        }
      },
      error: (error) => {
        console.error('Erreur lors du blocage:', error);
        this.snackBarService.showErrorSnackBar();
      }
    });
  };


  unlockUser = (userId: string): void => {
    this.unlockUserGQL.mutate({ userId }).subscribe({
      next: (result) => {
        if (result.data?.unlockUser) {
          this.snackBarService.showSuccessSnackBar(
            'Utilisateur débloqué avec succès!'
          );
          this.getAdmin();
        } else {
          this.snackBarService.showErrorSnackBar();
        }
      },
      error: (error) => {
        console.error('Erreur lors du déblocage:', error);
        this.snackBarService.showErrorSnackBar();
      }
    });
  };
}