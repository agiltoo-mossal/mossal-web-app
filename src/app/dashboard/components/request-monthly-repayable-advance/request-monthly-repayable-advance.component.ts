import { Component } from '@angular/core';
import {
  FetchCurrentAdminGQL,
  FetchOrganisationServiceByOrganisationIdAndServiceIdGQL,
  FetchOrganisationServiceGQL,
  FetchPaginatedOrganizationDemandesGQL,
} from 'src/graphql/generated';
import { catchError, map, of, switchMap } from 'rxjs';
@Component({
  selector: 'app-request-monthly-repayable-advance',
  templateUrl: './request-monthly-repayable-advance.component.html',
  styleUrl: './request-monthly-repayable-advance.component.scss',
})
export class RequestMonthlyRepayableAdvanceComponent {
  title: string = 'Avance remboursable sur plusieurs mois';

  organizationServiceId: string;
  organizationId: string;
  serviceId = '6751908bee9f8e91151fe4b2'; // Titre dynamique
  data = [];
  eventName: string = "eventName";
  constructor(
    private paginatedRequestGQL: FetchPaginatedOrganizationDemandesGQL,
    private organizationService: FetchOrganisationServiceByOrganisationIdAndServiceIdGQL,
    private fetchCurrentAdminGQL: FetchCurrentAdminGQL
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
