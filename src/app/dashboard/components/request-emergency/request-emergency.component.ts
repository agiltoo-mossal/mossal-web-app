import { Component } from '@angular/core';
import { FetchOrganisationServiceGQL } from 'src/graphql/generated';

@Component({
  selector: 'app-request-emergency',
  templateUrl: './request-emergency.component.html',
  styleUrl: './request-emergency.component.scss',
})
export class RequestEmergencyComponent {
  title: string = "Dépannage d'urgence"; // Titre dynamique
  data = [];
  constructor(private listRequest: FetchOrganisationServiceGQL) {}

  ngOnInit() {
    this.listRequest
      .fetch({
        organisationServiceId: '6759f5af36f73982fd5a1509',
      })
      .subscribe({
        next: (resp) => {
          console.log('list', resp.data.fetchOrganisationService);
          this.data = resp.data.fetchOrganisationService.demandes;
        },
      });
  }
}
