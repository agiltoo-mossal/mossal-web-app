import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { dateToString } from 'src/app/shared/utils/time';
import { FetchOrganizationCollaboratorGQL } from 'src/graphql/generated';

@Component({
  selector: 'app-detail-collaborator',
  templateUrl: './detail-collaborator.component.html',
  styleUrl: './detail-collaborator.component.scss',
})
export class DetailCollaboratorComponent {
  collaborator: any;
  collaboratorId: string;
  constructor(
    private route: ActivatedRoute,
    private fetchOrganizationCollaboratorGQL: FetchOrganizationCollaboratorGQL
  ) {
    this.route.paramMap.subscribe((params) => {
      this.collaboratorId = params.get('id');
      this.getCollab();
    });
  }

  getCollab() {
    if (this.collaboratorId) {
      this.fetchOrganizationCollaboratorGQL
        .fetch(
          { collaboratorId: this.collaboratorId },
          { fetchPolicy: 'no-cache' }
        )
        .subscribe((result) => {
          this.collaborator = result.data.fetchOrganizationCollaborator;
          const birthDate = dateToString(this.collaborator.birthDate);
        });
    }
  }
}
