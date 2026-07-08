import { TrackingApprovalsComponent } from './../tracking-approvals/tracking-approvals.component';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RejectPaymentDialogComponent } from '../reject-payment-dialog/reject-payment-dialog.component';

export type StatutPaiement = 'pending' | 'approved' | 'rejected';
export type StatutApprobation = 'approved' | 'rejected' | 'pending';

export interface Beneficiaire {
  nom: string;
  prenom: string;
  telephone: string;
  montant: number;
  operateur: 'Wave' | 'Orange Money';
}

export interface RepartitionOperateur {
  nom: 'Wave' | 'Orange Money';
  nombreBeneficiaires: number;
  montant: number;
  pourcentage: number;
}

export interface ApprobationStep {
  niveau: number;
  statut: StatutApprobation;
  validateurNom: string;
  validateurRole: string;
  dateModification: string;
  motifRejet?: string;
}

export interface PaymentOrderDetails {
  id: string;
  titre: string;
  statut: StatutPaiement;
  libellePaiement: string;
  nombreBeneficiaires: number;
  montantTotal: number;
  nombreOperateurs: number;
  dateSoumission: string;
  demandeurNom: string;
  repartitionOperateurs: RepartitionOperateur[];
  etapesApprobation: ApprobationStep[];
  beneficiaires: Beneficiaire[];
  rejetePar?: string;
}

@Component({
  selector: 'app-tracking-approvals-details',
  templateUrl: './tracking-approvals-details.component.html',
  styleUrls: ['./tracking-approvals-details.component.scss']
})
export class TrackingApprovalsDetailsComponent implements OnInit {

  paiement!: PaymentOrderDetails;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private dialog: MatDialog

  ) {}

  ngOnInit(): void {
    // Le statut arrive en query param depuis la liste (voir TrackingApprovalsComponent.voirDetail())
    // ex: /tracking-approvals//1?statut=pending
    const statut = (this.route.snapshot.queryParamMap.get('statut') as StatutPaiement) || 'pending';
    this.paiement = this.buildMock(statut);
  }


  private buildMock(statut: StatutPaiement): PaymentOrderDetails {
    const beneficiairesMock: Beneficiaire[] = [
      { nom: 'DIOP', prenom: 'Laurent', telephone: '77 700 77 77', montant: 120000, operateur: 'Wave' },
      { nom: 'DIOP', prenom: 'Laurent', telephone: '77 700 77 77', montant: 120000, operateur: 'Orange Money' },
      { nom: 'DIOP', prenom: 'Laurent', telephone: '77 700 77 77', montant: 120000, operateur: 'Orange Money' },
      { nom: 'DIOP', prenom: 'Laurent', telephone: '77 700 77 77', montant: 120000, operateur: 'Wave' },
      { nom: 'DIOP', prenom: 'Laurent', telephone: '77 700 77 77', montant: 120000, operateur: 'Orange Money' },
      { nom: 'DIOP', prenom: 'Laurent', telephone: '77 700 77 77', montant: 120000, operateur: 'Orange Money' },
      { nom: 'DIOP', prenom: 'Laurent', telephone: '77 700 77 77', montant: 120000, operateur: 'Wave' },
      { nom: 'DIOP', prenom: 'Laurent', telephone: '77 700 77 77', montant: 120000, operateur: 'Orange Money' }
    ];

    const base = {
      id: '1',
      titre: 'Paiement Mai 2026',
      libellePaiement: 'Paiement des primes de Juin 2026',
      nombreBeneficiaires: 42,
      nombreOperateurs: 2,
      demandeurNom: 'Awa Fall',
      beneficiaires: beneficiairesMock,
      repartitionOperateurs: [
        { nom: 'Wave' as const, nombreBeneficiaires: 28, montant: 1390000, pourcentage: 65 },
        { nom: 'Orange Money' as const, nombreBeneficiaires: 14, montant: 930000, pourcentage: 35 }
      ]
    };

    switch (statut) {
      case 'approved':
        return {
          ...base,
          statut: 'approved',
          montantTotal: 2320000,
          dateSoumission: '12 juin 2026 à 10:45',
          etapesApprobation: [
            {
              niveau: 1,
              statut: 'approved',
              validateurNom: 'Khadija Sarr',
              validateurRole: 'Approbateur',
              dateModification: 'Modifié le 13 mars 2026'
            },
            {
              niveau: 2,
              statut: 'approved',
              validateurNom: 'Maître Sarr',
              validateurRole: 'Super Admin',
              dateModification: 'Modifié le 15 mars 2026'
            }
          ]
        };

      case 'rejected':
        return {
          ...base,
          statut: 'rejected',
          montantTotal: 3320000,
          dateSoumission: '12 juin 2026 à 10:45',
          rejetePar: 'Maité Sarr',
          etapesApprobation: [
            {
              niveau: 1,
              statut: 'approved',
              validateurNom: 'Khadija Sarr',
              validateurRole: 'Approbateur',
              dateModification: 'Modifié le 13 mars 2026'
            },
            {
              niveau: 2,
              statut: 'rejected',
              validateurNom: 'Maité Sarr',
              validateurRole: 'Super Admin',
              dateModification: 'Modifié le 15 mars 2026',
              motifRejet: 'Le montant dépasse le plafond mensuel autorisé pour ce type de virement.'
            }
          ]
        };

      case 'pending':
      default:
        return {
          ...base,
          statut: 'pending',
          montantTotal: 2320000,
          dateSoumission: '15 mars 2026 à 09h07',
          etapesApprobation: [
            {
              niveau: 1,
              statut: 'pending',
              validateurNom: 'Khadija Sarr',
              validateurRole: 'Approbateur',
              dateModification: ''
            }
          ]
        };
    }
  }

  get badgeLabel(): string {
    switch (this.paiement.statut) {
      case 'pending': return 'En attente';
      case 'approved': return 'Validé';
      case 'rejected': return 'Rejeté';
    }
  }

  formatMontant(montant: number): string {
    return montant.toLocaleString('fr-FR') + ' XOF';
  }

  retour(): void {
    this.location.back(); 
  }

  rejeter(): void {
    const dialogRef = this.dialog.open(RejectPaymentDialogComponent, { width: '480px' });

        dialogRef.afterClosed().subscribe((motifRejet: string | undefined) => {
            if (!motifRejet) return; // annulé
            console.log('Rejeter', this.paiement.id, motifRejet);
        });
    }

  approuver(): void {
    console.log('Approuver le paiement', this.paiement.id);
  }

  telechargerListe(): void {
    console.log('Télécharger la liste des bénéficiaires');
  }
}