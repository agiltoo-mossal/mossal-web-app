import { AfterViewInit, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { lastValueFrom, map } from 'rxjs';
import { SnackBarService } from 'src/app/shared/services/snackbar.service';
import { dateToString } from 'src/app/shared/utils/time';
import {
  DemandeStatus,
  FetchDemandesByCollaboratorGQL,
  FetchOrganizationCollaboratorGQL,
  LockUserGQL,
  UnlockUserGQL,
} from 'src/graphql/generated';

@Component({
  selector: 'app-detail-collaborator',
  templateUrl: './detail-collaborator.component.html',
  styleUrl: './detail-collaborator.component.scss',
})
export class DetailCollaboratorComponent implements AfterViewInit {
  collaborator: any;
  collaboratorId: string;
  pendingDemandes: any[] = [];
  constructor(
    private route: ActivatedRoute,
    private fetchOrganizationCollaboratorGQL: FetchOrganizationCollaboratorGQL,
    private snackBarService: SnackBarService,
    private lockUserGQL: LockUserGQL,
    private unlockUserGQL: UnlockUserGQL,
    private fetchDemandeByCollaboratorIdGQL: FetchDemandesByCollaboratorGQL
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

  lockUser = (userId: string) => {
    this.lockUserGQL.mutate({ userId }).subscribe((result) => {
      console.log(result);

      if (result.data.lockUser) {
        this.snackBarService.showSuccessSnackBar(
          'Utilisateur bloqué avec succès!'
        );
        this.getCollab();
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
        this.getCollab();
      } else {
        this.snackBarService.showErrorSnackBar();
      }
    });
  };

  fetchDemandesByCollaboratorId(status: DemandeStatus) {
    return lastValueFrom(
      this.fetchDemandeByCollaboratorIdGQL
        .fetch({ collaboratorId: this.collaboratorId, status })
        .pipe(
          map((result) => {
            if (result === null) {
              return [];
            }
            return result.data.fetchDemandesByCollaborator;
          })
        )
    );
  }
  async ngAfterViewInit() {
    this.pendingDemandes = await this.fetchDemandesByCollaboratorId(
      DemandeStatus.Pending
    );
  }
}
