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
  ) {}

  async ngOnInit() {
    this.serviceId = this.service.id;
    this.emergencyForm = this.fb.group({
      activated: [true],
      activatedAt: ['', Validators.required],
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
            this.dataForm = data;
            console.log('dataForm', this.dataForm);

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
      .fetch({
        queryConfig: {
          limit: 10,
        },
      })
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
      !this.emergencyForm.get('amount')?.value
    ) {
      this.snackBarService.showSnackBar('Vous devez renseigner le pourcentage');
      return;
    }
    if (
      this.emergencyForm.get('amountUnit')?.value === EAmountUnit.Fixed &&
      !this.emergencyForm.get('amount')?.value
    ) {
      this.snackBarService.showSnackBar('Vous devez renseigner le montant');
      return;
    }
    const formData = this.emergencyForm.getRawValue();

    const data = {
      ...formData,
      refundDurationUnit: ERrefundDurationUnit.Month,
      refundDuration: this.service.refundDurationMonth,
    };

    if (
      this.selectedCategorie.categorySociopro?.title === 'Paramètres généraux'
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
      const temp = this.listCategorieService.filter(
        (item) => item.categorySociopro?.title !== 'Paramètres généraux'
      );

      let selectedUpdate = temp.find(
        (item) =>
          item?.categorySocioproId &&
          this.selectedCategorie?.categorySocioproId &&
          item?.categorySocioproId ===
            this.selectedCategorie?.categorySocioproId
      );

      if (!selectedUpdate?.id) {
        this.createCategorySocioproServiceGQL
          .mutate({
            categorySocioproId: this.selectedCategorie?.categorySocioproId,
            categorySocioproServiceInput: data,
            organisationServiceId: this.organisationServiceId,
          })
          .subscribe({
            next: (response) => {
              this.snackBarService.showSnackBar(
                `Nouvelles Paramètragres de plafond enregistrés sur le service ${this.selectedCategorie.categorySociopro?.title}`
              );
            },
            error: (err) => {
              this.snackBarService.showSnackBar(
                "Une erreur est survenue lors de l'enregistrement des paramètres de plafond"
              );
              console.log(err);
            },
          });
      } else {
        this.updateCategorySocioproServiceGQL
          .mutate({
            categorySocioproServiceId: selectedUpdate.id,
            categorySocioproServiceInput: data,
          })
          .subscribe({
            next: (response) => {
              console.log(response);
              this.snackBarService.showSnackBar(
                `Mise à jour des paramètres de plafond enregistrée sur le service ${this.selectedCategorie.categorySociopro?.title}`
              );
            },
            error: (err) => {
              this.snackBarService.showSnackBar(
                "Une erreur est survenue lors de l'enregistrement des paramètres de plafond"
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
          console.log('response', response);
          this.snackBarService.showSnackBar(
            'Nouvelles Paramètres enregistrées avec succès'
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
            'Mise à jour des paramètres de plafond enregistrée avec succès'
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

  onToggle(event) {
    this.autoValidate.setValue(event);
  }
  onServiceActivationChange(isActive: boolean) {
    console.log('isActive', isActive);
    if (this.organisationServiceId) {
      this.serviceActivationChange.emit({
        isActive,
        organisationServiceId: this.organisationServiceId,
      });
    } else {
      this.snackBarService.showSnackBar(
        "Veuillez enregistrer les paramètres de plafond avant d'activer le service"
      );
    }
    this.emergencyForm.get('activated').setValue(isActive);
    this.activated = isActive;
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
    this.dataForm = $event.dataForm;
    if ($event.saveData) {
      this.saveData = true;
      this.emergencyForm.patchValue({
        ...$event.dataForm,
      });
    } else {
      this.saveData = false;
    }
    console.log('dataForm', this.emergencyForm.getRawValue());
  }
  onDateChange(event: MatDatepickerInputEvent<Date>) {
    const date = new Date(event.value);
    const formattedDate = date.toISOString().split('T')[0];
    this.emergencyForm.get('activatedAt').setValue(formattedDate);
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
