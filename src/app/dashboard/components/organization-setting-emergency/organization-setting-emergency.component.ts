import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { lastValueFrom } from 'rxjs';
import { SnackBarService } from 'src/app/shared/services/snackbar.service';
import {
  AmountUnit,
  CategorySociopro,
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

@Component({
  selector: 'app-organization-setting-emergency',
  templateUrl: './organization-setting-emergency.component.html',
  styleUrl: './organization-setting-emergency.component.scss',
})
export class OrganizationSettingEmergencyComponent {
  emergencyForm: FormGroup;

  // Variables pour l'état des bascules
  isServiceActive: boolean = false; // Par défaut, le service est inactif
  isAutoValidation: boolean = false; // Par défaut, la validation automatique est inactive

  // Date d'activation
  activationDate: string = ''; // Format ISO (AAAA-MM-JJ)

  // Gestion des catégories
  selectedCategory: string = 'all'; // Catégorie par défaut
  categories: Partial<CategorySociopro & { error: boolean }>[] = [];
  organisationServiceId!: string;
  categorySocioproServiceId: string = '';
  // Pourcentage ou montant fixe
  organization: Organization;
  @Input() service: Partial<Service>;
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
    private snackBarService: SnackBarService,
    private createCategorySocioproServiceGQL: CreateCategorySocioproServiceGQL,
    private updateCategorySocioproServiceGQL: UpdateCategorySocioproServiceGQL,
    private listService: FetchServicesGQL,
    private organizationService: FetchOrganisationServiceByOrganisationIdAndServiceIdGQL
  ) {}

  async ngOnInit() {
    this.emergencyForm = this.fb.group({
      activated: [true],
      activatedAt: ['', Validators.required],
      selectedCategory: ['', Validators.required],
      amountUnit: [AmountUnit.Percentage],
      // amountPercentage: [0, [, Validators.min(0), Validators.max(100)]],
      autoValidate: [true],
      // amount: [0],
    });
    this.emergencyForm.addControl(
      'amountPercentage',
      this.fb.control(null, [Validators.min(0), Validators.max(100)])
    );
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
            this.emergencyForm.get('amountPercentage').setValue(30);
            console.log('dataForm', this.emergencyForm.getRawValue());
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
        console.log('list', this.categories);
      });

    this.amountUnit.valueChanges.subscribe((value) => {
      if (value == AmountUnit.Percentage) {
        this.emergencyForm.removeControl('amount');
        this.emergencyForm.addControl(
          'amountPercentage',
          this.fb.control(null, [Validators.min(1), Validators.max(100)])
        );
      } else {
        this.emergencyForm.removeControl('amountPercentage');
        this.emergencyForm.addControl(
          'amount',
          this.fb.control(null, [Validators.required])
        );
      }
    });
  }
  addCategory(): void {
    const newCategory = prompt('Entrez le nom de la nouvelle catégorie :');
    if (newCategory && newCategory.trim()) {
    } else {
      alert('Le nom de la catégorie ne peut pas être vide.');
    }
  }

  /**
   * Méthode pour sauvegarder les paramètres de plafond
   */
  async saveSettings(): Promise<void> {
    if (this.emergencyForm.invalid) {
      this.snackBarService.showSnackBar('Veuillez remplir tous les champs');
      return;
    }
    if (
      this.emergencyForm.get('amountUnit').value === EAmountUnit.Percentage &&
      !this.emergencyForm.get('amountPercentage').value
    ) {
      this.snackBarService.showSnackBar('Vous devez renseigner le pourcentage');
      return;
    }
    if (
      this.emergencyForm.get('amountUnit').value === EAmountUnit.Fixed &&
      !this.emergencyForm.get('amount').value
    ) {
      this.snackBarService.showSnackBar('Vous devez renseigner le montant');
      return;
    }
    const formData = this.emergencyForm.getRawValue();
    if (
      this.emergencyForm.get('amountUnit').value === EAmountUnit.Percentage &&
      this.emergencyForm.get('amountPercentage').value
    ) {
      formData['amount'] = this.emergencyForm.get('amountPercentage').value;
      delete formData['amountPercentage'];
    }
    const data = {
      ...formData,
      activationDurationDay: 30,
      refundDurationUnit: ERrefundDurationUnit.Month,
      refundDuration: this.service.refundDurationMonth,
    };

    if (data.selectedCategory) {
      const categoryInput: CategorySocioproServiceInput & {
        amountPercentage?: number;
      } = {
        amountUnit: data.amountUnit,
        refundDurationUnit: DurationUnit.Month,
        refundDuration: this.service.refundDurationMonth,
        autoValidate: data.autoValidate,
        activated: data.activated,
        activatedAt: data.activatedAt,
        amount: data.amount,
      };

      try {
        const response = await lastValueFrom(
          this.createCategorySocioproServiceGQL.mutate({
            categorySocioproId: data.selectedCategory,
            categorySocioproServiceInput: categoryInput,
            organisationServiceId: this.organization.organisationService.find(
              (item) => item.serviceId === this.service.id
            )?.id,
          })
        );
        console.log(response);
        this.snackBarService.showSnackBar('Paramètres de plafond enregistrés');
      } catch (err) {
        this.snackBarService.showSnackBar(
          "Une erreur est survenue lors de l'enregistrement des paramètres de plafond"
        );
        console.log(err);
      }

      delete data.selectedCategory;
    }

    if (this.organisationServiceId) {
      this.updateOrganisationService(this.organisationServiceId, data);
    } else {
      this.createOrganisationService(
        data,
        this.organization.id,
        this.service.id
      );
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
    console.log('event', event);
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
}
export enum EAmountUnit {
  Fixed = 'Fixed',
  Percentage = 'Percentage',
}
export enum ERrefundDurationUnit {
  Day = 'Day',
  Month = 'Month',
}
