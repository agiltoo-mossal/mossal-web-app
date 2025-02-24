import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { lastValueFrom, switchMap } from 'rxjs';
import { CreateEventComponent } from 'src/app/shared/components/create-event/create-event.component';
import {
  ActivateEventGQL,
  AmountUnit,
  CategorySociopro,
  CategorySocioproService,
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
  OrganisationServiceInput,
  Organization,
  Service,
  UpdateCategorySocioproServiceGQL,
  UpdateEventGQL,
  UpdateOrganisationServiceGQL,
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
  events = [];

  // Onglet actif
  activeTab: string = 'Paramètres Généraux';
  listCategorieService: Partial<CategorySocioproService>[] = [];

  // Données pour les paramètres

  categories: Partial<CategorySociopro & { error: boolean }>[] = [];
  selectedCategorie: any;

  organization: Organization;

  organisationServiceId: string;
  info: Partial<OrganisationService & { categorySociopro: CategorySociopro[] }>;
  dataForm: any;
  activated: boolean = true;
  selectedCategory: string;

  constructor(
    private dialog: MatDialog,
    private listCategorieGQL: FetchCategorySocioprosGQL,
    private createEventGQL: CreateEventGQL,
    private fetchCurrentAdminGQL: FetchCurrentAdminGQL,
    private fetchAllEvents: FetchEventsGQL,
    private createCategorySocioproServiceGQL: CreateCategorySocioproServiceGQL,
    private snackBarService: SnackBarService,
    private defineService: CreateOrganistionServiceGQL,
    private updateDefineService: UpdateOrganisationServiceGQL,
    private deleteEventGQL: DeleteEventGQL,
    private activateEvent: ActivateEventGQL,
    private desactiveEvent: DesactiveEventGQL,
    private updateEventGQL: UpdateEventGQL,
    private updateCategorySocioproServiceGQL: UpdateCategorySocioproServiceGQL,

    private fetchOrganisationServiceByOrganisationIdAndServiceIdGQL: FetchOrganisationServiceByOrganisationIdAndServiceIdGQL // private fetchEventGQL: FetchAllEventGQL
  ) {}

  async ngOnInit() {
    this.organization = (await lastValueFrom(this.fetchCurrentAdminGQL.fetch()))
      .data.fetchCurrentAdmin.organization as Organization;

    this.fetchOrganisationServiceByOrganisationIdAndServiceIdGQL
      .fetch({
        organisationId: this.organization.id,
        serviceId: this.service.id,
      })
      .subscribe({
        next: (response) => {
          this.organisationServiceId =
            response.data.fetchOrganisationServiceByOrganisationIdAndServiceId.id;
          this.activated =
            response?.data?.fetchOrganisationServiceByOrganisationIdAndServiceId?.activated;
          this.info = response.data
            .fetchOrganisationServiceByOrganisationIdAndServiceId as Partial<
            OrganisationService & { categorySociopro: CategorySociopro[] }
          >;
          this.dataForm = this.info;
          console.log('event-setting', this.info);

          this.listCategorieService = [
            {
              amount: this.info.amount,
              amountUnit: this.info.amountUnit,
              refundDuration: this.info.refundDuration,
              refundDurationUnit: this.info.refundDurationUnit,
              activated: this.info.activated,
              activatedAt: this.info.activatedAt,
              autoValidate: this.info.autoValidate,
              categorySociopro: {
                title: 'Paramètres généraux',
              } as any,
            },
          ];
          this.selectedCategorie = this.listCategorieService[0] as any;
          this.listCategorieService = [
            ...this.listCategorieService,
            ...(this.info?.categoriesocioproservices || []),
          ];
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
          this.events = response.data.fetchEvents.results.map((event) => {
            return {
              ...event,
              startDate: new Date(event.startDate).toISOString().split('T')[0],
              endDate: new Date(event.endDate).toISOString().split('T')[0],
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

          this.categories = [...this.categories];
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
  onChangeCategorie(event: Event) {
    const temp = [...this.listCategorieService];
    const cate = this.categories.find(
      (item) => item?.id == this.selectedCategory
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
        this.categories.find((item) => item?.id == this.selectedCategory)?.id ||
        '',
      categorySociopro: this.categories.find(
        (item) => item?.id == this.selectedCategory
      ),
      refundDuration: 1,
      refundDurationUnit: DurationUnit.Month,
      activatedAt: null,
    } as any);

    this.listCategorieService = temp;
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
   * Sauvegarde les paramètres globaux
   */
  saveSettings(): void {
    // Valider les données avant de sauvegarder
    if (!this.dataForm) {
      return;
    }
    if (
      this.selectedCategorie.categorySociopro.title == 'Paramètres généraux'
    ) {
      if (this.organisationServiceId) {
        this.updateSettingOrganistion(this.organisationServiceId, {
          ...this.dataForm,
        });
      } else {
        this.createSettingOrganisation(
          this.organization.id,
          {
            ...this.dataForm,
          },
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
              ...this.dataForm,
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
              ...this.dataForm,
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

      // creer les categories socio pro service
    }
  }
  createSettingOrganisation(
    organisationId: string,
    organisationServiceInput: OrganisationServiceInput,
    serviceId: string
  ) {
    this.defineService
      .mutate({
        organisationId,
        organisationServiceInput,
        serviceId,
      })
      .subscribe({
        next: (response) => {
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
  updateSettingOrganistion(
    organisationServiceId: string,
    organisationServiceInput: OrganisationServiceInput
  ) {
    this.updateDefineService
      .mutate({
        organisationServiceId: this.organisationServiceId,
        organisationServiceInput: {
          ...this.dataForm,
        },
      })
      .subscribe({
        next: (response) => {
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

  onServiceActivationChange($event) {
    // this.dataForm.activated = $event;

    this.activated = $event;
    this.activeService.emit({
      isActive: $event,
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

  changeStatusEvent(
    status: boolean,
    event: {
      id: string;
      title: string;
    }
  ) {
    if (status) {
      this.activateEvent.mutate({ eventId: event.id }).subscribe({
        next: (response) => {
          this.snackBarService.showSnackBar('Événement activé avec succès');
          this.events = this.events.map((e) => {
            if (e.id === event.id) {
              return {
                ...e,
                activated: true,
              };
            }
            return e;
          });
        },
        error: (err) => {
          this.snackBarService.showSnackBar('Une erreur est survenue');
          console.log(err);
        },
      });
    } else {
      this.desactiveEvent.mutate({ eventId: event.id }).subscribe({
        next: (response) => {
          this.snackBarService.showSnackBar('Événement désactivé avec succès');
          this.events = this.events.map((e) => {
            if (e.id === event.id) {
              return {
                ...e,
                activated: false,
              };
            }
            return e;
          });
        },
        error: (err) => {
          this.snackBarService.showSnackBar('Une erreur est survenue');
          console.log(err);
        },
      });
    }
  }

  createOrganizationService() {}

  onTabChange(event: MatTabChangeEvent) {
    this.selectedCategorie = this.listCategorieService[event.index];
  }
  onSettingChange($event) {
    console.log($event);

    this.dataForm = $event.dataForm;
  }
}
