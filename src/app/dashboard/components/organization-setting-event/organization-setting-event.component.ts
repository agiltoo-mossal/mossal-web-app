import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { lastValueFrom, switchMap } from 'rxjs';
import { CreateEventComponent } from 'src/app/shared/components/create-event/create-event.component';
import {
  ActivateEventGQL,
  AmountUnit,
  CategorySociopro,
  CreateCategorySocioproServiceGQL,
  CreateEventGQL,
  CreateOrganistionServiceGQL,
  DeleteEventGQL,
  DesactiveEventGQL,
  DurationUnit,
  EventInput,
  FetchCategorySocioprosGQL,
  FetchCurrentAdminGQL,
  FetchEventsGQL,
  FetchOrganisationServiceByOrganisationIdAndServiceIdGQL,
  FetchServicesGQL,
  OrganisationService,
  Organization,
  Service,
  UpdateEventGQL,
} from 'src/graphql/generated';
import {
  EAmountUnit,
  ERrefundDurationUnit,
} from '../organization-setting-emergency/organization-setting-emergency.component';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { SnackBarService } from 'src/app/shared/services/snackbar.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-organization-setting-event',
  templateUrl: './organization-setting-event.component.html',
  styleUrl: './organization-setting-event.component.scss',
})
export class OrganizationSettingEventComponent {
  // Données pour les événements
  @Input() service: Partial<Service>;
  @Output() activeService: EventEmitter<{
    isActive: boolean;
    organisationServiceId: string;
  }> = new EventEmitter<{
    isActive: boolean;
    organisationServiceId: string;
  }>();

  constructor(
    private dialog: MatDialog,
    private listCategorieGQL: FetchCategorySocioprosGQL,
    private createEventGQL: CreateEventGQL,
    private fetchCurrentAdminGQL: FetchCurrentAdminGQL,
    private fetchAllEvents: FetchEventsGQL,
    private createCategorySocioproServiceGQL: CreateCategorySocioproServiceGQL,
    private snackBarService: SnackBarService,
    private defineService: CreateOrganistionServiceGQL,
    private deleteEventGQL: DeleteEventGQL,
    private activateEvent: ActivateEventGQL,
    private desactiveEvent: DesactiveEventGQL,
    private updateEventGQL: UpdateEventGQL,

    private fetchOrganisationServiceByOrganisationIdAndServiceIdGQL: FetchOrganisationServiceByOrganisationIdAndServiceIdGQL // private fetchEventGQL: FetchAllEventGQL
  ) {}
  newEvents: {
    title: string;
    startDate: string;
    endDate: string;
    description?: string;
    isActive?: boolean;
  }[] = [];
  events = [];

  // Onglet actif
  activeTab: string = 'Paramètres Généraux';

  // Données pour les paramètres
  activated: boolean = true;
  isPercentage: boolean = true;
  reimbursementPercentage: number = 30;
  reimbursementDuration: string = '12';
  isAutoValidation: boolean = false;
  categories: Partial<CategorySociopro & { error: boolean }>[] = [];
  selectedCategorie: Partial<CategorySociopro & { error: boolean }>;
  newCategory: string = '';
  isActive: boolean = false;
  amountType: string = '';
  reimbursement: number = 0;
  organization: Organization;
  autoValidate: boolean = false;
  organisationServiceId: string;
  info: Partial<OrganisationService & { categorySociopro: CategorySociopro[] }>;

