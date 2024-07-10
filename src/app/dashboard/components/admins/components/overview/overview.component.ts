import { Component, effect } from '@angular/core';
import { FileUploadComponent } from 'src/app/shared/components/file-upload/file-upload.component';
import { FileUploadService } from 'src/app/shared/services/file-upload.service';
import { SnackBarService } from 'src/app/shared/services/snackbar.service';
import {
  FetchOrganizationAdminsGQL,
  LockUserGQL,
  UnlockUserGQL,
  User,
} from 'src/graphql/generated';

@Component({
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss',
})
export class OverviewComponent {
  admins: User[] = [];
  selectedAdmin: User;
  search: string = '';
  constructor(
    private fetchOrganizationAdminsGQL: FetchOrganizationAdminsGQL,
    private lockUserGQL: LockUserGQL,
    private unlockUserGQL: UnlockUserGQL,
    private snackBarService: SnackBarService
  ) {
    this.fetchAdmins();
  }

  fetchAdmins() {
    this.fetchOrganizationAdminsGQL
      .fetch({}, { fetchPolicy: 'no-cache' })
      .subscribe((result) => {
        this.admins = result.data.fetchOrganizationAdmins as User[];
        this.selectedAdmin = this.admins?.[0];
      });
  }

  selectAdmin(selected: User) {
    this.selectedAdmin = selected;
  }

  lockUser = (userId: string) => {
    this.lockUserGQL.mutate({ userId }).subscribe((result) => {
      if (result.data.lockUser) {
        this.snackBarService.showSuccessSnackBar(
          'Utilisateur bloqué avec succès!'
        );
        this.fetchAdmins();
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
        this.fetchAdmins();
      } else {
        this.snackBarService.showErrorSnackBar();
      }
    });
  };
}
