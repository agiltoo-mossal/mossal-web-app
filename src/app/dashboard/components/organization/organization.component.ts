import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SnackBarService } from 'src/app/shared/services/snackbar.service';
import { FetchCurrentAdminGQL, Organization, UpdateOrganizationGQL } from 'src/graphql/generated';

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.scss'],
})
export class OrganizationComponent {
  password: boolean = true;
  newPassword: boolean = true;
  ConfirmPassword: boolean = true;
  toggleMailActivation: boolean = false;
  form: FormGroup;
  updatePasswordForm: FormGroup;
  passwordNotEqual = false;
  isLoading = false;
  organization: Organization;

  constructor(
    private fb: FormBuilder,
    private snackBarService: SnackBarService,
    private fetchCurrentAdminGQL: FetchCurrentAdminGQL,
    private updateOrganizationGQL: UpdateOrganizationGQL
  ) {

    this.form = this.fb.group({
      name: ['', Validators.required],
      maxDemandeAmount: [1000000, [Validators.required, Validators.min(5000)]],
      amountPercent: [75, [Validators.required, Validators.min(1), Validators.max(100)]],
      fees: [0],
    });

    this.getCurrentorganization();
  }

  getCurrentorganization(useCache=true) {
    this.fetchCurrentAdminGQL.fetch({}, { fetchPolicy: 'no-cache' }).subscribe(
      result => {
        if(result.data) {
          this.organization = result.data.fetchCurrentAdmin.organization as Organization;
          this.form.patchValue(this.organization);
        }
      }
    );
  }

  updateOrganization() {
    if(this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.value;
    this.updateOrganizationGQL.mutate({ organizationId: this.organization.id, organizationInput: value }).subscribe(
      result => {
        if(result.data.updateOrganization) {
          this.snackBarService.showSuccessSnackBar("Organization modifié avec succès");
        } else {
          this.snackBarService.showErrorSnackBar()
        }
      },
      error => {
        this.snackBarService.showErrorSnackBar()
      }
    )
  }

}
