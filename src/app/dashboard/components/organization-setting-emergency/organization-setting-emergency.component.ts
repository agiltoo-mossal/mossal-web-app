import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { lastValueFrom } from 'rxjs';
import { SnackBarService } from 'src/app/shared/services/snackbar.service';
import {
  AmountUnit,
  CategorySociopro,
  CategorySocioproService,
  CategorySocioproServiceInput,
  CategorySocioproServiceUpdateInput,
  CreateCategorySocioproServiceGQL,
  CreateOrganistionServiceGQL,
  DurationUnit,
  FetchCategorySocioprosGQL,
  FetchCurrentAdminGQL,
  FetchOrganisationServiceByOrganisationIdAndServiceIdGQL,
  FetchServicesGQL,
  OrganisationServiceInput,
  OrganisationServiceUpdateInput,
  Organization,
  Service,
  UpdateCategorySocioproServiceGQL,
  UpdateOrganisationServiceGQL,
} from 'src/graphql/generated';
import { ActivationService } from '../organization/activation.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-organization-setting-emergency',
  templateUrl: './organization-setting-emergency.component.html',
  styleUrl: './organization-setting-emergency.component.scss',
})
export class OrganizationSettingEmergencyComponent {
  emergencyForm: FormGroup;
  dataForm: any;
  activated: boolean;
  activatedAt: string;
  listCategorieService: Partial<CategorySocioproService>[] = [];
  saveData: boolean = false;
  selectedCategorie: any;

  // Variables pour l'état des bascules
  isServiceActive: boolean = false; // Par défaut, le service est inactif
  isAutoValidation: boolean = false; // Par défaut, la validation automatique est inactive

  // Date d'activation
  activationDate: string = ''; // Format ISO (AAAA-MM-JJ)
  endDateValue: Date | null = null;
  disableButton: boolean = false; // Par défaut, le bouton de sauvegarde est désactivé
  // Gestion des catégories
  selectedCategory: string; // Catégorie par défaut
  categories: Partial<CategorySociopro & { error: boolean }>[] = [];
  organisationServiceId!: string;
  categorySocioproServiceId: string = '';
  // Pourcentage ou montant fixe
  organization: Organization;
  @Input() service: Partial<Service>;
  serviceId: string;
  @Output() serviceActivationChange = new EventEmitter<{
    isActive: boolean;
    organisationServiceId: string;
  }>();

  /**
   * Méthode appelée pour ajouter une nouvelle catégorie
   */
  constructor(
    private listCategorieGQL: FetchCategorySocioprosGQL,
    private updateService: UpdateOrganisationServiceGQL,
    private defineService: CreateOrganistionServiceGQL,
    private fetchCurrentAdminGQL: FetchCurrentAdminGQL,
    private fb: FormBuilder,
    private activatedService: ActivationService,
    private snackBarService: SnackBarService,
    private createCategorySocioproServiceGQL: CreateCategorySocioproServiceGQL,
    private updateCategorySocioproServiceGQL: UpdateCategorySocioproServiceGQL,
    private listService: FetchServicesGQL,
    private organizationService: FetchOrganisationServiceByOrganisationIdAndServiceIdGQL
  ) { }