  async ngOnInit() {
    this.organization = (await lastValueFrom(this.fetchCurrentAdminGQL.fetch()))
      .data.fetchCurrentAdmin.organization as Organization;
    console.log('this.organization', this.organization.id);
    console.log('this.service', this.service.id);

    this.fetchOrganisationServiceByOrganisationIdAndServiceIdGQL
      .fetch({
        organisationId: this.organization.id,
        serviceId: this.service.id,
      })
      .subscribe({
        next: (response) => {
          this.organisationServiceId =
            response.data.fetchOrganisationServiceByOrganisationIdAndServiceId.id;
          console.log('organisationServiceId', this.organisationServiceId);

          this.info = response.data
            .fetchOrganisationServiceByOrganisationIdAndServiceId as Partial<
            OrganisationService & { categorySociopro: CategorySociopro[] }
          >;
          this.isActive = this.info.activated;
          this.amountType = this.info.amountUnit;
          this.reimbursement = this.info.amount;
          this.autoValidate = this.info.autoValidate;
          this.reimbursementPercentage = this.info.amount;
          this.selectedCategorie = this.info?.categorySociopro?.[0];
        },
        error: (error) => {
          console.error(error);
        },
      });
    this.fetchAllEvents
      .fetch({
        queryConfig: {
          limit: 10,
        },
        organizationServiceId: '675b3086d059abbe573a5c16',
      })
      .subscribe({
        next: (response) => {
          console.log('events', response.data.fetchEvents.results);

          this.events = response.data.fetchEvents.results.map((event) => {
            return {
              title: event.title,
              startDate: new Date(event.startDate).toISOString().split('T')[0],
              endDate: new Date(event.endDate).toISOString().split('T')[0],
              // isActive: event.isActive,
              id: event.id,
            };
          });
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
            ,
            ...this.categories,
          ];
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  /**
   * Permet de basculer entre les onglets
   * @param tabName Nom de l'onglet
   */
  switchTab(tabName: string): void {
    this.activeTab = tabName;
  }

  /**
   * Ajoute un nouvel événement à la liste
   */

  /**
   * Supprime un événement de la liste
   * @param index Index de l'événement à supprimer
   */
  deleteEvent(event: {
    id: string;
    title: string;
    startDate: string;
    endDate: string;
  }): void {
    Swal.fire({
      title:
        "Êtes-vous sûr de vouloir supprimer l'événement " + event.title + ' ?',
      showCancelButton: true,
      confirmButtonText: `Supprimer`,
      cancelButtonText: `Annuler`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteEventGQL.mutate({ eventId: event.id }).subscribe({
          next: (response) => {
            this.snackBarService.showSnackBar('Événement supprimé avec succès');
            const eventId = event.id;
            this.events = this.events.filter(
              (event, i) => event.id !== eventId
            );
          },
          error: (err) => {
            this.snackBarService.showSnackBar('Une erreur est survenue');
            console.log(err);
          },
        });
      }
    });
  }
  updateEvent(event: {
    id: string;
    title: string;
    startDate: string;
    endDate: string;
  }): void {
    const dialogRef = this.dialog.open(CreateEventComponent, {
      width: '700px',
      data: {
        title: event.title,
        startDate: new Date(event.startDate),
        endDate: new Date(event.endDate),
      }, // Si des données initiales sont nécessaires
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const formattedStartDate = new Date(result.startDate)
          .toISOString()
          .split('T')[0];
        const formattedEndDate = new Date(result.endDate)
          .toISOString()
          .split('T')[0];

        console.log(result);
        this.updateEventGQL
          .mutate({
            eventInput: {
              title: result?.title,
              startDate: new Date(result.startDate),
              endDate: new Date(result.endDate),
            },
            eventId: event.id,
          })
          .subscribe({
            next: (response) => {
              this.snackBarService.showSnackBar(
                'Événement modifié avec succès'
              );
              const eventId = event.id;
              this.events = this.events.map((event) => {
                if (event.id === eventId) {
                  return {
                    ...event,
                    title: result.title,
                    startDate: formattedStartDate,
                    endDate: formattedEndDate,
                  };
                }
                return event;
              });
            },
            error: (err) => {
              this.snackBarService.showSnackBar('Une erreur est survenue');
              console.log(err);
            },
          });
      }
    });
  }

  /**
   * Met à jour l'état actif/inactif d'un événement
   * @param index Index de l'événement à mettre à jour
   * @param isActive Nouveau statut actif/inactif
   */
  toggleEventStatus(index: number, isActive: boolean): void {
    this.events[index].isActive = isActive;
  }

  /**
   * Sauvegarde les paramètres globaux
   */
  saveSettings(): void {
    // Valider les données avant de sauvegarder
    if (
      this.isPercentage &&
      (this.reimbursementPercentage < 0 || this.reimbursementPercentage > 100)
    ) {
      return;
    }

    this.defineService
      .mutate({
        organisationId: this.organization.id,
        serviceId: this.service.id,
        organisationServiceInput: {
          activated: this.activated,
          amount: this.reimbursement,
          amountUnit: this.isPercentage
            ? AmountUnit.Percentage
            : AmountUnit.Fixed,
        },
      })
      .subscribe({
        next: (response) => {
          console.log(response);
          this.snackBarService.showSnackBar('Paramètres enregistrés');
        },
        error: (err) => {
          console.log(err);
          this.snackBarService.showSnackBar(
            'Une configuration est deja mise en place'
          );
        },
      });
  }
  onServiceActivationChange($event) {
    this.activated = $event;

    this.activeService.emit({
      isActive: this.activated,
      organisationServiceId: this.organisationServiceId,
    });
  }
  createEvent() {
    if (!this.organisationServiceId) {
      this.snackBarService.showSnackBar(
        "Veuillez d'abord créer la configuration"
      );
      return;
    }
    const dialogRef = this.dialog.open(CreateEventComponent, {
      width: '700px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const formattedStartDate = new Date(result.startDate)
          .toISOString()
          .split('T')[0];
        const formattedEndDate = new Date(result.endDate)
          .toISOString()
          .split('T')[0];

        console.log(result);

        this.createEventGQL
          .mutate({
            eventInput: {
              title: result?.title,
              startDate: new Date(result.startDate),
              endDate: new Date(result.endDate),
            },
            organizationServiceId: this.organisationServiceId,
          })
          .subscribe({
            next: (response) => {
              this.snackBarService.showSnackBar('Événement créé avec succès');

              this.events.push({
                title: result.title,
                startDate: formattedStartDate,
                endDate: formattedEndDate,
                isActive: true,
              });
            },
            error: (err) => {
              this.snackBarService.showSnackBar('Une erreur est survenue');
              console.log(err);
            },
          });
      }
    });
  }
  addCategory(): void {
    if (this.newCategory && this.newCategory.trim()) {
    } else {
      // alert('Le nom de la catégorie ne peut pas être vide.');
    }
  }
  handleServiceActivationChange(isActive: boolean) {
    console.log('Service Activation:', isActive);
    this.isActive = isActive;
  }

  handleAmountTypeChange(amountType: string) {
    console.log('Amount Type:', amountType);
    this.amountType = amountType;
  }

  handleReimbursementChange(reimbursement: number) {
    console.log('Reimbursement:', reimbursement);
    this.reimbursement = reimbursement;
  }

  handleValidationChange(isActive: boolean) {
    console.log('Validation:', isActive);
    this.autoValidate = isActive;
  }

  createOrganizationService() {}

  onTabChange(event: MatTabChangeEvent) {
    this.selectedCategorie = this.categories[event.index];
  }
}
