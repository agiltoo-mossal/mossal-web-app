import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FetchOrdersForApproverGQL } from 'src/graphql/bulk-payment-extended';

export type ValidationStatut = 'pending' | 'approved' | 'rejected';

export interface PaymentValidation {
  id: string;
  titre: string;
  soumisPar: string;
  dateSoumission: string;
  dateISO: string;
  nombreBeneficiaires: number;
  montantTotal: number;
  statut: ValidationStatut;
  niveauActuel: number;
  niveauTotal: number;
  dejaTraite: boolean;
  estMonTour: boolean;
}

const STATUS_MAP: Record<string, ValidationStatut> = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};

@Component({
  selector: 'app-tracking-approvals',
  templateUrl: './tracking-approvals.component.html',
  styleUrls: ['./tracking-approvals.component.scss']
})
export class TrackingApprovalsComponent implements OnInit {

  recherche = '';
  dateDebut = '';
  dateFin = '';
  statutFiltre = 'tous';

  statutOptions = [
    { value: 'tous', label: 'Tous les statuts' },
    { value: 'pending', label: 'En attente' },
    { value: 'approved', label: 'Approuvé' },
    { value: 'rejected', label: 'Rejeté' }
  ];

  isLoading = true;
  paiements: PaymentValidation[] = [];
  paiementsFiltres: PaymentValidation[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fetchOrdersForApproverGQL: FetchOrdersForApproverGQL,
  ) {}

  ngOnInit(): void {
    this.fetchOrdersForApproverGQL.fetch({}, { fetchPolicy: 'network-only' }).subscribe({
      next: (res) => {
        const orders = res.data?.fetchOrdersForApprover ?? [];
          console.log('orders bruts:', orders); // vérifie ici si createdByUser existe
        this.paiements = orders.map((o) => {
          const createdAt = new Date(o.createdAt);
          const globalStatut = STATUS_MAP[o.status] ?? 'pending';

          const isApprovedByCurrentUser = o.isApprovedByCurrentUser ?? false;
          const dejaTraite = isApprovedByCurrentUser || globalStatut === 'approved' || globalStatut === 'rejected';
          const estMonTour = !dejaTraite && globalStatut === 'pending';

          return {
            id: o.id,
            titre: o.label,
            soumisPar: o.createdByUser
              ? `${o.createdByUser.firstName} ${o.createdByUser.lastName}`
              : '—',
            dateSoumission: new Intl.DateTimeFormat('fr-FR', {
              day: 'numeric', month: 'long', year: 'numeric',
              hour: '2-digit', minute: '2-digit',
            }).format(createdAt),
            dateISO: createdAt.toISOString().substring(0, 10),
            nombreBeneficiaires: o.paymentsCount ?? 0,
            montantTotal: o.totalAmount,
            statut: globalStatut,
            niveauActuel: o.currentApprovalLevel ?? 1,
            niveauTotal: o.approvers?.length ?? 1,
            dejaTraite,
            estMonTour,
          };
        });
        this.appliquerFiltres();
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; },
    });
  }

  getBadgeLabel(p: PaymentValidation): string {
    if (p.statut === 'rejected') return 'Rejeté';
    if (p.dejaTraite) return 'Approuvé';
    if (p.estMonTour) return 'En attente de votre approbation';
    return 'En attente';
  }

  getBadgeClass(p: PaymentValidation): string {
    if (p.statut === 'rejected') return 'badge-rejected';
    if (p.dejaTraite) return 'badge-approved';
    return 'badge-pending';
  }

  get nombreEnAttente(): number {
    return this.paiements.filter(p => p.estMonTour).length;
  }

  get nombreApprouves(): number {
    return this.paiements.filter(p => p.dejaTraite && p.statut !== 'rejected').length;
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

      const matchDateDebut = !this.dateDebut || p.dateISO >= this.dateDebut;
      const matchDateFin = !this.dateFin || p.dateISO <= this.dateFin;

      return matchRecherche && matchStatut && matchDateDebut && matchDateFin;
    });
  }

  reinitialiserFiltres(): void {
    this.recherche = '';
    this.dateDebut = '';
    this.dateFin = '';
    this.statutFiltre = 'tous';
    this.appliquerFiltres();
  }

  formatMontant(montant: number): string {
    return montant.toLocaleString('fr-FR') + ' XOF';
  }

  voirDetail(paiement: PaymentValidation): void {
    if (paiement.dejaTraite || paiement.statut !== 'pending') {
      this.router.navigate([paiement.id, 'view'], { relativeTo: this.route });
    } else {
      this.router.navigate([paiement.id], { relativeTo: this.route });
    }
  }
}
