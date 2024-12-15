import { Component } from '@angular/core';
import { FetchOrganisationServiceGQL } from 'src/graphql/generated';

@Component({
  selector: 'app-request-event',
  templateUrl: './request-event.component.html',
  styleUrl: './request-event.component.scss',
})
export class RequestEventComponent {
  title: string = "Dépannage d'urgence"; // Titre dynamique
  data = [];
  constructor(private listRequest: FetchOrganisationServiceGQL) {}

  ngOnInit() {
    this.listRequest
      .fetch({
        organisationServiceId: '675b3086d059abbe573a5c16',
      })
      .subscribe({
        next: (resp) => {
          console.log('list', resp.data.fetchOrganisationService);
          this.data = resp.data.fetchOrganisationService.demandes;
        },
      });
  }
}
