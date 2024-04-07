import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Demande, FetchOrganizationDemandesGQL, User } from 'src/graphql/generated';

@Component({
  selector: 'app-requests-list',
  templateUrl: './requests-list.component.html',
  styleUrls: ['./requests-list.component.scss'],
})
export class RequestsListComponent {
  requests = [];
  selectedReq: Demande;

  @ViewChild('dropdownContent') dropdownContent: ElementRef;
  @ViewChild('dropdown') dropdown: ElementRef;

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    if (!this.dropdown.nativeElement.contains(event.target)) {
      this.dropdownContent.nativeElement.classList.remove('show');
    } else {
      this.dropdownContent.nativeElement.classList.add('show');
    }
  }

  constructor(
    private fetchOrganizationDemandesGQL: FetchOrganizationDemandesGQL
  ) {
    this.getDemandes();
  }

  getDemandes() {
    this.fetchOrganizationDemandesGQL.fetch({}).subscribe(
      result => {
        this.requests = result.data.fetchOrganizationDemandes as Demande[];
        this.selectedReq = this.requests?.[0]
      }
    )
  }

  selectReq(selected: Demande) {
    this.selectedReq = selected;
  }
}
