import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { differenceInDays, differenceInMonths } from 'date-fns';
import { lastValueFrom } from 'rxjs';
import { SnackBarService } from 'src/app/shared/services/snackbar.service';
import {
  AmountUnit,
  CategorySociopro,
  CategorySocioproService,
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
  selectedCategorie: any;
  selectedCategorieId: string;

  salaryForm: FormGroup;
  categories: Partial<CategorySociopro & { error: boolean }>[] = [];
  listCategorieService: Partial<CategorySocioproService>[] = [];

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
            this.activated = data.activated;
            this.listCategorieService = [
              {
                amount: data.amount,
                amountUnit: data.amountUnit,
                refundDuration: data.refundDuration,
                refundDurationUnit: data.refundDurationUnit,
                activated: data.activated,
                activatedAt: data.activatedAt,
                autoValidate: data.autoValidate,
                categorySociopro: {
                  title: 'Paramètres généraux',
                } as any,
              },
            ];

            this.listCategorieService = [
              ...this.listCategorieService,
              ...(data?.categoriesocioproservices || []),
            ];
          } else {
            this.listCategorieService = [
              {
                amount: 0,
                amountUnit: AmountUnit.Fixed,
                refundDuration: 1,
                refundDurationUnit: DurationUnit.Month,
                activated: true,
                activatedAt: null,
                autoValidate: true,
                categorySociopro: {
                  title: 'Paramètres généraux',
                } as any,
              },
            ];
          }
          this.selectedCategorie = this.listCategorieService[0];
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
  onChangeCategorie(event: Event) {
    const temp = [...this.listCategorieService];
    console.table(temp);
    const cate = this.categories.find(
      (item) => item?.id == this.selectedCategorieId
    );
    if (
      this.listCategorieService.some(
        (item) => item.categorySociopro?.title === cate.title
      )
    ) {
      this.snackBarService.showSnackBar('Cette catégorie est déjà ajoutée');
      return;
    }
    temp.push({
      activated: true,
      amount: 0,
      amountUnit: AmountUnit.Fixed,
      autoValidate: true,
      organisationServiceId: this.organisationServiceId,
      categorySocioproId:
        this.categories.find((item) => item?.id == this.selectedCategorieId)
          ?.id || '',
      categorySociopro: this.categories.find(
        (item) => item?.id == this.selectedCategorieId
      ),
      refundDuration: 1,
      refundDurationUnit: DurationUnit.Month,
      activatedAt: null,
    } as any);
    console.log(temp);

    this.listCategorieService = temp;
  }
}
