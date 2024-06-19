import { Component, Input, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SnackBarService } from 'src/app/shared/services/snackbar.service';
import { FetchOrganizationCollaboratorGQL, InviteAdminGQL, UpdateCollaboratorGQL, User } from 'src/graphql/generated';

@Component({
  selector: 'app-form-admin',
  templateUrl: './form-admin.component.html',
  styleUrl: './form-admin.component.scss'
})
export class FormAdminComponent {
  @Input() formType: string;
  formText: string = '';
  collaboratorForm: FormGroup;
  collaborator: User;
  @Input() collaboratorId: string;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private inviteAdminGQL: InviteAdminGQL,
    private router: Router,
    private snackBarService: SnackBarService,
    private fetchOrganizationCollaboratorGQL: FetchOrganizationCollaboratorGQL,
    private updateCollaboratorGQL: UpdateCollaboratorGQL
  ) {
    this.collaboratorForm = this.fb.group({
      email: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      address: [''],
      position: ['', Validators.required],
      uniqueIdentifier: [''],
      salary: [0, Validators.required],
      wizallAccountNumber: ['', Validators.required],
      bankAccountNumber: ['', Validators.required]
    })
  }

  ngOnInit(): void {
    this.formText =
      this.formType == 'edit'
        ? "Modifier les infos de l'admin "
        : 'Création compte admin';
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.getCollab();
  }

  // Méthode pour soumettre le formulaire
  submitForm() {
    if(this.collaboratorForm.invalid || this.isLoading) {
      this.collaboratorForm.markAllAsTouched()
      return;
    }
    this.isLoading = true;
    this.inviteAdminGQL.mutate({ adminInput: this.collaboratorForm.value }).subscribe(
      result => {
        this.isLoading = false;
        if(result.data) {
          this.router.navigate(['/dashboard/admins']);
          this.snackBarService.showSuccessSnackBar("Invitation envoyé à l'admin")
        }

      },
      error => {
        this.isLoading = false;
      }
    )
  }

  edit() {
    if(this.collaboratorForm.invalid || this.isLoading) {
      this.collaboratorForm.markAllAsTouched()
      return;
    }
    this.isLoading = true;
    const value = { ...this.collaboratorForm.value, salary: Number(this.collaboratorForm.value.salary || 0) };
    delete value.email;
    this.updateCollaboratorGQL.mutate({ collaboratorInput: value, collaboratorId: this.collaboratorId }).subscribe(
      result => {
        this.isLoading = false;
        if(result.data) {
          this.router.navigate(['/dashboard/admins']);
          this.snackBarService.showSuccessSnackBar("Admin modifié avec succés")
        }

      },
      error => {
        this.isLoading = false;
      }
    )
  }

  getCollab() {
    if(this.collaboratorId) {
      this.fetchOrganizationCollaboratorGQL.fetch({ collaboratorId: this.collaboratorId }).subscribe(
        result => {
          this.collaborator = result.data.fetchOrganizationCollaborator as User;
          this.collaboratorForm.patchValue(this.collaborator);
        }
      )
    }
  }
}
