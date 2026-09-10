import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';

import { RejectPaymentDialogComponent } from '../reject-payment-dialog/reject-payment-dialog.component';
import { ApproveConfirmationDialogComponent } from '../approve-confirmation-dialog/approve-confirmation-dialog.component';
import {
  ApproveBulkPaymentOrderGQL,
  FetchOrderForApproverByIdGQL,
  RejectBulkPaymentOrderGQL,
} from 'src/graphql/bulk-payment-extended';
import { Wallet, FetchCurrentAdminGQL, Organization } from 'src/graphql/generated';
import { SnackBarService, SnackBarClassByResult } from 'src/app/shared/services/snackbar.service';

export type StatutPaiement = 'pending' | 'approved' | 'rejected';
export type StatutApprobation = 'approved' | 'rejected' | 'pending';

export interface Beneficiaire {
  nom: string;
  prenom: string;
  telephone: string;
  montant: number;
  operateur: string;
}

export interface RepartitionOperateur {
  nom: string;
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

const STATUS_MAP: Record<string, StatutPaiement> = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};

@Component({
  selector: 'app-tracking-approvals-details',
  templateUrl: './tracking-approvals-details.component.html',
  styleUrls: ['./tracking-approvals-details.component.scss']
})
export class TrackingApprovalsDetailsComponent implements OnInit {

  paiement!: PaymentOrderDetails;
  isLoading = true;
  isSubmitting = false;
  organization: Organization | null = null;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private dialog: MatDialog,
    private fetchOrderForApproverByIdGQL: FetchOrderForApproverByIdGQL,
    private approveBulkPaymentOrderGQL: ApproveBulkPaymentOrderGQL,
    private rejectBulkPaymentOrderGQL: RejectBulkPaymentOrderGQL,
    private fetchCurrentAdminGQL: FetchCurrentAdminGQL,
    private snackBarService: SnackBarService,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;
    
    this.loadOrganizationBalance();

