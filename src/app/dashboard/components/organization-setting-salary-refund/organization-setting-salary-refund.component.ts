import { Component, Input } from '@angular/core';
import {
  CategorySociopro,
  FetchCategorySocioprosGQL,
  Organization,
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
  isActive: boolean = false;
  amountType: string = '';
  reimbursement: number = 0;
  organization: Organization;
  autoValidate: boolean = false;
  @Input() serviceId: string;
  constructor(private listCategorieGQL: FetchCategorySocioprosGQL) {}

  ngOnInit() {
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
  }

  handleAmountTypeChange(amountType: string) {
    console.log('Amount Type:', amountType);
  }

  handleReimbursementChange(reimbursement: number) {
    console.log('Reimbursement:', reimbursement);
  }

  handleValidationChange(isActive: boolean) {
    console.log('Validation:', isActive);
  }
}
