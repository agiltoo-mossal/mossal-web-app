import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { lastValueFrom } from 'rxjs';
import { SnackBarService } from 'src/app/shared/services/snackbar.service';
import {
  AmountUnit,
  CategorySociopro,
  CategorySocioproService,
  CreateCategorySocioproServiceGQL,
  CreateOrganistionServiceGQL,
  DurationUnit,
  FetchCategorySocioprosGQL,
  FetchCurrentAdminGQL,
  FetchOrganisationServiceByOrganisationIdAndServiceIdGQL,
  OrganisationServiceInput,
  OrganisationServiceUpdateInput,
  Organization,
  Service,
  UpdateCategorySocioproServiceGQL,
  UpdateOrganisationServiceGQL,
} from 'src/graphql/generated';
import Swal from 'sweetalert2';
import { differenceInMonths, differenceInDays } from 'date-fns';

@Component({
  selector: 'app-organization-setting-salary',
  templateUrl: './organization-setting-salary.component.html',
  styleUrl: './organization-setting-salary.component.scss',
})
export class OrganizationSettingSalaryComponent {
  salaryForm: FormGroup;
  isPercentage: boolean = true;
  categories: Partial<CategorySociopro & { error: boolean }>[] = [];
  listCategorieService: Partial<CategorySocioproService>[] = [];

