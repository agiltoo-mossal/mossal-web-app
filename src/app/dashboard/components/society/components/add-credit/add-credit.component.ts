import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackBarService } from 'src/app/shared/services/snackbar.service';
import { AddCreditGQL, FetchOrganizationGQL, Organization } from 'src/graphql/generated';

@Component({
  selector: 'app-add-credit',
  templateUrl: './add-credit.component.html',
  styleUrl: './add-credit.component.scss'
})
export class AddCreditComponent {
  societyId: string;
  formText: string = "Ajout d'une opération de crédit";
  creditForm: FormGroup;
  isLoading: boolean = false;
  society: string = '';

  constructor(private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private snackBarService: SnackBarService,
    private addCreditGQL: AddCreditGQL,
    private fetchOrganizationGQL: FetchOrganizationGQL,

  ) {
    this.route.paramMap.subscribe((params) => {
      this.societyId = params.get('id');
      console.log('societyId ID:', this.societyId);
    });

    this.getOrganization();

    this.creditForm = this.fb.group({
      amount: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[1-9]\d*(\.\d+)?$/)
        ]
      ],
      operation: ['', Validators.required],
    });
  }

  submitForm(): void {
    console.log('Form invalid:', this.creditForm.invalid, 'Loading:', this.isLoading);

    if (this.creditForm.invalid || this.isLoading) {
      this.creditForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    this.addCredit();
  }

  getOrganization(): void {
    this.fetchOrganizationGQL
      .fetch(
        { organizationId: this.societyId },
        { fetchPolicy: 'no-cache' }
      )
      .subscribe({
        next: (result) => {
          const organization = result.data.fetchOrganization as Organization;
          this.society = organization.name;
          console.log('Organisation récupérée:', this.society);
        },
        error: (error) => {
          console.error('Erreur:', error);
          this.snackBarService.showErrorSnackBar(5000, 'Erreur lors du chargement');
        }
      });
  }

  private addCredit(): void {
    this.addCreditGQL
      .mutate({ creditInput: this.creditForm.value, organizationId: this.societyId })
      .subscribe({
        next: (result) => {
          this.isLoading = false;
          if (result.data) {
            this.router.navigate(['/dashboard/society']);
            this.snackBarService.showSuccessSnackBar(
              "Opération ajoutée avec succès."
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

}
