// import { Component, OnInit } from '@angular/core';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { interval, startWith, Subject, switchMap, takeUntil } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import * as XLSX from 'xlsx';
import { FetchOrderForApproverByIdGQL } from 'src/graphql/bulk-payment-extended';
import { Wallet } from 'src/graphql/generated';
import {FetchCurrentAdminGQL, Organization} from 'src/graphql/generated';
import { mapPaymentStatut, PAYMENT_STATUT_BADGES, PAYMENT_STATUT_LABELS, PaymentStatut } from './payment-statut';


interface ApprovalStep {
  niveau: number;
  approbateurNom: string;
  approbateurRole: string;
  statut: 'valide' | 'en_attente' | 'rejete';
  dateNotification?: string;
  motifRejet?: string;
}

interface Beneficiaire {
  nom: string;
  prenom: string;
  telephone: string;
  montant: number;
  frais: number;
  operateur: string;
  statut: PaymentStatut;
}

interface OrderDetail {
  libelle: string;
  nombreBeneficiaires: number;
  montantTotal: number;
  operateurs: number;
  dateSoumission: string;
}
const BALANCE_POLL_INTERVAL_MS = 10000;


@Component({
  selector: 'app-approver-order-view',
  templateUrl: './approver-order-view.component.html',
  styleUrls: ['./approver-order-view.component.scss'],
})
export class ApproverOrderViewComponent implements OnInit {
  isLoading = true;
  orderDetail: OrderDetail | null = null;
  approvalSteps: ApprovalStep[] = [];
  beneficiaires: Beneficiaire[] = [];
  isRejected = false;
  isApproved = false;
  isPending = false;
  isCancelled = false;
  cancelledByName?: string;
  isBeneficiairesOpen = true;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private fetchOrderForApproverByIdGQL: FetchOrderForApproverByIdGQL,
    private fetchCurrentAdminGQL: FetchCurrentAdminGQL,

  ) {}

  private destroy$ = new Subject<void>();
  isLoadingBalance = true;
  organization: Organization | null = null;


  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) { this.isLoading = false; return; }

    this.fetchOrderForApproverByIdGQL
      .fetch({ id }, { fetchPolicy: 'network-only' })
      .subscribe({
        next: (res) => {
          const order = res.data?.fetchOrderForApproverById;
          if (!order) { this.isLoading = false; return; }

          const payments = order.payments ?? [];
          const approversByLevel = order.approversByLevel ?? [];
          const approvals = order.approvals ?? [];
          const uniqueWallets = new Set(payments.map(p => p.wallet));

          this.isRejected = (order.status as string) === 'REJECTED';
          this.isApproved = (order.status as string) === 'APPROVED';
          this.isPending = (order.status as string) === 'PENDING';
          this.isCancelled = (order.status as string) === 'CANCELLED';
          this.cancelledByName = order.cancelledByUser
            ? `${order.cancelledByUser.firstName} ${order.cancelledByUser.lastName}`
            : undefined;

          this.orderDetail = {
            libelle: order.label,
            nombreBeneficiaires: payments.length,
            montantTotal: order.totalAmount + (order.totalFees ?? 0),
            operateurs: uniqueWallets.size,
            dateSoumission: new Intl.DateTimeFormat('fr-FR', {
              day: 'numeric', month: 'long', year: 'numeric',
              hour: '2-digit', minute: '2-digit',
            }).format(new Date(order.createdAt)),
          };

          this.approvalSteps = approversByLevel.map((levelEntry) => {
            const level = levelEntry.level;
            const approval = approvals.find(a => a.level === level);
            const nom = (levelEntry.approvers ?? []).map(a => `${a.firstName} ${a.lastName}`).join(' / ');

            if (approval) {
              return {
                niveau: level,
                approbateurNom: nom,
                approbateurRole: `Approbateur N°${level}`,
                statut: 'valide' as const,
                dateNotification: approval.approvedAt
                  ? new Intl.DateTimeFormat('fr-FR', {
                      day: 'numeric', month: 'long', year: 'numeric',
                    }).format(new Date(approval.approvedAt))
                  : undefined,
              };
            } else if (this.isRejected && level === order.currentApprovalLevel) {
              return {
                niveau: level,
                approbateurNom: nom,
                approbateurRole: `Approbateur N°${level}`,
                statut: 'rejete' as const,
                motifRejet: order.rejectedReason ?? undefined,
              };
            } else {
              return {
                niveau: level,
                approbateurNom: nom,
                approbateurRole: `Approbateur N°${level}`,
                statut: 'en_attente' as const,
              };
            }
          });

          this.beneficiaires = payments.map(p => ({
            nom: p.lastName,
            prenom: p.firstName,
            telephone: p.phoneNumber,
            montant: p.amount,
            frais: p.fee ?? 0,
            operateur: p.wallet === Wallet.Wave ? 'Wave' : 'Orange Money',
            statut: mapPaymentStatut(p.status, order.status as string),
          }));

          this.isLoading = false;
        },
        error: () => { this.isLoading = false; },
      });
        this.startBalancePolling();

  }

    private startBalancePolling(): void {
    this.isLoadingBalance = true;
    interval(BALANCE_POLL_INTERVAL_MS)
      .pipe(
        startWith(0),
        switchMap(() => this.fetchCurrentAdminGQL.fetch({}, { fetchPolicy: 'no-cache' })),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (result) => {
          if (result.data) {
            this.organization = result.data.fetchCurrentAdmin.organization as Organization;
          }
          this.isLoadingBalance = false;
        },
        error: () => { this.isLoadingBalance = false; },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get currentApproverWaiting(): ApprovalStep | undefined {
    return this.approvalSteps.find(s => s.statut === 'en_attente');
  }

  get lastApprovedApprover(): ApprovalStep | undefined {
    const approved = this.approvalSteps.filter(s => s.statut === 'valide');
    return approved.length > 0 ? approved[approved.length - 1] : undefined;
  }

  get hasSomeoneApproved(): boolean {
    return !!this.lastApprovedApprover;
  }

  get rejectedApprover(): ApprovalStep | undefined {
    return this.approvalSteps.find(s => s.statut === 'rejete');
  }

  formatMontant(montant: number): string {
    return new Intl.NumberFormat('fr-FR').format(montant) + ' XOF';
  }

  paymentStatutLabel(s: PaymentStatut): string {
    return PAYMENT_STATUT_LABELS[s];
  }

  paymentStatutBadge(s: PaymentStatut): string {
    return PAYMENT_STATUT_BADGES[s];
  }

  toggleBeneficiairesList(): void {
    this.isBeneficiairesOpen = !this.isBeneficiairesOpen;
  }

  downloadBeneficiaryList(): void {
    if (!this.beneficiaires.length) return;

    const rows = [
      ['Nom', 'Prénom', 'Téléphone', 'Montant', 'Total des frais', 'Montant total', 'Opérateur', 'Statut'],
      ...this.beneficiaires.map(b => [
        b.nom, b.prenom, b.telephone, b.montant, b.frais, b.montant + b.frais, b.operateur,
        this.paymentStatutLabel(b.statut),
      ]),
    ];

    const sumBy = (pick: (b: Beneficiaire) => number, filter: (b: Beneficiaire) => boolean = () => true) =>
      this.beneficiaires.filter(filter).reduce((sum, b) => sum + (pick(b) ?? 0), 0);
    // toLocaleString('fr-FR') sépare les milliers par une espace insécable fine : on la remplace par une espace simple.
    const xof = (n: number) => `${n.toLocaleString('fr-FR').replace(/\s/g, ' ')} XOF`;

    const totalSent = sumBy(b => b.montant);
    const totalFees = sumBy(b => b.frais);

    const summaryRows = [
      ['Indicateur', 'Valeur'],
      ['Montant total envoyé', xof(totalSent)],
      ['Frais Wave', xof(sumBy(b => b.frais, b => b.operateur === 'Wave'))],
      ['Frais Orange Money', xof(sumBy(b => b.frais, b => b.operateur === 'Orange Money'))],
      ['Total frais opérateurs', xof(totalFees)],
      ['Coût total réel', xof(totalSent + totalFees)],
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(rows);
    const summarySheet = XLSX.utils.aoa_to_sheet(summaryRows);
    summarySheet['!cols'] = [{ wch: 26 }, { wch: 20 }];
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Bénéficiaires': worksheet, 'Récapitulatif financier': summarySheet },
      SheetNames: ['Bénéficiaires', 'Récapitulatif financier'],
    };
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    // Le nom du fichier doit correspondre exactement au libellé de l'ordre.
    const filename = (this.orderDetail?.libelle ?? 'ordre').replace(/[\\/]/g, '-');
    a.download = `${filename}.xlsx`;
    a.click();
    URL.revokeObjectURL(url);
  }

  retour(): void {
    this.location.back();
  }
}
