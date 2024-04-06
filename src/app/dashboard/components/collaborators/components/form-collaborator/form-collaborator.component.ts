import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SnackBarService } from 'src/app/shared/services/snackbar.service';
import { InviteCollaboratorGQL } from 'src/graphql/generated';

@Component({
  selector: 'app-form-collaborator',
  templateUrl: './form-collaborator.component.html',
  styleUrls: ['./form-collaborator.component.scss'],
})
export class FormCollaboratorComponent implements OnInit {
  @Input() formType: string;
  formText: string = '';
  collaboratorForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private inviteCollaboratorGQL: InviteCollaboratorGQL,
    private router: Router,
    private snackBarService: SnackBarService
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

  // Méthode pour soumettre le formulaire
  submitForm() {
    console.log(this.collaboratorForm.value);
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

}
