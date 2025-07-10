import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackBarService } from 'src/app/shared/services/snackbar.service';
import {
  FetchRemboursementsByDemandeGQL,
  Remboursement,
  ValidateRemboursementGQL,
  FetchOrganizationDemandesGQL,
  Demande,
} from 'src/graphql/generated';

@Component({
  selector: 'app-request-details',
  templateUrl: './request-details.component.html',
  styleUrl: './request-details.component.scss',
})
export class RequestDetailsComponent implements OnInit {
  demandeId: string;
  demande: any;
  listRemboursements: any[] = [];
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private requestService: FetchRemboursementsByDemandeGQL,
    private remboursementService: ValidateRemboursementGQL,
    private fetchOrganizationDemandesGQL: FetchOrganizationDemandesGQL,
    private snackBarService: SnackBarService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.demandeId = params['id'];
      this.loadDemandeDetails();
      this.loadRemboursements();
    });
  }

  loadDemandeDetails() {
    this.fetchOrganizationDemandesGQL.fetch().subscribe({
      next: (res) => {
        this.demande = res.data.fetchOrganizationDemandes.find(
          (d) => d.id === this.demandeId
        );
        if (!this.demande) {
          this.snackBarService.showSnackBar('Demande non trouvée');
          //this.router.navigate(['/dashboard/requests-list']);
        }
      },
      error: (error) => {
        console.error('Error loading demande details:', error);
        this.snackBarService.showSnackBar(
          'Erreur lors du chargement des détails de la demande'
        );
      },
    });
  }

  loadRemboursements() {
    this.requestService
      .fetch({
        demandeId: this.demandeId,
      })
      .subscribe({
        next: (res) => {
          this.listRemboursements = res.data.fetchRemboursementsByDemande;
        },
        error: (error) => {
          console.error('Error loading remboursements:', error);
          this.snackBarService.showSnackBar(
            'Erreur lors du chargement des remboursements'
          );
        },
      });
  }

  rembourseDemande(demandeId: string) {
    this.remboursementService
      .mutate({
        remboursementId: demandeId,
      })
      .subscribe({
        next: (res) => {
          this.loadRemboursements();
          this.snackBarService.showSnackBar('Demande remboursée avec succès');
        },
        error: (error) => {
          console.error('Error remboursing demande:', error);
          this.snackBarService.showSnackBar(
            'Erreur lors du remboursement de la demande'
          );
        },
      });
  }
}
