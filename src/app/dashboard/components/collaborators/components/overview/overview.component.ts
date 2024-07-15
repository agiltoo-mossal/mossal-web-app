import { Component, effect } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FileUploadService } from 'src/app/shared/services/file-upload.service';
import { SnackBarService } from 'src/app/shared/services/snackbar.service';
import {
  FetchOrganizationCollaboratorsGQL,
  LockUserGQL,
  UnlockUserGQL,
  User,
} from 'src/graphql/generated';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent {
  collabs: User[] = [];
  selectedCollab: User;
  disableCache: boolean;
  search: string = '';
  constructor(
    private fetchOrganizationCollaboratorsGQL: FetchOrganizationCollaboratorsGQL,
    private activatedRoute: ActivatedRoute,
    private lockUserGQL: LockUserGQL,
    private unlockUserGQL: UnlockUserGQL,
    private snackBarService: SnackBarService,
    private fileUploadService: FileUploadService
  ) {
    this.fetchCollabs();
    effect(() => {
      const tempData = this.fileUploadService.getDataResponse();
      if (tempData) {
        this.collabs = [...this.collabs, ...tempData.data];
      }
    });
    // this.disableCache = Boolean(this.activatedRoute.snapshot.queryParams['e']);
  }

  fetchCollabs() {
    this.fetchOrganizationCollaboratorsGQL
      .fetch({}, { fetchPolicy: 'no-cache' })
      .subscribe((result) => {
        this.collabs = result.data.fetchOrganizationCollaborators as User[];
        this.selectedCollab = this.collabs?.[0];
      });
  }

  selectCollab(selected: User) {
    this.selectedCollab = selected;
  }

  lockUser = (userId: string) => {
    this.lockUserGQL.mutate({ userId }).subscribe((result) => {
      if (result.data.lockUser) {
        this.snackBarService.showSuccessSnackBar(
          'Utilisateur bloqué avec succès!'
        );
        this.fetchCollabs();
      } else {
        this.snackBarService.showErrorSnackBar();
      }
    });
  };

  unlockUser = (userId: string) => {
    this.unlockUserGQL.mutate({ userId }).subscribe((result) => {
      if (result.data.unlockUser) {
        this.snackBarService.showSuccessSnackBar(
          'Utilisateur débloqué avec succès!'
        );
        this.fetchCollabs();
      } else {
        this.snackBarService.showErrorSnackBar();
      }
    });
  };
}
