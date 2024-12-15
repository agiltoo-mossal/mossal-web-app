import { Component, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { SnackBarService } from 'src/app/shared/services/snackbar.service';
import {
  CategorySociopro,
  CreateCategorySocioproGQL,
  DeleteCategorySocioproGQL,
  FetchCategorySocioprosGQL,
  FetchCurrentAdminGQL,
  Organization,
  UpdateCategorySocioproGQL,
  UpdateOrganizationGQL,
} from 'src/graphql/generated';

@Component({
  selector: 'app-organization-setting-general',

  templateUrl: './organization-setting-general.component.html',
  styleUrl: './organization-setting-general.component.scss',
})
export class OrganizationSettingGeneralComponent {
  form: any;
  @Input() serviceId: string;
  firstDayOfCurrentMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    1
  );
  lastDayOfCurrentMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    0
  );
  itemsCardDate: { day: number; active: boolean; pending: boolean }[] = [];
  organization: Organization;

  constructor(
    private snackBarService: SnackBarService,
    private fetchCurrentAdminGQL: FetchCurrentAdminGQL,
    private updateOrganizationGQL: UpdateOrganizationGQL,
    private categorieGQL: CreateCategorySocioproGQL,
    private listCategorieGQL: FetchCategorySocioprosGQL,
    private updateCategorieGQL: UpdateCategorySocioproGQL,
    private deleteCategoryGQL: DeleteCategorySocioproGQL
  ) {}
  // Données pour les catégories
  newCategorie: string = '';
  maxPercentage: number = 0;
  categories: Partial<CategorySociopro & { error: boolean }>[] = [];
  errorMessage: string = '';
  dayLimite!: number;

  ngOnInit() {
    this.getCurrentorganization();
    this.generateCardItems();
    this.listCategorieGQL
      .fetch({
        queryConfig: {
          limit: 10,
        },
      })
      .subscribe({
        next: (result) => {
          console.log(result.data.fetchCategorySociopros);
          this.categories = result.data.fetchCategorySociopros.results.map(
            (categorie) => ({
              ...categorie,
              error: false,
            })
          );
        },
      });
  }

  addCategorie(): void {
    if (this.newCategorie.trim() === '') {
      this.errorMessage = 'Le nom de la catégorie est obligatoire.';
      return;
    }
    this.categorieGQL
      .mutate({
        categorySocioproInput: {
          title: this.newCategorie,
        },
        organizationId: this.organization.id,
      })
      .subscribe({
        next: (result) => {
          if (result.data.createCategorySociopro) {
            this.snackBarService.showSuccessSnackBar(
              'NOUVELLE CATEGORIE AJOUTEE'
            );
            this.categories.push({
              title: result.data.createCategorySociopro.title,
            });
            this.newCategorie = '';
            this.errorMessage = '';
          } else {
            this.snackBarService.showErrorSnackBar();
          }
        },
        error: (error) => {
          this.snackBarService.showErrorSnackBar();
        },
      });
  }
  savePlafond() {}

  editCategorie(index: number): void {
    const categorie = this.categories[index];
    this.updateCategorieGQL
      .mutate({
        categorySocioproId: categorie.id,
        categorySocioproInput: {
          title: categorie.title,
        },
      })
      .subscribe({
        next: (result) => {
          if (result.data.updateCategorySociopro) {
            this.snackBarService.showSuccessSnackBar('CATEGORIE MODIFIEE');
          } else {
            this.snackBarService.showErrorSnackBar();
          }
        },
        error: (error) => {
          this.snackBarService.showErrorSnackBar();
        },
      });
  }
  getCurrentorganization(useCache = true) {
    this.fetchCurrentAdminGQL
      .fetch({}, { fetchPolicy: 'no-cache' })
      .subscribe((result) => {
        if (result.data) {
          this.organization = result.data.fetchCurrentAdmin
            .organization as Organization;
          console.log({ org: this.organization });
          this.maxPercentage = this.organization.amountPercent;
          // this.form.patchValue(this.organization);
          this.itemsCardDate.forEach((element) => {
            element.active = false;
            if (element.day === this.organization.demandeDeadlineDay) {
              element.active = true;
            }
          });
        }
      });
  }
  deleteCategorie(index: number): void {
    this.deleteCategoryGQL
      .mutate({
        categorySocioproId: this.categories[index].id,
      })
      .subscribe({
        next: (result) => {
          if (result.data.deleteCategorySociopro) {
            this.snackBarService.showSuccessSnackBar('CATEGORIE SUPPRIMEE');
            this.categories.splice(index, 1);
          } else {
            this.snackBarService.showErrorSnackBar();
          }
        },
        error: (error) => {
          this.snackBarService.showErrorSnackBar();
        },
      });
  }

  getDateTime(item: any): string {
    return `${this.lastDayOfCurrentMonth.getFullYear()}-${
      this.lastDayOfCurrentMonth.getMonth() + 1
    }-${item.day}`;
  }
  setDate(item: number) {
    this.dayLimite = item;
    this.itemsCardDate.forEach((element) => {
      element.pending = false;
    });
    this.itemsCardDate[item - 1].pending = true;
    this.dayLimite = item;
  }
  updateDateLimit() {
    this.updateOrganizationGQL
      .mutate({
        organizationId: this.organization.id,
        organizationInput: {
          demandeDeadlineDay: this.dayLimite,
        } as any,
      })
      .subscribe({
        next: (result) => {
          if (result.data.updateOrganization) {
            this.snackBarService.showSuccessSnackBar(
              'DATE LIMITE DES DEMANDES EST MODIFIEE'
            );
            this.itemsCardDate.forEach((item) => {
              item.pending = false;
              item.active = false;
            });
            this.itemsCardDate[this.dayLimite - 1].active = true;
          } else {
            this.snackBarService.showErrorSnackBar();
          }
        },
        error: (error) => {
          this.snackBarService.showErrorSnackBar();
        },
      });
  }
  generateCardItems() {
    for (let index = 1; index <= 28; index++) {
      const daySelected = {
        day: index,
        active: false,
        pending: false,
      };

      this.itemsCardDate.push(daySelected);
    }
  }
}
