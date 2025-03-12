import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackBarService } from 'src/app/shared/services/snackbar.service';
import {
  FetchRemboursementsByDemandeGQL,
  Remboursement,
  ValidateRemboursementGQL,
} from 'src/graphql/generated';

@Component({
  selector: 'app-request-details',
  templateUrl: './request-details.component.html',
  styleUrl: './request-details.component.scss',
})
export class RequestDetailsComponent implements OnInit {
  demandeId: string;
  listRemboursements: any[] = [];
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private requestService: FetchRemboursementsByDemandeGQL,
    private remboursementService: ValidateRemboursementGQL,
    private snackBarService: SnackBarService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.demandeId = params['id'];
      console.log(this.demandeId);

      this.requestService
        .fetch({
          demandeId: this.demandeId,
        })
        .subscribe({
          next: (res) => {
            this.listRemboursements = res.data.fetchRemboursementsByDemande;
          },
        });
    });
  }

  rembourseDemande(demandeId: string) {
    this.remboursementService
      .mutate({
        remboursementId: demandeId,
      })
      .subscribe({
        next: (res) => {
          console.log(res);
          this.snackBarService.showSnackBar('Demande remboursée avec succès');
        },
      });
  }
}
