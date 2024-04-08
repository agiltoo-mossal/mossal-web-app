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
  isLoading: boolean = false;

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
    if(this.collaboratorForm.invalid || this.isLoading) {
      this.collaboratorForm.markAllAsTouched()
      return;
    }
    this.isLoading = true;
    this.inviteCollaboratorGQL.mutate({ collaboratorInput: this.collaboratorForm.value }).subscribe(
      result => {
        this.isLoading = false;
        if(result.data) {
          this.router.navigate(['/dashboard/collaborators']);
          this.snackBarService.showSuccessSnackBar("Invitation envoyé au collaborateur")
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
          this.router.navigate(['/dashboard/collaborators']);
          this.snackBarService.showSuccessSnackBar("Collaborator modifié avec succés")
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
