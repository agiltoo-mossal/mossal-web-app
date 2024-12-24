import { Component, Input } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { SnackBarService } from 'src/app/shared/services/snackbar.service';
import {
  AmountUnit,
  CategorySociopro,
  CreateOrganistionServiceGQL,
  FetchCategorySocioprosGQL,
  FetchCurrentAdminGQL,
  Organization,
  Service,
} from 'src/graphql/generated';

@Component({
  selector: 'app-organization-setting-salary-refund',
  templateUrl: './organization-setting-salary-refund.component.html',
  styleUrl: './organization-setting-salary-refund.component.scss',
})
export class OrganizationSettingSalaryRefundComponent {
  isServiceActive: boolean = true;
  isPercentage: boolean = true;
  reimbursementPercentage: number = 30;
  reimbursementDuration: string = '12 mois';
  isAutoValidation: boolean = false;
  categories: Partial<CategorySociopro & { error: boolean }>[] = [];

  newCategory: string = '';
  isActive: boolean = true;
  amountType: string = '';
  reimbursement: number = 0;
  organization: Organization;
  autoValidate: boolean = false;
  startDate: Date;
  endDate: Date;
  activated: boolean = true;
  @Input() service: Partial<Service>;
  constructor(
    private listCategorieGQL: FetchCategorySocioprosGQL,
    private defineService: CreateOrganistionServiceGQL,
    private snackBarService: SnackBarService,
    private fetchCurrentAdminGQL: FetchCurrentAdminGQL
  ) {}
  async ngOnInit() {
    this.organization = (await lastValueFrom(this.fetchCurrentAdminGQL.fetch()))
      .data.fetchCurrentAdmin.organization as Organization;
    this.listCategorieGQL
      .fetch({
        queryConfig: {
          limit: 10,
        },
      })
      .subscribe({
        next: (resp) => {
          this.categories = resp.data.fetchCategorySociopros.results;
          this.categories = [
            {
              id: 'djkkdsj',
              title: 'Paramètres généraux',
              description: 'général',
            },
            ...this.categories,
          ];
          console.log('list', this.categories);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  addCategory(): void {
    if (this.newCategory && this.newCategory.trim()) {
    } else {
      // alert('Le nom de la catégorie ne peut pas être vide.');
    }
  }
  handleServiceActivationChange(isActive: boolean) {
    console.log('Service Activation:', isActive);
    this.isActive = isActive;
    this.activated = isActive;
  }

  handleAmountTypeChange(amountType: string) {
    console.log('Amount Type:', amountType);
    this.amountType = amountType;
  }

  handleReimbursementChange(reimbursement: number) {
    this.reimbursement = reimbursement;
    console.log('Reimbursement:', reimbursement);
  }

  handleValidationChange(isActive: boolean) {
    this.autoValidate = isActive;
    console.log('Validation:', isActive);
  }
  saveSettings() {
    this.defineService
      .mutate({
        organisationId: this.organization.id,
        serviceId: this.service.id,
        organisationServiceInput: {
          activated: this.isServiceActive,
          amount: this.reimbursement,
          amountUnit: this.isPercentage
            ? AmountUnit.Percentage
            : AmountUnit.Fixed,
        },
      })
      .subscribe({
        next: (response) => {
          console.log(response);
          this.snackBarService.showSnackBar('Settings saved successfully');
        },
        error: (err) => {
          console.log(err);
          this.snackBarService.showSnackBar(
            'An error occurred while saving settings'
          );
        },
      });
  }
}
