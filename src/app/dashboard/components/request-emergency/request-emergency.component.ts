import { Component } from '@angular/core';
import { catchError, map, of, switchMap } from 'rxjs';
import {
  FetchCurrentAdminGQL,
  FetchOrganisationServiceByOrganisationIdAndServiceIdGQL,
  FetchOrganisationServiceGQL,
  FetchPaginatedOrganizationDemandesGQL,
} from 'src/graphql/generated';

@Component({
  selector: 'app-request-emergency',
  templateUrl: './request-emergency.component.html',
  styleUrl: './request-emergency.component.scss',
})
export class RequestEmergencyComponent {
  serviceId = '67518fe7ee9f8e91151fe4a3';
  organizationServiceId: string;
  organizationId: string;
  title: string = "Dépannage d'urgence"; // Titre dynamique
  data = [];
  constructor(
    private organizationService: FetchOrganisationServiceByOrganisationIdAndServiceIdGQL,
    private fetchCurrentAdminGQL: FetchCurrentAdminGQL,
    private paginatedRequestGQL: FetchPaginatedOrganizationDemandesGQL
  ) {}

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
        ),
        switchMap((organizationServiceId) => {
          this.organizationServiceId = organizationServiceId;
          return this.paginatedRequestGQL.fetch(
            {
              organizationServiceId: this.organizationServiceId,
            },
            { fetchPolicy: 'no-cache' }
          );
        }),
        map((resp) => resp.data.fetchPaginatedOrganizationDemandes.results),
        catchError((error) => {
          console.error('Error fetching data:', error);
          return of([]);
        })
      )
      .subscribe({
        next: (demandes) => {
          this.data = demandes;
        },
        error: (error) => {
          console.error('Subscription error:', error);
        },
      });
  }
}
