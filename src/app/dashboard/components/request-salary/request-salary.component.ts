import { Component } from '@angular/core';
import { FetchOrganisationServiceGQL } from 'src/graphql/generated';

@Component({
  selector: 'app-request-salary',
  templateUrl: './request-salary.component.html',
  styleUrl: './request-salary.component.scss',
})
export class RequestSalaryComponent {
  title: string = "Dépannage d'urgence"; // Titre dynamique
  data = [];
  constructor(private listRequest: FetchOrganisationServiceGQL) {}

  ngOnInit() {
    this.listRequest
      .fetch({
        organisationServiceId: '675b31ccd059abbe573a5c19',
      })
      .subscribe({
        next: (resp) => {
          console.log('list', resp.data.fetchOrganisationService);
          this.data = resp.data.fetchOrganisationService.demandes;
        },
      });
  }
}
