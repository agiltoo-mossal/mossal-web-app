import { Component } from '@angular/core';
import {
  FetchCurrentAdminGQL,
  FetchOrganisationServiceByOrganisationIdAndServiceIdGQL,
  FetchOrganisationServiceGQL,
  FetchPaginatedOrganizationDemandesGQL,
  OrderByDirection,
} from 'src/graphql/generated';
import { catchError, map, of, switchMap } from 'rxjs';
import { SnackBarService } from 'src/app/shared/services/snackbar.service';

@Component({
  selector: 'app-request-event',
  templateUrl: './request-event.component.html',
  styleUrl: './request-event.component.scss',
})
export class RequestEventComponent {
  title: string = "Dépannage d'urgence";
  organizationServiceId: string;
  serviceId = '6751902bee9f8e91151fe4a8';
  organizationId: string; // Titre dynamique
  data = [];
  constructor(
    private organizationService: FetchOrganisationServiceByOrganisationIdAndServiceIdGQL,
    private fetchCurrentAdminGQL: FetchCurrentAdminGQL,
    private paginatedRequestGQL: FetchPaginatedOrganizationDemandesGQL,
    private snacbkarService: SnackBarService
  ) { }

  ngOnInit() {
    this.fetchCurrentAdminGQL
      .fetch({}, { fetchPolicy: 'no-cache' })
      .pipe(
        map((resp) => resp.data.fetchCurrentAdmin.organization.id),
        switchMap((organizationId) => {
          this.organizationId = organizationId;
          return this.organizationService.fetch(
            {
              organisationId: this.organizationId,
              serviceId: this.serviceId,
            },
            { fetchPolicy: 'no-cache' }
          );
        }),
        map(
          (resp) =>
            resp.data.fetchOrganisationServiceByOrganisationIdAndServiceId.id
        )
      )
      .subscribe({
        next: (organisationServiceId) => {
          this.organizationServiceId = organisationServiceId;
        },
        error: (error) => {
          console.error('Subscription error:', error);
        },
      });
  }
}
