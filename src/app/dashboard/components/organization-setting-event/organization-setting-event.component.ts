import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { lastValueFrom, switchMap } from 'rxjs';
import { CreateEventComponent } from 'src/app/shared/components/create-event/create-event.component';
import {
  CategorySociopro,
  CreateEventGQL,
  EventInput,
  FetchCategorySocioprosGQL,
  FetchCurrentAdminGQL,
  FetchEventsGQL,
  FetchOrganisationServiceByOrganisationIdAndServiceIdGQL,
  FetchServicesGQL,
  Organization,
  Service,
} from 'src/graphql/generated';

@Component({
  selector: 'app-organization-setting-event',
  templateUrl: './organization-setting-event.component.html',
  styleUrl: './organization-setting-event.component.scss',
})
export class OrganizationSettingEventComponent {
  // Données pour les événements
  @Input() serviceId: string;
  constructor(
    private dialog: MatDialog,
    private listCategorieGQL: FetchCategorySocioprosGQL,
    private createEventGQL: CreateEventGQL,
    private fetchCurrentAdminGQL: FetchCurrentAdminGQL,
    private fetchAllEvents: FetchEventsGQL,

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
  isServiceActive: boolean = true;
  isPercentage: boolean = true;
  reimbursementPercentage: number = 30;
  reimbursementDuration: string = '12 mois';
  isAutoValidation: boolean = false;
  categories: Partial<CategorySociopro & { error: boolean }>[] = [];

  newCategory: string = '';
  isActive: boolean = false;
  amountType: string = '';
  reimbursement: number = 0;
  organization: Organization;
  autoValidate: boolean = false;
  organisationServiceId: string;

  ngOnInit() {
    this.fetchCurrentAdminGQL
      .fetch()
      .pipe(
        switchMap((response) => {
          this.organization = response.data.fetchCurrentAdmin
            .organization as Organization;
          console.log('fetching organizationServiceId');
          return this.fetchOrganisationServiceByOrganisationIdAndServiceIdGQL.fetch(
            {
              organisationId: this.organization.id,
              serviceId: '67518fe7ee9f8e91151fe4a3',
            }
          );
        })
      )
      .subscribe({
        next: (response) => {
          console.log('orgServiceId', response);
          console.log('hello');
          this.organisationServiceId =
            response.data.fetchOrganisationServiceByOrganisationIdAndServiceId.id;
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
      })
      .subscribe({
        next: (response) => {
          console.log('events', response);
          this.events = response.data.fetchEvents.results.map((event) => {
            return {
              title: event.title,
              startDate: new Date(event.startDate).toISOString().split('T')[0],
              endDate: new Date(event.endDate).toISOString().split('T')[0],
              // isActive: event.isActive,
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
          console.log('list', this.categories);
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
  addEvent(): void {
    const newEvent = {
      name: `Événement ${this.events.length + 1}`,
      startDate: '',
      endDate: '',
      isActive: false,
    };
    this.events.push(newEvent);
  }

  /**
   * Supprime un événement de la liste
   * @param index Index de l'événement à supprimer
   */
  deleteEvent(index: number): void {
    if (confirm('Voulez-vous vraiment supprimer cet événement ?')) {
      this.events.splice(index, 1);
    }
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
      alert('Le pourcentage doit être compris entre 0 et 100.');
      return;
    }

    // Afficher un message de confirmation
    console.log('Service activé :', this.isServiceActive);
    console.log(
      'Type de remboursement :',
      this.isPercentage ? 'Pourcentage' : 'Montant fixe'
    );
    console.log('Pourcentage :', this.reimbursementPercentage);
    console.log('Durée :', this.reimbursementDuration);
    console.log('Validation automatique :', this.isAutoValidation);
    alert('Paramètres sauvegardés avec succès.');
  }

  createEvent() {
    const dialogRef = this.dialog.open(CreateEventComponent, {
      width: '800px',
      data: {}, // Si des données initiales sont nécessaires
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const formattedStartDate = new Date(result.startDate)
          .toISOString()
          .split('T')[0];
        const formattedEndDate = new Date(result.endDate)
          .toISOString()
          .split('T')[0];

        this.newEvents.push({
          title: result.name,
          startDate: formattedStartDate,
          endDate: formattedEndDate,
          isActive: true,
        });
        this.createEventGQL
          .mutate({
            eventInput: {
              title: result?.name,
              startDate: new Date(result.startDate),
              endDate: new Date(result.endDate),
            },
            organizationServiceId: this.organisationServiceId,
          })
          .subscribe({
            next: (response) => {
              console.log(response);
            },
            error: (err) => {
              console.log(err);
            },
          });

        this.events.push({
          name: result.name,
          startDate: formattedStartDate,
          endDate: formattedEndDate,
          isActive: true,
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
  }

  handleAmountTypeChange(amountType: string) {
    console.log('Amount Type:', amountType);
  }

  handleReimbursementChange(reimbursement: number) {
    console.log('Reimbursement:', reimbursement);
  }

  handleValidationChange(isActive: boolean) {
    console.log('Validation:', isActive);
  }

  createOrganizationService() {}
}