  newCategory: string = '';
  isActive: boolean = false;
  organization: Organization;
  organisationServiceId: string;
  activated: boolean = true;
  selectedCategorie: any;
  @Output() activeService: EventEmitter<{
    isActive: boolean;
    organisationServiceId: string;
  }> = new EventEmitter();
  @Input() service: Partial<Service>;
  constructor(
    private fb: FormBuilder,
    private updateService: UpdateOrganisationServiceGQL,

    private listCategorieGQL: FetchCategorySocioprosGQL,
    private defineService: CreateOrganistionServiceGQL,
    private snackBarService: SnackBarService,
    private fetchCurrentAdminGQL: FetchCurrentAdminGQL,
    private updateCategorySocioproServiceGQL: UpdateCategorySocioproServiceGQL,
    private createCategorySocioproServiceGQL: CreateCategorySocioproServiceGQL,

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
          console.log('response', response);

          if (
            response.data.fetchOrganisationServiceByOrganisationIdAndServiceId
          ) {
            const data = response.data
              .fetchOrganisationServiceByOrganisationIdAndServiceId as any;
            this.organisationServiceId = data.id;
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
            this.selectedCategorie = this.listCategorieService[0];
            console.log(this.selectedCategorie);

            this.listCategorieService = [
              ...this.listCategorieService,
              ...(data?.categoriesocioproservices || []),
            ];
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
          this.categories = [...this.categories];
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
    this.selectedCategorieSociopro.valueChanges.subscribe((cate) => {
      console.log(cate);
      if (cate) {
        const temp = [...this.listCategorieService];
        const category = this.categories.find((item) => item?.id == cate);
        if (
          this.listCategorieService.some(
            (item) => item.categorySociopro?.title === category?.title
          )
        ) {
          this.snackBarService.showSnackBar('Cette catégorie est déjà ajoutée');
          return;
        }
        this.selectedCategorie = category;

        temp.push({
          activated: true,
          amount: 0,
          amountUnit: AmountUnit.Fixed,
          autoValidate: true,
          organisationServiceId: this.organisationServiceId,
          categorySocioproId:
            this.categories.find((item) => item?.id == cate)?.id || '',
          categorySociopro: this.categories.find((item) => item?.id == cate),
          refundDuration: 1,
          refundDurationUnit: DurationUnit.Month,
          activatedAt: null,
        } as any);
        this.listCategorieService = temp;
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
  handleServiceActivationChange(isActive: boolean) {
    this.isActive = isActive;
    this.activated = isActive;

    this.activeService.emit({
      isActive,
      organisationServiceId: this.organisationServiceId,
    });
  }

  get startDate() {
    return this.salaryForm.get('startDate');
  }
  get endDate() {
    return this.salaryForm.get('endDate');
  }
  get selectedCategorieSociopro() {
    return this.salaryForm.get('selectedCategory');
  }

  saveSettings() {
    if (this.salaryForm.invalid) {
      return;
    }
    Swal.fire({
      title: 'Voulez-vous enregistrer les modifications?',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non',
    }).then((result) => {
      if (result.isConfirmed) {
        const dataForm = this.salaryForm.getRawValue();
        delete dataForm.selectedCategory;
        delete dataForm.startDate;
        delete dataForm.endDate;
        console.log(this.selectedCategorie);

        if (
          this.selectedCategorie.categorySociopro.title == 'Paramètres généraux'
        ) {
          if (this.organisationServiceId) {
            this.updateOrganisationService(
              this.organisationServiceId,
              dataForm
            );
          } else {
            this.createOrganisationService(
              dataForm,
              this.organization.id,
              this.service.id
            );
          }
        } else {
          let selectedUpdate = this.listCategorieService.find(
            (item) =>
              item?.id === this.selectedCategorie?.id &&
              item?.id &&
              this.selectedCategorie?.id
          );
          if (!selectedUpdate) {
            this.createCategorySocioproServiceGQL
              .mutate({
                categorySocioproId: this.selectedCategorie.categorySocioproId,
                categorySocioproServiceInput: {
                  ...this.salaryForm.getRawValue(),
                },
                organisationServiceId: this.organisationServiceId,
              })
              .subscribe({
                next: (response) => {
                  this.snackBarService.showSnackBar('Paramètres enregistrés');
                },
                error: (err) => {
                  this.snackBarService.showErrorSnackBar();
                },
              });
          } else {
            this.updateCategorySocioproServiceGQL
              .mutate({
                categorySocioproServiceId: selectedUpdate.id,
                categorySocioproServiceInput: {
                  ...this.salaryForm.getRawValue(),
                },
              })
              .subscribe({
                next: (response) => {
                  this.snackBarService.showSnackBar('Paramètres enregistrés');
                },
                error: (err) => {
                  this.snackBarService.showSnackBar(
                    'Une configuration est deja mise en place'
                  );
                },
              });
          }
        }
      }
    });
  }
  createOrganisationService(
    organisationServiceInput: OrganisationServiceInput,
    organisationId: string,
    serviceId: string
  ) {
    this.defineService
      .mutate({
        organisationId,
        serviceId,
        organisationServiceInput,
      })
      .subscribe({
        next: (response) => {
          console.log('response', response);
          this.snackBarService.showSnackBar(
            'Paramètres de plafond enregistrés'
          );
        },
        error: (err) => {
          console.log(err);
          this.snackBarService.showSnackBar(
            "Une erreur est survenue lors de l'enregistrement des paramètres de plafond"
          );
        },
      });
  }
  updateOrganisationService(
    organisationServiceId: string,
    organisationServiceInput: OrganisationServiceUpdateInput
  ) {
    this.updateService
      .mutate({
        organisationServiceId,
        organisationServiceInput,
      })
      .subscribe({
        next: (response) => {
          console.log('response', response);
          this.snackBarService.showSnackBar(
            'Paramètres de plafond enregistrés'
          );
        },
        error: (err) => {
          console.log(err);
          this.snackBarService.showSnackBar(
            "Une erreur est survenue lors de l'enregistrement des paramètres de plafond"
          );
        },
      });
  }
  onSettingChange(event: any) {
    console.log('event', event);
    const tempForm = event?.dataForm;

    if (event.dataForm.amountPercentage === AmountUnit.Percentage) {
      this.salaryForm.get('amount').setValue(event.dataForm.amountPercentage);
      delete tempForm.amountPercentage;
    }
    this.salaryForm.patchValue({
      ...this.salaryForm.getRawValue(),
      ...tempForm,
    });
    console.log('form', this.salaryForm.getRawValue());
  }
  onTabChange(event: MatTabChangeEvent) {
    this.selectedCategorie = this.listCategorieService[event.index];
  }
}