  async ngOnInit() {
    this.serviceId = this.service.id;
    this.emergencyForm = this.fb.group({
      activated: [true],
      activatedAt: ['', Validators.required],
      endDate: [null, [Validators.required, this.pastDateValidator]],
      selectedCategory: [''],
      amountUnit: [AmountUnit.Percentage],
      amount: [0, [, Validators.required]],
      autoValidate: [true],
      refundDuration: [1, [Validators.required, Validators.min(1)]],
      // amount: [0],
    });

    //ajouter
    this.organization = (await lastValueFrom(this.fetchCurrentAdminGQL.fetch()))
      .data.fetchCurrentAdmin.organization as Organization;

    this.organizationService
      .fetch(
        {
          organisationId: this.organization.id,
          serviceId: this.service.id,
        },
        { fetchPolicy: 'no-cache' }
      )
      .subscribe({
        next: (response) => {
          if (
            response.data.fetchOrganisationServiceByOrganisationIdAndServiceId
          ) {
            const data = response.data
              .fetchOrganisationServiceByOrganisationIdAndServiceId as any;
            this.organisationServiceId = data.id;
            this.dataForm = data;

            // this.listCategorieService = [
            //   {
            //     amount: this.dataForm.amount,
            //     amountUnit: this.dataForm.amountUnit,
            //     refundDuration: this.dataForm.refundDuration,
            //     refundDurationUnit: this.dataForm.refundDurationUnit,
            //     activated: this.dataForm.activated,
            //     activatedAt: this.dataForm.activatedAt,
            //     autoValidate: this.dataForm.autoValidate,
            //     categorySociopro: {
            //       title: 'Paramètres généraux',
            //     } as any,
            //   },
            // ];

            this.listCategorieService = [
              {
                amount: this.dataForm.amount,
                amountUnit: this.dataForm.amountUnit,
                refundDuration: this.dataForm.refundDuration,
                refundDurationUnit: this.dataForm.refundDurationUnit,
                activated: this.dataForm.activated,
                activatedAt: this.dataForm.activatedAt,
                autoValidate: this.dataForm.autoValidate,
                categorySociopro: {
                  id: 'general',
                  title: 'Paramètres généraux',
                } as any,
              },
            ];

            this.selectedCategorie = this.listCategorieService[0];
            this.dataForm?.categoriesocioproservices.forEach((item) => {
              this.listCategorieService.push({
                ...item,
              });
            });
            this.activated = data.activated;

            if (data.activatedAt && data.activationDurationDay != null) {
              const [y, m, d] = data.activatedAt.split('-').map(Number);
              const startLocal = new Date(y, m - 1, d);
              const endDate = new Date(startLocal.getTime() + data.activationDurationDay * 24 * 60 * 60 * 1000);
              this.endDateValue = endDate;
              this.emergencyForm.get('endDate').setValue(endDate);
            }

            this.emergencyForm.patchValue({
              activated: data.activated,
              activatedAt: data.activatedAt,
              amountUnit: data.amountUnit,
              //A enlever apres les tests
              amountPercentage: data.amountPercentage,
              autoValidate: data.autoValidate,
              // amountType: data?.amountUnit || AmountUnit.Percentage,
              selectedCategory: data.categorySociopro?.id,
            });
          } else {
            this.activated = true;
            this.listCategorieService = [
              {
                amount: 0,
                amountUnit: AmountUnit.Percentage,
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

            this.selectedCategorie = this.listCategorieService[0];
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
    this.listCategorieGQL
      .fetch(
        {
          queryConfig: {
            limit: 10,
          },
        },
        { fetchPolicy: 'no-cache' }
      )
      .subscribe((result) => {
        this.categories = result.data.fetchCategorySociopros.results;
      });
  }

  /**
   * Méthode pour sauvegarder les paramètres de plafond
   */
  async saveSettings(): Promise<void> {
    if (this.emergencyForm.invalid && !this.saveData) {
      this.snackBarService.showSnackBar('Veuillez remplir tous les champs');
      return;
    }
    if (
      this.emergencyForm.get('amountUnit')?.value === EAmountUnit.Percentage &&
      this.emergencyForm.get('amount')?.value == null
    ) {
      this.snackBarService.showSnackBar('Vous devez renseigner le pourcentage');
      return;
    }
    if (
      this.emergencyForm.get('amountUnit')?.value === EAmountUnit.Fixed &&
      this.emergencyForm.get('amount')?.value == null
    ) {
      this.snackBarService.showSnackBar('Vous devez renseigner le montant');
      return;
    }

    const result = await Swal.fire({
      title: 'Voulez-vous enregistrer les modifications?',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non',
    });
    if (!result.isConfirmed) return;

    const formData = this.emergencyForm.getRawValue();
    const { endDate, ...restFormData } = formData;

    const parseLocalDate = (str: string): Date => {
      if (!str) return null;
      if (str.includes('T') || str.length > 10) return new Date(str);
      const [y, m, d] = str.split('-').map(Number);
      return new Date(y, m - 1, d);
    };
    const activatedAt = restFormData.activatedAt ? parseLocalDate(restFormData.activatedAt) : null;
    const activationDurationDay = activatedAt && endDate
      ? Math.max(0, Math.floor((new Date(endDate).getTime() - activatedAt.getTime()) / (1000 * 60 * 60 * 24)))
      : 0;

    const data = {
      ...restFormData,
      activationDurationDay,
      refundDurationUnit: ERrefundDurationUnit.Month,
      refundDuration: this.service.refundDurationMonth,
    };
    delete data.selectedCategory;

    if (
      this.selectedCategorie?.categorySociopro?.title === 'Paramètres généraux'
    ) {
      if (this.organisationServiceId) {
        this.updateOrganisationService(this.organisationServiceId, data);
      } else {
        this.createOrganisationService(
          data,
          this.organization.id,
          this.service.id
        );
      }
    } else {
      // Build category input from dataForm (salary-refund pattern)
      // Strip fields not accepted by CategorySocioproServiceInput
      const {
        activatedAt: _at, activationDurationDay: _acd,
        __typename, organizationId: _oid, serviceId: _sid,
        amountPercentage: _ap, categoriesocioproservices: _css,
        events: _ev, service: _svc, organization: _org,
        id: _id, selectedCategory: _sc, endDate: _ed,
        ...categoryData
      } = { ...data, ...(this.dataForm || {}) } as any;

      const selectedUpdate = this.listCategorieService.find(
        (item) =>
          item?.id === this.selectedCategorie?.id &&
          item?.id &&
          this.selectedCategorie?.id
      );

      const categorySocioproId =
        this.selectedCategorie?.categorySocioproId ||
        this.selectedCategorie?.categorySociopro?.id;

      if (!categorySocioproId || !this.organisationServiceId) {
        console.error('[Emergency] Missing IDs for category save:', {
          categorySocioproId,
          organisationServiceId: this.organisationServiceId,
          selectedCategorie: this.selectedCategorie,
        });
        this.snackBarService.showSnackBar(
          'Veuillez enregistrer les paramètres généraux avant de modifier une catégorie'
        );
        return;
      }

      if (!selectedUpdate) {
        this.createCategorySocioproServiceGQL
          .mutate({
            categorySocioproId,
            categorySocioproServiceInput: { ...categoryData },
            organisationServiceId: this.organisationServiceId,
          })
          .subscribe({
            next: (_) => {
              this.snackBarService.showSnackBar(
                `Nouvelles Paramètragres de plafond enregistrés sur le service ${this.selectedCategorie?.categorySociopro?.title}`
              );
            },
            error: (err) => {
              this.snackBarService.showSnackBar(
                "Une erreur est survenue lors de l'enregistrement des paramètres du service"
              );
              console.log(err);
            },
          });
      } else {
        this.updateCategorySocioproServiceGQL
          .mutate({
            categorySocioproServiceId: selectedUpdate.id,
            categorySocioproServiceInput: { ...categoryData },
          })
          .subscribe({
            next: (_) => {
              this.snackBarService.showSnackBar(
                `Mise à jour des paramètres de plafond enregistrée sur le service ${this.selectedCategorie?.categorySociopro?.title}`
              );
            },
            error: (err) => {
              this.snackBarService.showSnackBar(
                "Une erreur est survenue lors de l'enregistrement des paramètres du service"
              );
              console.log(err);
            },
          });
      }
    }
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
          this.organisationServiceId = (response.data?.createOrganisationService as any)?.id;
          this.snackBarService.showSnackBar(
            'Nouvelles Paramètres enregistrées avec succès'
          );
        },
        error: (err) => {
          console.log(err);
          this.snackBarService.showSnackBar(
            "Une erreur est survenue lors de l'enregistrement des paramètres du service"
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
            'Mise à jour des paramètres de plafond enregistrée avec succès'
          );
        },
        error: (err) => {
          console.log(err);
          this.snackBarService.showSnackBar(
            "Une erreur est survenue lors de l'enregistrement des paramètres du service"
          );
        },
      });
  }

  createCategorySocioproService(
    categorySocioproId: string,
    categorySocioproServiceInput: CategorySocioproServiceInput,
    organisationServiceId: string
  ) {
    this.createCategorySocioproServiceGQL
      .mutate({
        categorySocioproId,
        categorySocioproServiceInput,
        organisationServiceId,
      })
      .subscribe({
        next: (response) => {
          console.log('response', response);
          this.snackBarService.showSnackBar(
            'Paramètres du service enregistrés'
          );
        },
        error: (err) => {
          console.log(err);
          this.snackBarService.showSnackBar(
            "Une erreur est survenue lors de l'enregistrement des paramètres du service"
          );
        },
      });
  }
  updateCategorySocioproService(
    categorySocioproServiceId: string,
    categorySocioproServiceInput: CategorySocioproServiceUpdateInput
  ) {
    this.updateCategorySocioproServiceGQL
      .mutate({
        categorySocioproServiceId,
        categorySocioproServiceInput,
      })
      .subscribe({
        next: (response) => {
          console.log('response', response);
          this.snackBarService.showSnackBar(
            'Paramètres du service enregistrés'
          );
        },
        error: (err) => {
          console.log(err);
          this.snackBarService.showSnackBar(
            "Une erreur est survenue lors de l'enregistrement des paramètres du service"
          );
        },
      });
  }

  pastDateValidator(control: { value: Date | null }) {
    if (!control.value) return null;
    return new Date(control.value) < new Date() ? { pastDate: true } : null;
  }

  get endDateControl() {
    return this.emergencyForm.get('endDate');
  }

  onEndDateChange(event: any) {
    const date = new Date(event.value);
    this.endDateValue = date;
    this.emergencyForm.get('endDate').setValue(date);
    this.disableButton = true;
  }

  onToggle(event) {
    this.autoValidate.setValue(event);
  }

  onServiceActivationChange(isActive: boolean) {
    this.emergencyForm.get('activated').setValue(isActive);
    this.activated = isActive;
    this.disableButton = true;
  }
  onTabChange(event: MatTabChangeEvent) {
    this.selectedCategorie = this.listCategorieService[event.index];
    this.activatedAt = this.selectedCategorie.activatedAt;
  }
  get amountUnit() {
    return this.emergencyForm.get('amountUnit');
  }
  get autoValidate() {
    return this.emergencyForm.get('autoValidate');
  }
  get amountPercentage() {
    return this.emergencyForm.get('amountPercentage');
  }
  onSettingChange($event) {
    this.disableButton = false;
    if ($event.saveData) {
      this.saveData = true;
      this.disableButton = true;
      const tempForm = $event.dataForm;
      // Merge like salary-refund to preserve categorySocioproId, id, etc.
      this.dataForm = { ...this.dataForm, ...tempForm };
      const { activated, ...rest } = tempForm;
      this.emergencyForm.patchValue({ ...rest });
    } else {
      this.saveData = false;
    }
  }
  onDateChange(event: MatDatepickerInputEvent<Date>) {
    const date = event.value;
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    this.emergencyForm.get('activatedAt').setValue(`${y}-${m}-${d}`);
  }
  onChangeCategorie(event: Event) {
    console.log('rvent', (event.target as any).value);
    const targetValue = (event.target as any).value;
    console.log('selectedCategory', this.selectedCategory);

    const temp = [...this.listCategorieService];
    const cate = this.categories.find((item) => item?.id == targetValue);

    if (
      this.listCategorieService.some(
        (item) => item.categorySociopro?.title === cate.title
      )
    ) {
      this.snackBarService.showSnackBar('Cette catégorie est déjà ajoutée');
      return;
    }
    if (!this.organisationServiceId) {
      this.snackBarService.showSnackBar(
        'Veuillez enregistrer les paramètres avant d ajouter une catégorie'
      );
      return;
    }
    temp.push({
      activated: true,
      amount: 0,
      amountUnit: AmountUnit.Fixed,
      autoValidate: true,
      organisationServiceId: this.organisationServiceId,
      categorySocioproId:
        this.categories.find((item) => item?.id == targetValue)?.id || '',
      categorySociopro: this.categories.find((item) => item?.id == targetValue),
      refundDuration: 1,
      refundDurationUnit: DurationUnit.Month,
      activatedAt: null,
    } as any);

    this.listCategorieService = temp;
  }
}
export enum EAmountUnit {
  Fixed = 'Fixed',
  Percentage = 'Percentage',
}
export enum ERrefundDurationUnit {
  Day = 'Day',
  Month = 'Month',
}
