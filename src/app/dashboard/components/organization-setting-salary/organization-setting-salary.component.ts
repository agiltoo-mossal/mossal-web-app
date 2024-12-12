import { Component, Input } from '@angular/core';
import { CategorySociopro, Organization } from 'src/graphql/generated';

@Component({
  selector: 'app-organization-setting-salary',
  templateUrl: './organization-setting-salary.component.html',
  styleUrl: './organization-setting-salary.component.scss',
})
export class OrganizationSettingSalaryComponent {
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
  organisationServiceId: string;

  @Input() serviceId: string;

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
