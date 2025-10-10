import { AfterViewInit, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { lastValueFrom, map } from 'rxjs';
import { SnackBarService } from 'src/app/shared/services/snackbar.service';
import { dateToString } from 'src/app/shared/utils/time';
import {
  CancelDemandeByAdminGQL,
  DemandeStatus,
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
    private snackBarService: SnackBarService,
    private lockUserGQL: LockUserGQL,
    private unlockUserGQL: UnlockUserGQL,
    private payeDemandeGQL: PayeDemandeGQL,
    private cancelDemandeByAdminGQL: CancelDemandeByAdminGQL,
    private rejectDemandeByAdminGQL: RejectDemandeByAdminGQL,
    private requestService: MyRemboursementsGQL,
    private fetchDemandesByPspIdGQL: FetchRemboursementByUserIdGQL
  ) {
    this.route.paramMap.subscribe((params) => {
      this.pspId = params.get('id');
    });
  }
  ngAfterViewInit(): void {
    throw new Error('Method not implemented.');
  }
 
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
  
}
