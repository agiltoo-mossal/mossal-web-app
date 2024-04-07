import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SnackBarService } from 'src/app/shared/services/snackbar.service';
import { FetchOrganizationCollaboratorGQL, InviteCollaboratorGQL, UpdateCollaboratorGQL, User } from 'src/graphql/generated';

@Component({
  selector: 'app-form-collaborator',
  templateUrl: './form-collaborator.component.html',
  styleUrls: ['./form-collaborator.component.scss'],
})
export class FormCollaboratorComponent implements OnInit, OnChanges {
  @Input() formType: string;
  formText: string = '';
  collaboratorForm: FormGroup;
  collaborator: User;
  @Input() collaboratorId: string;

  constructor(
    private fb: FormBuilder,
    private inviteCollaboratorGQL: InviteCollaboratorGQL,
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
        ? 'Modifier les infos du collaborateur '
        : 'Création compte collaborateur';
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.getCollab();
  }

  // Méthode pour soumettre le formulaire
  submitForm() {
    if(this.collaboratorForm.invalid) {
      this.collaboratorForm.markAllAsTouched()
      return;
    }
    this.inviteCollaboratorGQL.mutate({ collaboratorInput: this.collaboratorForm.value }).subscribe(
      result => {
        if(result.data) {
          this.router.navigate(['/dashboard/collaborators']);
          this.snackBarService.showSuccessSnackBar("Invitation envoyé au collaborateur")
        }

      }
    )
  }

  edit() {
    if(this.collaboratorForm.invalid) {
      this.collaboratorForm.markAllAsTouched()
      return;
    }
    const value = { ...this.collaboratorForm.value, salary: Number(this.collaboratorForm.value.salary || 0) };
    delete value.email;
    this.updateCollaboratorGQL.mutate({ collaboratorInput: value, collaboratorId: this.collaboratorId }).subscribe(
      result => {
        if(result.data) {
          this.router.navigate(['/dashboard/collaborators']);
          this.snackBarService.showSuccessSnackBar("Collaborator modifié avec succés")
        }

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
