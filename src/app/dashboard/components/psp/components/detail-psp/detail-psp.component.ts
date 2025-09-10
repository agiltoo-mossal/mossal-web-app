import { AfterViewInit, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { lastValueFrom, map } from 'rxjs';
import { SnackBarService } from 'src/app/shared/services/snackbar.service';
import { dateToString } from 'src/app/shared/utils/time';
import {
  CancelDemandeByAdminGQL,
  DemandeStatus,
  // FetchDemandesByPspGQL,
  // FetchOrganizationPspGQL,
  FetchRemboursementByUserIdGQL,
  FetchRemboursementsByDemandeGQL,
  LockUserGQL,
  MyRemboursementsGQL,
  PayeDemandeGQL,
  RejectDemandeByAdminGQL,
  UnlockUserGQL,
  ValidateDemandeGQL,
} from 'src/graphql/generated';

@Component({
  selector: 'app-detail-psp',
  templateUrl: './detail-psp.component.html',
  styleUrl: './detail-psp.component.scss',
})
export class DetailPspComponent implements AfterViewInit {
  psp: any;
  pspId: string;
  pendingDemandes: any[] = [];
  validatedDemandes: any[] = [];
  remboursements: any[] = [];
  constructor(
    private route: ActivatedRoute,
    // private fetchOrganizationPspGQL: FetchOrganizationPspGQL,
    private snackBarService: SnackBarService,
    private lockUserGQL: LockUserGQL,
    private unlockUserGQL: UnlockUserGQL,
    // private fetchDemandeByPspIdGQL: FetchDemandesByPspGQL,
    // private validateDemandeGQL: ValidateDemandeGQL,
    private payeDemandeGQL: PayeDemandeGQL,
    private cancelDemandeByAdminGQL: CancelDemandeByAdminGQL,
    private rejectDemandeByAdminGQL: RejectDemandeByAdminGQL,
    private requestService: MyRemboursementsGQL,
    private fetchDemandesByPspIdGQL: FetchRemboursementByUserIdGQL
  ) {
    this.route.paramMap.subscribe((params) => {
      this.pspId = params.get('id');
      // this.getCollab();
    });
  }
  ngAfterViewInit(): void {
    throw new Error('Method not implemented.');
  }
  // ngAfterViewInit() {
  //   // this.fetchDemandesByPspId(DemandeStatus.Pending);
  //   // this.fetchDemandesByPspId(DemandeStatus.Validated);
  //   // this.fetchRemboursments(this.pspId);
  // }
  fetchRemboursments(userId: string) {
    this.fetchDemandesByPspIdGQL
      .fetch({ userId: this.pspId }, { fetchPolicy: 'no-cache' })
      .subscribe({
        next: (result) => {
          this.remboursements = result.data.fetchRemboursementByUserId;
        },
        error: (error) => {},
      });
  }
  // getCollab() {
  //   if (this.pspId) {
  //     this.fetchOrganizationPspGQL
  //       .fetch(
  //         { pspId: this.pspId },
  //         { fetchPolicy: 'no-cache' }
  //       )
  //       .subscribe((result) => {
  //         this.psp = result.data.fetchOrganizationPsp;
  //         const birthDate = dateToString(this.psp.birthDate);
  //       });
  //   }
  // }

  // lockUser = (userId: string) => {
  //   this.lockUserGQL.mutate({ userId }).subscribe((result) => {
  //     if (result.data.lockUser) {
  //       this.snackBarService.showSuccessSnackBar(
  //         'Utilisateur bloqué avec succès!'
  //       );
  //       this.getCollab();
  //     } else {
  //       this.snackBarService.showErrorSnackBar();
  //     }
  //   });
  // };

  // unlockUser = (userId: string) => {
  //   this.unlockUserGQL.mutate({ userId }).subscribe((result) => {
  //     if (result.data.unlockUser) {
  //       this.snackBarService.showSuccessSnackBar(
  //         'Utilisateur débloqué avec succès!'
  //       );
  //       this.getCollab();
  //     } else {
  //       this.snackBarService.showErrorSnackBar();
  //     }
  //   });
  // };

  // fetchDemandesByPspId(status: DemandeStatus) {
  //   this.fetchDemandeByPspIdGQL
  //     .fetch(
  //       { pspId: this.pspId, status },
  //       {
  //         fetchPolicy: 'no-cache',
  //       }
  //     )
  //     .pipe(
  //       map((result) => {
  //         if (result === null) {
  //           return [];
  //         }
  //         return result.data.fetchDemandesByPsp;
  //       })
  //     )
  //     .subscribe({
  //       next: (result) => {
  //         if (status === DemandeStatus.Pending) {
  //           this.pendingDemandes = result;
  //         }
  //         if (status === DemandeStatus.Validated) {
  //           this.validatedDemandes = result;
  //         }
  //         this.fetchRemboursments(this.pspId);
  //       },
  //       error: (error) => {
  //         console.log(error);
  //         return [];
  //       },
  //     });
  // }

  // cancelDemande = (demandeId: string) => {
  //   this.cancelDemandeByAdminGQL.mutate({ demandeId }).subscribe(
  //     (result) => {
  //       if (result.data.cancelDemandeByAdmin) {
  //         this.snackBarService.showSuccessSnackBar(
  //           'demande annulée avec succés!'
  //         );
  //         this.fetchDemandesByPspId(DemandeStatus.Pending);
  //       } else {
  //         this.snackBarService.showErrorSnackBar();
  //       }
  //     },
  //     (error) => {
  //       this.snackBarService.showErrorSnackBar(
  //         5000,
  //         'Vous ne pouvez pas effectuer cette action.'
  //       );
  //     }
  //   );
  // };

  // rejectDemande = (demandeId: string, reason: string) => {
  //   this.rejectDemandeByAdminGQL
  //     .mutate({ demandeId, rejectedReason: reason })
  //     .subscribe(
  //       (result) => {
  //         if (result.data.rejectDemandeByAdmin) {
  //           this.snackBarService.showSuccessSnackBar(
  //             'demande rejetée avec succés!'
  //           );
  //           this.fetchDemandesByPspId(DemandeStatus.Pending);
  //         } else {
  //           this.snackBarService.showErrorSnackBar();
  //         }
  //       },
  //       (error) => {
  //         this.snackBarService.showErrorSnackBar(
  //           5000,
  //           'Vous ne pouvez pas effectuer cette action.'
  //         );
  //       }
  //     );
  // };

  // validateDemande = (demandeId: string) => {
  //   this.validateDemandeGQL.mutate({ demandeId }).subscribe(
  //     (result) => {
  //       if (result.data.validateDemande) {
  //         this.snackBarService.showSuccessSnackBar(
  //           'demande validée avec succés!'
  //         );
  //         this.fetchDemandesByPspId(DemandeStatus.Pending);
  //       } else {
  //         this.snackBarService.showErrorSnackBar();
  //       }
  //     },
  //     (error) => {
  //       this.snackBarService.showErrorSnackBar(
  //         5000,
  //         'Vous ne pouvez pas effectuer cette action.'
  //       );
  //     }
  //   );
  // };

  // payeDemande = (demandeId: string) => {
  //   this.payeDemandeGQL.mutate({ demandeId }).subscribe(
  //     (result) => {
  //       if (result.data.payeDemande) {
  //         this.snackBarService.showSuccessSnackBar(
  //           'demande payée avec succés!'
  //         );
  //         this.fetchDemandesByPspId(DemandeStatus.Pending);
  //       } else {
  //         this.snackBarService.showErrorSnackBar();
  //       }
  //     },
  //     (error) => {
  //       this.snackBarService.showErrorSnackBar(
  //         5000,
  //         'Vous ne pouvez pas effectuer cette action.'
  //       );
  //     }
  //   );
  // };
}
