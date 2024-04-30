import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FetchOrganizationCollaboratorsGQL, User } from 'src/graphql/generated';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent {
  collabs: User[] = [];
  selectedCollab: User;
  disableCache: boolean;
  search: string = "";
  constructor(
    private fetchOrganizationCollaboratorsGQL: FetchOrganizationCollaboratorsGQL,
    private activatedRoute: ActivatedRoute
  ) {
    this.fetchCollabs();
    // this.disableCache = Boolean(this.activatedRoute.snapshot.queryParams['e']);
  }

  fetchCollabs() {
    this.fetchOrganizationCollaboratorsGQL.fetch({}, { fetchPolicy: 'no-cache' }).subscribe(
      result => {
        this.collabs = result.data.fetchOrganizationCollaborators as User[];
        this.selectedCollab = this.collabs?.[0];
      }
    )
  }

  selectCollab(selected: User) {
    this.selectedCollab = selected;
  }
}
