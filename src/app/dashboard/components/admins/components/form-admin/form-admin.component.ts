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
  initialRoles: string[] = [];
  @Input() collaboratorId: string;
  isLoading: boolean = false;

  phoneNumberExists: boolean = false;
  bankAccountNumberExists: boolean = false;
  uniqueIdentifierExists: boolean = false;
  emailExists: boolean = false;

  isRoleDropdownOpen: boolean = false;
  selectedRoles: string[] = [];
  availableRoles = [
    { value: 'ADMIN', label: 'Administrateur' },
    { value: 'PAYMENT_MANAGER', label: 'Gestionnaire des paiements' },
    { value: 'APPROVER', label: 'Approbateur' },
  ];

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

          Validators.pattern(/^(78|77|76|70|75)\d{7}$/),
        ],
      ],
      address: [''],
      position: ['', Validators.required],
      uniqueIdentifier: ['', Validators.required],
      salary: [0, Validators.required],
      //wizallAccountNumber: [''],
      // bankAccountNumber: [''],
      roles: [[], Validators.required],

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
            this.snackBarService.showSuccessSnackBar(3000,
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

  // edit() {
  //   console.log(this.collaboratorForm.invalid, this.isLoading);
  //   console.log(this.collaboratorForm.getRawValue());

  //   /* if (this.collaboratorForm.invalid || this.isLoading) {
  //     this.collaboratorForm.markAllAsTouched();
  //     return;
  //   } */
  //   this.isLoading = true;
  //   const value = {
  //     ...this.collaboratorForm.value,
  //     salary: Number(this.collaboratorForm.value.salary || 0),
  //   };
  //   delete value.email;
  //   this.updateCollaboratorGQL
  //     .mutate({ collaboratorInput: value, collaboratorId: this.collaboratorId })
  //     .subscribe(
  //       (result) => {
  //         this.isLoading = false;
  //         if (result.data) {
  //           this.router.navigate(['/dashboard/admins']);
  //           this.snackBarService.showSuccessSnackBar(3000,
  //             'Admin modifié avec succés'
  //           );
  //         }
  //       },
  //       (error) => {
  //         this.isLoading = false;
  //       }
  //     );
  // }

  edit() {
  this.isLoading = true;

  const rolesChanged = this.haveRolesChanged();

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
          const message = rolesChanged
            ? "Les rôles de l'utilisateur ont été mis à jour avec succès"
            : 'Admin modifié avec succès';
          this.snackBarService.showSuccessSnackBar(3000, message);
        }
      },
      (error) => {
        this.isLoading = false;
      }
    );
}

private haveRolesChanged(): boolean {
  if (this.initialRoles.length !== this.selectedRoles.length) return true;
  const sortedInitial = [...this.initialRoles].sort();
  const sortedSelected = [...this.selectedRoles].sort();
  return !sortedInitial.every((role, i) => role === sortedSelected[i]);
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
          this.selectedRoles = [...(this.collaborator.roles ?? [])];
          this.collaboratorForm.get('roles').setValue(this.selectedRoles);
          this.initialRoles = [...this.selectedRoles]; // ← ajout

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
        this.snackBarService.showSuccessSnackBar(3000,
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
        this.snackBarService.showSuccessSnackBar(3000,
          'Utilisateur débloqué avec succès!'
        );
        this.getCollab();
      } else {
        this.snackBarService.showErrorSnackBar();
      }
    });
  };

  toggleRoleDropdown() {
      this.isRoleDropdownOpen = !this.isRoleDropdownOpen;
  }

  // toggleRole(value: string) {
  //   const index = this.selectedRoles.indexOf(value);
  //   if (index > -1) {
  //     this.selectedRoles.splice(index, 1);
  //   } else {
  //     this.selectedRoles.push(value);
  //   }
  //   this.collaboratorForm.get('roles').setValue(this.selectedRoles);
  // }

  toggleRole(value: string) {
  const isRemoving = this.selectedRoles.includes(value);

  // Empêcher de retirer le dernier rôle restant
  if (isRemoving && this.selectedRoles.length === 1) {
    this.snackBarService.showErrorSnackBar(3000, 'Veuillez sélectionner au moins un rôle');
    return;
  }

  // Avertissement si on retire "Approbateur" alors qu'il est actif dans un flux
 if (isRemoving && value === 'APPROVER' && this.isApproverInActiveFlow()) {
  const flowInfo = (this.collaborator as any)?.approvalFlowLevel;
  const levelText = flowInfo ? ` (Niveau ${flowInfo})` : '';
  const confirmed = window.confirm(
    `Cet utilisateur est affecté au flux d'approbation${levelText}.\n` +
    `Retirer ce rôle le retirera également du flux. Confirmer ?`
  );

    if (!confirmed) {
      return; // on annule, la case reste cochée
    }
  }

  const index = this.selectedRoles.indexOf(value);
  if (index > -1) {
    this.selectedRoles.splice(index, 1);
  } else {
    this.selectedRoles.push(value);
  }
  this.collaboratorForm.get('roles').setValue(this.selectedRoles);
}

private isApproverInActiveFlow(): boolean {
  // ⚠️ À adapter selon le champ réellement exposé par le backend/GraphQL
  // (ex: this.collaborator?.isAssignedToApprovalFlow)
  return !!(this.collaborator as any)?.isAssignedToApprovalFlow;
}

  isRoleSelected(value: string): boolean {
    return this.selectedRoles.includes(value);
  }

  getSelectedRolesLabel(): string {
    return this.selectedRoles
      .map(v => this.availableRoles.find(r => r.value === v)?.label)
      .join(', ');
  }
}
