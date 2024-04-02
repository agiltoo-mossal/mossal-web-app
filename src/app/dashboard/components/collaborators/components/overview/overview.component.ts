import { Component } from '@angular/core';
import { FetchOrganizationCollaboratorsGQL, User } from 'src/graphql/generated';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent {
  collabs: User[] = [];
  constructor(
    private fetchOrganizationCollaboratorsGQL: FetchOrganizationCollaboratorsGQL
  ) {
    this.fetchCollabs();
  }

  fetchCollabs() {
    this.fetchOrganizationCollaboratorsGQL.fetch().subscribe(
      result => {
        this.collabs = result.data.fetchOrganizationCollaborators as User[];
      }
    )
  }
}
