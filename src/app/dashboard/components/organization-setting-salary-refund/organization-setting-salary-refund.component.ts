import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { differenceInDays, differenceInMonths } from 'date-fns';
import { lastValueFrom } from 'rxjs';
import { SnackBarService } from 'src/app/shared/services/snackbar.service';
import {
  AmountUnit,
  CategorySociopro,
  CreateOrganistionServiceGQL,
  DurationUnit,
  FetchCategorySocioprosGQL,
  FetchCurrentAdminGQL,
  FetchOrganisationServiceByOrganisationIdAndServiceIdGQL,
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
  selectedCategorie: Partial<CategorySociopro & { error: boolean }>;
  salaryForm: FormGroup;
  categories: Partial<CategorySociopro & { error: boolean }>[] = [];

  newCategory: string = '';
  isActive: boolean = true;
  amountType: string = '';
  reimbursement: number = 0;
  organization: Organization;
  autoValidate: boolean = false;
  activated: boolean = true;
  organisationServiceId!: string;

  @Input() service: Partial<Service>;
  @Output() activeService = new EventEmitter<{
    isActive: boolean;
    organisationServiceId: string;
  }>();
  constructor(
    private listCategorieGQL: FetchCategorySocioprosGQL,
    private defineService: CreateOrganistionServiceGQL,
    private snackBarService: SnackBarService,
    private fb: FormBuilder,
    private fetchCurrentAdminGQL: FetchCurrentAdminGQL,
    private organizationService: FetchOrganisationServiceByOrganisationIdAndServiceIdGQL
  ) {}
  async ngOnInit() {
    this.salaryForm = this.fb.group({
      activated: [true],
      amountUnit: ['', Validators.required],
      autoValidate: [true],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      refundDurationUnit: [DurationUnit.Month, Validators.required],
      refundDuration: [0, Validators.required],
      selectedCategory: [''],
    });
    this.organization = (await lastValueFrom(this.fetchCurrentAdminGQL.fetch()))
      .data.fetchCurrentAdmin.organization as Organization;
    this.organizationService
      .fetch({
        organisationId: this.organization.id,
        serviceId: this.service.id,
      })
      .subscribe({
        next: (response) => {
          if (
            response.data.fetchOrganisationServiceByOrganisationIdAndServiceId
          ) {
            const data = response.data
              .fetchOrganisationServiceByOrganisationIdAndServiceId as any;
            this.organisationServiceId = data.id;
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
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
    this.startDate.valueChanges.subscribe((startDate) => {
      const endDate = this.endDate.value;
      if (startDate && endDate) {
        this.calculateRefundDuration(startDate, endDate);
      }
    });

    this.endDate.valueChanges.subscribe((endDate) => {
      const startDate = this.startDate.value;

      if (startDate && endDate) {
        this.calculateRefundDuration(startDate, endDate);
      }
    });
  }
  calculateRefundDuration(startDate: string, endDate: string) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start <= end) {
      const duration =
        differenceInMonths(end, start) +
        (differenceInDays(end, start) % 30) / 30;

      // approximate month difference
      this.salaryForm.get('refundDuration').setValue(duration);
    } else {
      this.salaryForm.get('refundDuration').setValue(0);
    }
  }

  addCategory(): void {
    if (this.newCategory && this.newCategory.trim()) {
    } else {
      // alert('Le nom de la catégorie ne peut pas être vide.');
    }
  }
  get startDate() {
    return this.salaryForm.get('startDate');
  }
  get endDate() {
    return this.salaryForm.get('endDate');
  }
  onSettingChange(event: any) {
    console.log('event', event);
    const tempForm = event?.dataForm;
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
  onServiceActivationChange(isActive: boolean) {
    this.activated = isActive;
    if (this.organisationServiceId) {
      this.activeService.emit({
        isActive,
        organisationServiceId: this.organisationServiceId,
      });
    } else {
      this.snackBarService.showSnackBar(
        "Veuillez enregistrer les paramètres de plafond avant d'activer le service"
      );
    }
    // this.emergencyForm.get('activated').setValue(isActive);
  }
  onTabChange(event: MatTabChangeEvent) {
    this.selectedCategorie = this.categories[event.index];
  }
}
