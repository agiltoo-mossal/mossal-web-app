import { Component } from '@angular/core';
import { FetchOrganisationServiceGQL } from 'src/graphql/generated';

@Component({
  selector: 'app-request-monthly-repayable-advance',
  templateUrl: './request-monthly-repayable-advance.component.html',
  styleUrl: './request-monthly-repayable-advance.component.scss',
})
export class RequestMonthlyRepayableAdvanceComponent {
  title: string = "Dépannage d'urgence"; // Titre dynamique
  data = [];
  constructor(private listRequest: FetchOrganisationServiceGQL) {}

  ngOnInit() {
    this.listRequest
      .fetch({
        organisationServiceId: '675b331dd059abbe573a5c1c',
      })
      .subscribe({
        next: (resp) => {
          console.log('list', resp.data.fetchOrganisationService);
          this.data = resp.data.fetchOrganisationService.demandes;
        },
      });
  }
}
