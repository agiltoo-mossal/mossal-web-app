import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { lastValueFrom } from 'rxjs';
import { SnackBarService } from 'src/app/shared/services/snackbar.service';
import {
  AmountUnit,
  CategorySociopro,
  CreateCategorySocioproServiceGQL,
  CreateOrganistionServiceGQL,
  FetchCategorySocioprosGQL,
  FetchCurrentAdminGQL,
  FetchOrganisationServiceByOrganisationIdAndServiceIdGQL,
  FetchServicesGQL,
  Organization,
  Service,
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

  // Pourcentage ou montant fixe
  isPercentage: boolean = true; // Par défaut, "Pourcentage" est sélectionné
  reimbursementPercentage: number = 30; // Valeur par défaut pour le pourcentage
  organization: Organization;
  @Input() service: Partial<Service>;

  /**
   * Méthode appelée pour ajouter une nouvelle catégorie
   */
  constructor(
    private listCategorieGQL: FetchCategorySocioprosGQL,
    private defineService: CreateOrganistionServiceGQL,
    private fetchCurrentAdminGQL: FetchCurrentAdminGQL,
    private fb: FormBuilder,
    private snackBarService: SnackBarService,
    private createCategorySocioproServiceGQL: CreateCategorySocioproServiceGQL,
    private listService: FetchServicesGQL,
    private organizationService: FetchOrganisationServiceByOrganisationIdAndServiceIdGQL
  ) {}

  async ngOnInit() {
    this.emergencyForm = this.fb.group({
      activated: [true],
      activatedAt: ['', Validators.required],
      selectedCategory: ['', Validators.required],
      amountUnit: [AmountUnit.Percentage],
      reimbursementPercentage: [0, [, Validators.min(0), Validators.max(100)]],
      autoValidate: [false],
    });
    this.organization = (await lastValueFrom(this.fetchCurrentAdminGQL.fetch()))
      .data.fetchCurrentAdmin.organization as Organization;

    this.fetchCurrentAdminGQL.fetch().subscribe({
      next: (response) => {
        if (response.data.fetchCurrentAdmin) {
          this.organization = response.data.fetchCurrentAdmin
            .organization as Organization;
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
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
            console.log('data', data);

            this.emergencyForm.patchValue({
              activated: data.activated,
              activatedAt: data.activatedAt,
              amountUnit: data.amountUnit,
              //A enlever apres les tests
              reimbursementPercentage: 30,
              autoValidate: data.autoValidate,
              // amountType: data?.amountUnit || AmountUnit.Percentage,
              // selectedCategory: data.categorySociopro.id,
            });
            this.emergencyForm.get('reimbursementPercentage').setValue(30);
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
  onSubmit(): void {
    console.log(this.emergencyForm.value);

    if (this.emergencyForm.valid) {
      const data = {
        ...this.emergencyForm.value,
        amountUnit: this.isPercentage
          ? EAmountUnit.Percentage
          : EAmountUnit.Fixed,
        amount: this.emergencyForm.value.reimbursementPercentage * 20000,
        activationDurationDay: 30,
        refundDurationUnit: ERrefundDurationUnit.Day,
        refundDuration: this.service.refundDurationMonth,
      };
      delete data.isPercentage;
      delete data.isFixed;
      delete data.reimbursementPercentage;
      if (data.selectedCategory) {
        this.createCategorySocioproServiceGQL
          .mutate({
            categorySocioproId: data.selectedCategory,
            categorySocioproServiceInput: {
              amount: 200000,
              amountUnit: data.amountUnit,
              // refundDurationUnit: ERrefundDurationUnit.Day,
              refundDuration: this.service.refundDurationMonth,
              autoValidate: data.autoValidate,
              activated: data.activated,
            },
            organisationServiceId: this.organization.organisationService.find(
              (item) => item.serviceId === this.service.id
            )?.id,
          })
          .subscribe({
            next: (response) => {
              console.log(response);
              this.snackBarService.showSnackBar(
                'Paramètres de plafond enregistrés'
              );
            },
            error: (err) => {
              this.snackBarService.showSnackBar('Une erreur est survenue');
              console.log(err);
            },
          });

        delete data.selectedCategory;
      }
      console.log(data);

      this.defineService
        .mutate({
          organisationId: this.organization.id,
          serviceId: this.service.id,
          organisationServiceInput: data,
        })
        .subscribe({
          next: (response) => {
            console.log(response);
            this.snackBarService.showSnackBar(
              'Paramètres de plafond enregistrés'
            );
          },
          error: (err) => {
            this.snackBarService.showSnackBar('Une erreur est survenue');
            console.log(err);
          },
        });
      console.log(this.emergencyForm.value);
    }
  }
  onToggle(event) {
    console.log('event', event);
    this.emergencyForm.get('autoValidate').setValue(event);
  }
  onServiceActivationChange(isActive: boolean) {
    console.log('isActive', isActive);

    this.emergencyForm.get('activated').setValue(isActive);
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