    this.fetchOrderForApproverByIdGQL
      .fetch({ id }, { fetchPolicy: 'network-only' })
      .subscribe({
        next: (res) => {
          const order = res.data?.fetchOrderForApproverById;
          if (!order) return;

          const statut = STATUS_MAP[order.status] ?? 'pending';
          const payments = order.payments ?? [];
          const approvers = order.approvers ?? [];
          const approvals = order.approvals ?? [];

          const wavePayments = payments.filter(p => p.wallet === Wallet.Wave);
          const omPayments = payments.filter(p => p.wallet === Wallet.OrangeMoney);
          const totalAmt = order.totalAmount || 1;
          const waveAmt = wavePayments.reduce((s, p) => s + p.amount, 0);
          const omAmt = omPayments.reduce((s, p) => s + p.amount, 0);

          const uniqueWallets = new Set(payments.map(p => p.wallet));

          const etapesApprobation: ApprobationStep[] = approvers.map((approver, i) => {
            const level = i + 1;
            const approval = approvals.find(a => a.level === level);
            const nom = `${approver.firstName} ${approver.lastName}`;

            if (approval) {
              return {
                niveau: level,
                statut: 'approved' as StatutApprobation,
                validateurNom: nom,
                validateurRole: 'Approbateur',
                dateModification: approval.approvedAt
                  ? new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date(approval.approvedAt))
                  : '',
              };
            } else if (statut === 'rejected' && level === order.currentApprovalLevel) {
              return {
                niveau: level,
                statut: 'rejected' as StatutApprobation,
                validateurNom: nom,
                validateurRole: 'Approbateur',
                dateModification: '',
                motifRejet: order.rejectedReason ?? undefined,
              };
            } else {
              return {
                niveau: level,
                statut: 'pending' as StatutApprobation,
                validateurNom: nom,
                validateurRole: 'Approbateur',
                dateModification: '',
              };
            }
          });

          const rejectedStep = etapesApprobation.find(e => e.statut === 'rejected');

          this.paiement = {
            id: order.id,
            titre: order.label,
            statut,
            libellePaiement: order.label,
            nombreBeneficiaires: payments.length,
            montantTotal: order.totalAmount,
            nombreOperateurs: uniqueWallets.size,
            dateSoumission: new Intl.DateTimeFormat('fr-FR', {
              day: 'numeric', month: 'long', year: 'numeric',
              hour: '2-digit', minute: '2-digit',
            }).format(new Date(order.createdAt)),
            demandeurNom: order.createdByUser
              ? `${order.createdByUser.firstName} ${order.createdByUser.lastName}`
              : '—',
            beneficiaires: payments.map(p => ({
              nom: p.lastName,
              prenom: p.firstName,
              telephone: p.phoneNumber,
              montant: p.amount,
              operateur: p.wallet === Wallet.Wave ? 'Wave' : 'Orange Money',
            })),
            repartitionOperateurs: [
              { nom: 'Wave', nombreBeneficiaires: wavePayments.length, montant: waveAmt, pourcentage: Math.round(waveAmt / totalAmt * 100) },
              { nom: 'Orange Money', nombreBeneficiaires: omPayments.length, montant: omAmt, pourcentage: Math.round(omAmt / totalAmt * 100) },
            ],
            etapesApprobation,
            rejetePar: rejectedStep?.validateurNom,
          };

          this.isLoading = false;
        },
        error: () => { this.isLoading = false; },
      });
  }

    private loadOrganizationBalance(): void {
    this.fetchCurrentAdminGQL.fetch({}, { fetchPolicy: 'no-cache' }).subscribe({
      next: (result) => {
        this.organization = (result.data?.fetchCurrentAdmin?.organization as Organization) ?? null;
      },
      // Si l'appel échoue, on n'affiche pas le bloc plutôt que de bloquer le parcours.
      error: () => { this.organization = null; },
    });
  }

  get isBalanceInsufficient(): boolean {
    if (!this.organization || !this.paiement) return false;
    return this.organization.balance < this.paiement.montantTotal;
  }

  get balanceAfterExecution(): number {
    if (!this.organization || !this.paiement) return 0;
    return this.organization.balance - this.paiement.montantTotal;
  }

  get badgeLabel(): string {
    switch (this.paiement?.statut) {
      case 'pending': return 'En attente';
      case 'approved': return 'Validé';
      case 'rejected': return 'Rejeté';
      default: return '';
    }
  }

  formatMontant(montant: number): string {
    return montant.toLocaleString('fr-FR') + ' XOF';
  }

  retour(): void {
    this.location.back();
  }

  /**
   * Ticket "Vérification du solde à l'approbation":
   * Avant d'ouvrir la boîte de dialogue de confirmation, on vérifie que le solde de
   * l'organisation permet d'honorer le montant total du paiement. Le solde est rechargé
   * en temps réel (no-cache) pour éviter de se baser sur une valeur périmée.
   */
  approuver(): void {
    if (this.isSubmitting) return;
    this.isSubmitting = true;

    this.fetchCurrentAdminGQL.fetch({}, { fetchPolicy: 'no-cache' }).subscribe({
      next: (result) => {
        const organization = result.data?.fetchCurrentAdmin?.organization as Organization | undefined;

        if (!organization) {
          this.isSubmitting = false;
          this.snackBarService.showSnackBar(
            "Impossible de vérifier le solde de l'organisation. Veuillez réessayer.",
            '✕',
            { panelClass: SnackBarClassByResult.Error, duration: 4000 },
          );
          return;
        }

        if (organization.balance < this.paiement.montantTotal) {
          this.isSubmitting = false;
          this.snackBarService.showSnackBar(
            "Merci de recharger votre compte, le solde actuel ne permet pas d'effectuer ce paiement.",
            '✕',
            { panelClass: SnackBarClassByResult.Error, duration: 5000 },
          );
          return;
        }

        this.openApproveConfirmation();
      },
      error: () => {
        this.isSubmitting = false;
        this.snackBarService.showSnackBar(
          "Impossible de vérifier le solde de l'organisation. Veuillez réessayer.",
          '✕',
          { panelClass: SnackBarClassByResult.Error, duration: 4000 },
        );
      },
    });
  }

  private openApproveConfirmation(): void {
    const dialogRef = this.dialog.open(ApproveConfirmationDialogComponent, {
      width: '480px',
      data: {
        libelle: this.paiement.libellePaiement,
        montantTotal: this.paiement.montantTotal,
        nombreBeneficiaires: this.paiement.nombreBeneficiaires,
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean | undefined) => {
      if (!confirmed) {
        this.isSubmitting = false;
        return;
      }
      this.confirmApprove();
    });
  }

  private confirmApprove(): void {
    this.approveBulkPaymentOrderGQL.mutate({ id: this.paiement.id }).subscribe({
      next: () => {
        this.snackBarService.showSnackBar(
          'Ordre approuvé avec succès.',
          '✕',
          { panelClass: SnackBarClassByResult.Success, duration: 3000 },
        );
        this.location.back();
      },
      error: (err) => {
        this.isSubmitting = false;
        const message = err?.graphQLErrors?.[0]?.message ?? 'Une erreur est survenue.';
        this.snackBarService.showSnackBar(message, '✕', {
          panelClass: SnackBarClassByResult.Error,
          duration: 4000,
        });
      },
    });
  }

  rejeter(): void {
    const dialogRef = this.dialog.open(RejectPaymentDialogComponent, { width: '720px' });

    dialogRef.afterClosed().subscribe((motifRejet: string | undefined) => {
      if (!motifRejet || this.isSubmitting) return;
      this.isSubmitting = true;

      this.rejectBulkPaymentOrderGQL.mutate({ id: this.paiement.id, reason: motifRejet }).subscribe({
        next: () => {
          this.snackBarService.showSnackBar(
            'Ordre rejeté.',
            '✕',
            { panelClass: SnackBarClassByResult.Success, duration: 3000 },
          );
          this.location.back();
        },
        error: (err) => {
          this.isSubmitting = false;
          const message = err?.graphQLErrors?.[0]?.message ?? 'Une erreur est survenue.';
          this.snackBarService.showSnackBar(message, '✕', {
            panelClass: SnackBarClassByResult.Error,
            duration: 4000,
          });
        },
      });
    });
  }

  telechargerListe(): void {
    console.log('Télécharger la liste des bénéficiaires');
  }
}