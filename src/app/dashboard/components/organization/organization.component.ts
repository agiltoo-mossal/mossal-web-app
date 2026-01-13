import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { SnackBarService } from 'src/app/shared/services/snackbar.service';
import {
  ActivateOrganisationServiceGQL,
  DesactivateOrganisationServiceGQL,
  FetchCurrentAdminGQL,
  FetchServicesGQL,
  Organization,
  Service,
  UpdateOrganizationGQL,
} from 'src/graphql/generated';

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.scss'],
})
export class OrganizationComponent {
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
  listServices: Partial<Service>[] = [];
  selectedService: Partial<Service> = {};
  itemsCardDate: { day: number; active: boolean; pending: boolean }[] = [];
  password: boolean = true;
  newPassword: boolean = true;
  ConfirmPassword: boolean = true;
  toggleMailActivation: boolean = false;
  form: FormGroup;
  updatePasswordForm: FormGroup;
  passwordNotEqual = false;
  isLoading = false;
  organization: Organization;
  dayLimite!: number;

  constructor(
    private fb: FormBuilder,
    private snackBarService: SnackBarService,
    private fetchCurrentAdminGQL: FetchCurrentAdminGQL,
    private updateOrganizationGQL: UpdateOrganizationGQL,
    private listService: FetchServicesGQL,
    private activeOrganizationService: ActivateOrganisationServiceGQL,
    private desactiveOrganizationService: DesactivateOrganisationServiceGQL
  ) {


    this.getCurrentorganization();
    this.generateCardItems();
  }
  ngOnInit(): void {
    this.listService.fetch().subscribe({
      next: (response) => {
        this.listServices = response.data.fetchServices.results;
        this.listServices = [
          { id: 'djkkdsj', title: 'général', description: 'général' },
          ...this.listServices,
        ];
        this.selectedService = this.listServices[0];
      },
      error: (err) => { },
    });
  }
  get name() {
    return this.form.get('name');
  }

  getCurrentorganization(useCache = true) {
    this.fetchCurrentAdminGQL
      .fetch({}, { fetchPolicy: 'no-cache' })
      .subscribe((result) => {
        if (result.data) {
          this.organization = result.data.fetchCurrentAdmin
            .organization as Organization;
          console.log({ org: this.organization });
          this.form.patchValue(this.organization);
          this.itemsCardDate.forEach((element) => {
            element.active = false;
            if (element.day === this.organization.demandeDeadlineDay) {
              element.active = true;
            }
          });
        }
      });
  }
  onServiceActivationChange(data: {
    isActive: boolean;
    organisationServiceId: string;
  }) {
    if (data.isActive) {
      this.activeOrganizationService
        .mutate({ organisationServiceId: data.organisationServiceId })
        .subscribe({
          next: (result) => {
            if (result.data.activateOrganisationService) {
              this.snackBarService.showSuccessSnackBar(
                'Service activé avec succès'
              );
            } else {
              this.snackBarService.showErrorSnackBar();
            }
          },
          error: (error) => {
            this.snackBarService.showErrorSnackBar();
          },
        });
    } else {
      this.desactiveOrganizationService
        .mutate({ organisationServiceId: data.organisationServiceId })
        .subscribe({
          next: (result) => {
            if (result.data.deactivateOrganisationService) {
              this.snackBarService.showSuccessSnackBar(
                'Service désactivé avec succès'
              );
            } else {
              this.snackBarService.showErrorSnackBar();
            }
          },
          error: (error) => {
            this.snackBarService.showErrorSnackBar();
          },
        });
    }
  }

  updateOrganization() {
    console.log(this.form.invalid);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.value;
    this.updateOrganizationGQL
      .mutate({
        organizationId: this.organization.id,
        organizationInput: value,
      })
      .subscribe(
        (result) => {
          if (result.data.updateOrganization) {
            this.snackBarService.showSuccessSnackBar(
              'Organization modifié avec succès'
            );
          } else {
            this.snackBarService.showErrorSnackBar();
          }
        },
        (error) => {
          this.snackBarService.showErrorSnackBar();
        }
      );
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

  onTabChange(event: MatTabChangeEvent) {
    this.selectedService = this.listServices[event.index];
  }
}
