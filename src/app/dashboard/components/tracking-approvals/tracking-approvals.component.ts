import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
 
export type ValidationStatut = 'pending' | 'approved' | 'rejected';
 
export interface PaymentValidation {
  id: string;
  titre: string;
  soumisPar: string;
  dateSoumission: string;
  nombreBeneficiaires: number;
  montantTotal: number;
  statut: ValidationStatut;
  niveauActuel: number;
  niveauTotal: number;
}

@Component({
  selector: 'app-tracking-approvals',
  templateUrl: './tracking-approvals.component.html',
  styleUrls: ['./tracking-approvals.component.scss']
})
export class TrackingApprovalsComponent implements OnInit {

  // --- Filtres ---
  recherche = '';
  dateDebut: Date | null = null;
  dateFin: Date | null = null;
  statutFiltre = 'tous';
 
  statutOptions = [
    { value: 'tous', label: 'Tous les statuts' },
    { value: 'pending', label: 'En attente' },
    { value: 'approved', label: 'Approuvé' },
    { value: 'rejected', label: 'Rejeté' }
  ];
 
  // --- Données ---
  paiements: PaymentValidation[] = [];
  paiementsFiltres: PaymentValidation[] = [];
 
  constructor(private router: Router, private route: ActivatedRoute ) {}
 
  ngOnInit(): void {
    this.chargerDonneesMock();
    this.appliquerFiltres();
  }
 
  
  private chargerDonneesMock(): void {
    this.paiements = [
      {
        id: '1',
        titre: 'Paiement Mai 2026',
        soumisPar: 'Awa Fall',
        dateSoumission: '15 Mars 2026 à 09h07',
        nombreBeneficiaires: 42,
        montantTotal: 2320000,
        statut: 'pending',
        niveauActuel: 1,
        niveauTotal: 2
      },
      {
        id: '2',
        titre: 'Paiement Avril 2026',
        soumisPar: 'Awa Fall',
        dateSoumission: '06 Avril 2026 à 14h32',
        nombreBeneficiaires: 42,
        montantTotal: 2320000,
        statut: 'approved',
        niveauActuel: 1,
        niveauTotal: 1
      },
      {
        id: '3',
        titre: 'Paiement Mars 2026',
        soumisPar: 'Awa Fall',
        dateSoumission: '15 Mars 2026 à 09h07',
        nombreBeneficiaires: 42,
        montantTotal: 2320000,
        statut: 'rejected',
        niveauActuel: 1,
        niveauTotal: 2
      },
      {
        id: '4',
        titre: 'Paiement Février 2026',
        soumisPar: 'Awa Fall',
        dateSoumission: '02 Février 2026 à 16h32',
        nombreBeneficiaires: 42,
        montantTotal: 2320000,
        statut: 'pending',
        niveauActuel: 1,
        niveauTotal: 2
      }
    ];
  }
 
  get nombreEnAttente(): number {
    return this.paiements.filter(p => p.statut === 'pending').length;
  }
 
  get nombreApprouves(): number {
    return this.paiements.filter(p => p.statut === 'approved').length;
  }
 
  get nombreRejetes(): number {
    return this.paiements.filter(p => p.statut === 'rejected').length;
  }
 
  appliquerFiltres(): void {
    this.paiementsFiltres = this.paiements.filter(p => {
      const matchRecherche =
        !this.recherche ||
        p.titre.toLowerCase().includes(this.recherche.toLowerCase());
 
      const matchStatut =
        this.statutFiltre === 'tous' || p.statut === this.statutFiltre;
 
      return matchRecherche && matchStatut;
    });
  }
 
  reinitialiserFiltres(): void {
    this.recherche = '';
    this.dateDebut = null;
    this.dateFin = null;
    this.statutFiltre = 'tous';
    this.appliquerFiltres();
  }
 
  getStatutLabel(statut: ValidationStatut): string {
    switch (statut) {
      case 'pending':
        return 'En attente de votre validation';
      case 'approved':
        return 'Approuvé';
      case 'rejected':
        return 'Rejeté';
    }
  }
 
  formatMontant(montant: number): string {
    return montant.toLocaleString('fr-FR') + ' XOF';
  }
 

  voirDetail(paiement: PaymentValidation): void {
    this.router.navigate([paiement.id], {
      relativeTo: this.route,       
      queryParams: { statut: paiement.statut }
    });
  }

}