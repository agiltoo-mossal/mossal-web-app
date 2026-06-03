import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { lastValueFrom, map, switchMap } from 'rxjs';
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
  Event,
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
import { ActivationService } from '../organization/activation.service';

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
  eventSelectedId: string;

  // Onglet actif
  activeTab: string = 'Paramètres Généraux';
  listCategorieService: Partial<CategorySocioproService>[] = [];
  tempListCategoryServices: Partial<CategorySocioproService>[] = [];
  listCategorieServiceEvent: Partial<CategorySocioproService>[] = [];
  // Données pour les paramètres

  categories: Partial<CategorySociopro & { error: boolean }>[] = [];
  selectedCategorie: any;

  organization: Organization;
  disableButton: boolean = false; // Par défaut, le bouton de sauvegarde est désactivé
  showLineEvent = true;
  showComponent = false;
  organisationServiceId: string;
  info: Partial<OrganisationService & { categorySociopro: CategorySociopro[] }>;
  dataForm: any;
  activated: { value?: boolean } = { value: true };
  selectedCategory: string;
  dataEvent: Event;
  pendingEventStatusChanges: Map<string, boolean> = new Map();
  originalActivated: boolean;
  @ViewChild(CreateEventComponent) createEventComp: CreateEventComponent;

  constructor(
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
    private cdr: ChangeDetectorRef, // Inject ChangeDetectorRef

    private fetchOrganisationServiceByOrganisationIdAndServiceIdGQL: FetchOrganisationServiceByOrganisationIdAndServiceIdGQL // private fetchEventGQL: FetchAllEventGQL
  ) { }

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
            response.data.fetchOrganisationServiceByOrganisationIdAndServiceId?.id;
          this.activated.value =
            response?.data?.fetchOrganisationServiceByOrganisationIdAndServiceId?.activated;
          this.originalActivated = this.activated.value;

          this.info = response.data
            .fetchOrganisationServiceByOrganisationIdAndServiceId as Partial<
              OrganisationService & { categorySociopro: CategorySociopro[] }
            >;
          this.dataForm = this.info;
          if (this.info) {
            this.fetchEvents(this.organisationServiceId);
          } else {
            this.activated.value = true;
          }
          this.listCategorieService = [];
          this.tempListCategoryServices = this.listCategorieService;
          this.selectedCategorie = this.listCategorieService[0] as any;
        },
        error: (error) => {
          console.error(error);
        },
      });

    this.listCategorieGQL
      .fetch(
        {
          queryConfig: {
            limit: 10,
          },
        },
        {
          fetchPolicy: 'no-cache',
        }
      )
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

  get activeEventInRange(): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return this.events.some((event) => {
      if (!event.activated) return false;
      const start = new Date(event.startDate);
      const end = new Date(event.endDate);
      end.setHours(23, 59, 59, 999);
      return start <= today && today <= end;
    });
  }

  /**
   * Permet de basculer entre les onglets
   * @param tabName Nom de l'onglet
   */
  switchTab(tabName: string): void {
    this.activeTab = tabName;
  }
  eventToCreate: any;
  handleEvent(event: { action: string; event: Event }) {
    if (event.action === 'cancel') {
      this.showLineEvent = true;
      this.showComponent = false;
      this.dataEvent = null;
      return;
    }
    if (!this.organisationServiceId) {
      this.snackBarService.showSnackBar(
        "Veuillez d'abord créer la configuration sur paramètres généraux"
      );
      return;
    }
    delete event.event.id;

    const formattedStartDate = new Date(event.event.startDate)
      .toISOString()
      .split('T')[0];
    const formattedEndDate = new Date(event.event.endDate)
      .toISOString()
      .split('T')[0];

    const { event: eventToSave } = event;

    if (event.action == 'Modifier') {
      this.events = this.events.map((e) => {
        if (e.id === this.eventSelectedId) {
          return {
            ...e,
            title: eventToSave.title,
            startDate: formattedStartDate,
            endDate: formattedEndDate,
          };
        }
        return e;
      });
    } else {
      this.events.unshift({
        ...eventToSave,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        activated: true,
      });
      this.listCategorieService = [
        {
          amount: 0,
          amountUnit: AmountUnit.Fixed,
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
      if (!this.dataForm) {
        const { categorySociopro, ...defaults } = this.listCategorieService[0] as any;
        this.dataForm = defaults;
      }
      this.disableButton = true;
    }
    this.showLineEvent = true;
    this.showComponent = false;
    this.eventToCreate = eventToSave;
  }
  fetchEvents(organizationServiceId: string) {
    this.fetchAllEvents
      .fetch(
        {
          queryConfig: {
            limit: 10,
          },
          organizationServiceId,
        },
        {
          fetchPolicy: 'no-cache',
        }
      )
      .subscribe({
        next: (response) => {
          this.events = response.data.fetchEvents.results.map((event) => {
            return {
              ...event,
              startDate: new Date(event.startDate).toISOString().split('T')[0],
              endDate: new Date(event.endDate).toISOString().split('T')[0],
            };
          });
          console.log('events', this.events);
        },
        error: (err) => {
          console.log(err);
        },
      });
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
            this.eventSelectedId = '';
            // this.listCategorieService = [];
          },
          error: (err) => {
            this.snackBarService.showSnackBar('Une erreur est survenue');
            console.log(err);
          },
        });
      }
    });
  }
  onChangeCategorie(event: any) {
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
    if (!this.eventSelectedId) {
      this.snackBarService.showSnackBar(
        'Veuillez enregistrer les paramètres généraux avant d ajouter une catégorie'
      );
      return;
    }
    /* if (!this.organisationServiceId) {
      this.snackBarService.showSnackBar(
        'Veuillez enregistrer les paramètres avant d ajouter une catégorie'
      );
      return;
    } */

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
  updateEvent(event: any): void {
    this.eventSelectedId = event.id;
    this.dataForm = this.events.find((e) => e.id === event.id) || event;
    this.listCategorieService = [
      {
        amount: event.amount,
        amountUnit: event.amountUnit,
        refundDuration: event.refundDuration,
        refundDurationUnit: event.refundDurationMonth,
        activated: event.activated,
        activatedAt: event.activatedAt,
        autoValidate: event.autoValidate,
        categorySociopro: { title: 'Paramètres généraux' } as any,
      },
      ...(event.categorySocioproServices || []),
    ];
    this.selectedCategorie = this.listCategorieService[0];
    this.dataEvent = event;
    this.showLineEvent = false;
    this.showComponent = true;
    this.disableButton = true;
  }

  /**
   * Sauvegarde les paramètres globaux
   */
  async saveSettings() {
    // 1. Activation du service si changée
    if (this.organisationServiceId && this.activated.value !== this.originalActivated) {
      this.updateDefineService
        .mutate({
          organisationServiceId: this.organisationServiceId,
          organisationServiceInput: { activated: this.activated.value },
        })
        .subscribe({
          next: () => { this.originalActivated = this.activated.value; },
          error: (err) => {
            this.snackBarService.showSnackBar(err?.message || 'Erreur lors de la mise à jour du service');
          },
        });
    }

    // 2. Statuts d'événements en attente
    for (const [eventId, status] of this.pendingEventStatusChanges) {
      const mutation$ = (status
        ? this.activateEvent.mutate({ eventId })
        : this.desactiveEvent.mutate({ eventId })) as any;
      await lastValueFrom(mutation$).catch((err) =>
        this.snackBarService.showSnackBar(err?.message || 'Erreur lors de la mise à jour de l\'événement')
      );
    }
    this.pendingEventStatusChanges.clear();

    // 3. Paramètres de l'onglet sélectionné
    if (!this.selectedCategorie) {
      this.disableButton = false;
      return;
    }

    console.log('dataForm', this.dataForm);
    if (
      this.selectedCategorie.categorySociopro.title == 'Paramètres généraux'
    ) {
      if (this.eventSelectedId) {
        if (this.showComponent && this.createEventComp?.eventForm?.valid) {
          const fv = this.createEventComp.eventForm.getRawValue();
          this.eventToCreate = { title: fv.title, startDate: fv.startDate, endDate: fv.endDate };
          const fmt = (d: any) => new Date(d).toISOString().split('T')[0];
          this.events = this.events.map((e) =>
            e.id === this.eventSelectedId
              ? { ...e, title: fv.title, startDate: fmt(fv.startDate), endDate: fmt(fv.endDate) }
              : e
          );
          this.showComponent = false;
          this.showLineEvent = true;
        }

        const {
          __typename,
          id,
          activationDurationDay,
          organizationId,
          serviceId,
          service,
          organization,
          categoriesocioproservices,
          organisationService,
          createdAt,
          updatedAt,
          categorySocioproServices,
          events,
          ...dataForm
        } = this.dataForm;
        this.dataForm = { ...dataForm };
        console.log('dataForm des', this.dataForm);

        this.updateEventGQL
          .mutate({
            eventId: this.eventSelectedId,
            eventInput: {
              ...this.dataForm,
              ...this.eventToCreate,
            },
          })
          .subscribe({
            next: (response) => {
              this.snackBarService.showSnackBar('Paramètres enregistrés');
              this.eventToCreate = null;
            },
            error: (err) => {
              this.snackBarService.showSnackBar(
                err.message || 'Une erreur est survenue'
              );
            },
          });
      } else {
        const {
          __typename,
          id,
          activationDurationDay,
          organizationId,
          serviceId,
          service,
          organization,
          categoriesocioproservices,
          organisationService,
          createdAt,
          updatedAt,
          categorySocioproServices,
          events,
          categorySociopro,
          ...cleanDataForm
        } = (this.dataForm || {}) as any;

        this.createEventGQL
          .mutate({
            eventInput: {
              ...cleanDataForm,
              ...this.eventToCreate,
            },
            organizationServiceId: this.organisationServiceId,
          })
          .subscribe({
            next: (response) => {
              this.snackBarService.showSnackBar('Paramètres enregistrés');
              const createdEvent = response.data.createEvent;
              this.organisationServiceId = createdEvent.organisationService.id;
              this.eventSelectedId = createdEvent.id;
              const noIdIdx = this.events.findIndex((e) => !e.id);
              if (noIdIdx !== -1) {
                this.events[noIdIdx] = { ...this.events[noIdIdx], id: createdEvent.id };
              }
            },
            error: () => {
              this.snackBarService.showSnackBar('Une erreur est survenue');
            },
          });

        // if (this.organisationServiceId) {
        //   this.updateSettingOrganistion(this.organisationServiceId, {
        //     ...this.dataForm,
        //   });
        // } else {
        //   this.createSettingOrganisation(
        //     this.organization.id,
        //     {
        //       ...this.dataForm,
        //     },
        //     this.service.id
        //   );
        // }
      }
    } else {
      let selectedUpdate = this.listCategorieService.find(
        (item) =>
          item?.id === this.selectedCategorie?.id &&
          item?.id &&
          this.selectedCategorie?.id
      );
      const tempObjectInput: {
        categorySocioproId: string;
        categorySocioproServiceInput: any;
        organisationServiceId: string;
      } = {
        categorySocioproId: this.selectedCategorie.categorySocioproId,
        categorySocioproServiceInput: {
          ...this.dataForm,
        },
        organisationServiceId: this.organisationServiceId,
      };
      if (this.eventSelectedId) {
        tempObjectInput['eventId'] = this.eventSelectedId;
      }
      if (!selectedUpdate) {
        this.createCategorySocioproServiceGQL
          .mutate({
            ...tempObjectInput,
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
        delete tempObjectInput['organisationServiceId'];
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
                err.message || 'Une erreur est survenue'
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
            err?.message || 'Une erreur est survenue lors de l enregistrement'
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

  onServiceActivationChange($event: boolean) {
    this.activated.value = $event;
    this.disableButton = true;
  }
  createEvent() {
    if (!this.organisationServiceId) {
      this.defineService
        .mutate({
          organisationId: this.organization.id,
          organisationServiceInput: {
            activated: true,
            activatedAt: new Date(),
            amount: 0,
            amountUnit: AmountUnit.Fixed,
            autoValidate: true,
            refundDuration: 1,
            refundDurationUnit: DurationUnit.Month,
          },
          serviceId: this.service.id,
        })
        .subscribe({
          next: (response) => {
            this.organisationServiceId =
              response.data.createOrganisationService.id;
          },
        });
    }
    this.showComponent = true;
    this.listCategorieService = [];

    // dialogRef.afterClosed().subscribe((result) => {
    //   if (result) {
    //     const formattedStartDate = new Date(result.startDate)
    //       .toISOString()
    //       .split('T')[0];
    //     const formattedEndDate = new Date(result.endDate)
    //       .toISOString()
    //       .split('T')[0];

    //     this.createEventGQL
    //       .mutate({
    //         eventInput: {
    //           title: result?.title,
    //           startDate: new Date(result.startDate),
    //           endDate: new Date(result.endDate),
    //         },
    //         organizationServiceId: this.organisationServiceId,
    //       })
    //       .subscribe({
    //         next: (response) => {
    //           this.snackBarService.showSnackBar('Événement créé avec succès');

    //           this.events.push({
    //             title: result.title,
    //             startDate: formattedStartDate,
    //             endDate: formattedEndDate,
    //             isActive: true,
    //           });
    //         },
    //         error: (err) => {
    //           this.snackBarService.showSnackBar('Une erreur est survenue');
    //           console.log(err);
    //         },
    //       });
    //   }
    // });
  }

  changeStatusEvent(status: boolean, event: { id: string; title: string }) {
    this.events = this.events.map((e) =>
      e.id === event.id ? { ...e, activated: status } : e
    );
    this.pendingEventStatusChanges.set(event.id, status);
    this.disableButton = true;
  }

  createOrganizationService() { }
  handleClickEvent(event: any) {
    console.log('event', event);
    if (this.eventSelectedId === event.id) {
      this.eventSelectedId = '';
      this.listCategorieService = this.tempListCategoryServices;
      this.showComponent = false;
      console.log('dataForm', this.dataForm);
      return;
    }
    this.eventSelectedId = event.id;
    this.listCategorieService = [
      {
        amount: event.amount,
        amountUnit: event.amountUnit,
        refundDuration: event.refundDuration,
        refundDurationUnit: event.refundDurationMonth,
        activated: event.activated,
        activatedAt: event.activatedAt,
        autoValidate: event.autoValidate,
        categorySociopro: {
          title: 'Paramètres généraux',
        } as any,
      },
      ...(event.categorySocioproServices || []),
    ];
    this.dataForm = this.events.find((e) => e.id === event.id);
  }

  onTabChange(event: MatTabChangeEvent) {
    this.selectedCategorie = this.listCategorieService[event.index];
  }
  onSettingChange($event: any) {
    if ($event.saveData) {
      this.disableButton = true;
      this.dataForm = $event.dataForm;
    } else {
      this.disableButton = this.pendingEventStatusChanges.size > 0 || this.activated.value !== this.originalActivated;
    }
  }
  createOrganizationEvent(EventInput: EventInput) { }
}
