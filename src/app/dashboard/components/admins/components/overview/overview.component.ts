import { Component } from '@angular/core';
import { FetchOrganizationAdminsGQL, User } from 'src/graphql/generated';

@Component({
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent {
  admins: User[] = [];
  selectedAdmin: User;
  search: string = "";
  constructor(
    private fetchOrganizationAdminsGQL: FetchOrganizationAdminsGQL
  ) {
    this.fetchAdmins();
  }

  fetchAdmins() {
    this.fetchOrganizationAdminsGQL.fetch({}, { fetchPolicy: 'no-cache' }).subscribe(
      result => {
        this.admins = result.data.fetchOrganizationAdmins as User[];
        this.selectedAdmin = this.admins?.[0];
      }
    )
  }

  selectAdmin(selected: User) {
    this.selectedAdmin = selected;
  }
}
