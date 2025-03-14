import { Component } from '@angular/core';
import {
  FetchOrganisationServiceGQL,
  FetchCurrentAdminGQL,
  FetchOrganisationServiceByOrganisationIdAndServiceIdGQL,
} from 'src/graphql/generated';
import { catchError, map, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-request-salary',
  templateUrl: './request-salary.component.html',
  styleUrl: './request-salary.component.scss',
})
export class RequestSalaryComponent {
  title: string = 'Avance salariale';
  serviceId = '67519057ee9f8e91151fe4ad';
  organizationServiceId: string;
  organizationId: string; // Titre dynamique
  data = [];
  constructor(
    private listRequest: FetchOrganisationServiceGQL,
    private organizationService: FetchOrganisationServiceByOrganisationIdAndServiceIdGQL,
    private fetchCurrentAdminGQL: FetchCurrentAdminGQL
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
          return this.listRequest.fetch(
            {
              organisationServiceId: this.organizationServiceId,
            },
            { fetchPolicy: 'no-cache' }
          );
        }),
        map((resp) => resp.data.fetchOrganisationService.demandes),
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
