import { Component, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import * as XLSX from 'xlsx';
import { BulkPaymentOrderStatus, FetchBulkPaymentOrderByIdGQL, Wallet } from 'src/graphql/generated';
import { SnackBarService } from 'src/app/shared/services/snackbar.service';
import { orderExecutionDate } from '../approver-order-view/payment-statut';

type TxStatus = 'EN_ATTENTE' | 'EN_COURS' | 'SUCCES' | 'ECHEC';

interface ExecutedPayment {
  lastName: string;
  firstName: string;
  phone: string;
  amount: number;
  fees: number;
  status: TxStatus;
  operator: string;
  executedAt?: Date;
}

// Statut backend du paiement (BulkPaymentStatus) -> statut affiché.
const STATUS_MAP: Record<string, TxStatus> = {
  PENDING: 'EN_ATTENTE',
  VALIDATED: 'EN_COURS',
  IN_PROCESS: 'EN_COURS',
  PAYED: 'SUCCES',
  REJECTED: 'ECHEC',
  CANCELLED: 'ECHEC',
};

const STATUS_LABELS: Record<TxStatus, string> = {
  EN_ATTENTE: 'En attente',
  EN_COURS: 'En cours',
  SUCCES: 'Succès',
  ECHEC: 'Echec',
};

const STATUS_BADGES: Record<TxStatus, string> = {
  EN_ATTENTE: 'tx-attente',
  EN_COURS: 'tx-cours',
  SUCCES: 'tx-succes',
  ECHEC: 'tx-echec',
};

@Component({
  selector: 'app-payment-execution-details',
  templateUrl: './payment-execution-details.component.html',
  styleUrls: [
    '../historyComponent/history.component.scss',
    './payment-execution-details.component.scss',
  ],
})
export class PaymentExecutionDetailsComponent implements OnInit {
  isLoading = true;
  orderLabel = '';
  payments: ExecutedPayment[] = [];
  filteredPayments: ExecutedPayment[] = [];

  search = '';
  executionDate = '';
  statusFilter = '';
  readonly statusOptions = Object.entries(STATUS_LABELS).map(([value, label]) => ({ value, label }));

  readonly pageSizeOptions = [10, 25, 50, 100];
  pageIndex = 0;
  pageSize = 10;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fetchBulkPaymentOrderByIdGQL: FetchBulkPaymentOrderByIdGQL,
    private snackBarService: SnackBarService,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.isLoading = false;
      return;
    }

    this.fetchBulkPaymentOrderByIdGQL.fetch({ id }, { fetchPolicy: 'network-only' }).subscribe({
      next: ({ data }) => {
        const order = data?.fetchBulkPaymentOrderById;
        // Cette page ne concerne que les ordres validés (accès direct par URL inclus).
        if (order && order.status !== BulkPaymentOrderStatus.Approved) {
          this.router.navigate(['/dashboard/payments/details', id], { replaceUrl: true });
          return;
        }

        this.orderLabel = order?.label ?? '';
        // Date d'approbation du dernier approbateur (positionnement des fonds), commune à tout l'ordre.
        const executedAt = order ? orderExecutionDate(order.status, order.approvals) : undefined;
        this.payments = (order?.payments ?? []).map((p) => ({
          lastName: p.lastName,
          firstName: p.firstName,
          phone: this.formatPhone(p.phoneNumber),
          amount: p.amount,
          fees: p.fee ?? 0,
          status: STATUS_MAP[p.status] ?? 'EN_ATTENTE',
          operator: p.wallet === Wallet.Wave ? 'Wave' : 'Orange Money',
          executedAt,
        }));
        this.applyFilters();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.snackBarService.showErrorSnackBar(4000, 'Impossible de charger le détail du paiement.');
      },
    });
  }

  private formatPhone(phone: string): string {
    const d = (phone ?? '').replace(/\D/g, '').slice(-9);
    return d.length === 9 ? `${d.slice(0, 2)} ${d.slice(2, 5)} ${d.slice(5, 7)} ${d.slice(7)}` : (phone ?? '');
  }

  // Le récapitulatif porte sur tout l'ordre, indépendamment des filtres.
  get summary() {
    const total = this.payments.length;
    const isPending = (p: ExecutedPayment) => p.status === 'EN_ATTENTE' || p.status === 'EN_COURS';
    const isSuccess = (p: ExecutedPayment) => p.status === 'SUCCES';
    const isFailure = (p: ExecutedPayment) => p.status === 'ECHEC';
    const sum = (f: (p: ExecutedPayment) => boolean) =>
      this.payments.filter(f).reduce((acc, p) => acc + p.amount, 0);
    const count = (f: (p: ExecutedPayment) => boolean) => this.payments.filter(f).length;
    const pct = (n: number) => (total ? Math.round((n * 100) / total) : 0);

    return {
      total,
      successCount: count(isSuccess),
      successPct: pct(count(isSuccess)),
      failureCount: count(isFailure),
      failurePct: pct(count(isFailure)),
      pendingCount: count(isPending),
      pendingPct: pct(count(isPending)),
      totalSent: sum(isSuccess),
      totalFailed: sum(isFailure),
      totalPending: sum(isPending),
    };
  }

  get paginatedPayments(): ExecutedPayment[] {
    const start = this.pageIndex * this.pageSize;
    return this.filteredPayments.slice(start, start + this.pageSize);
  }

  applyFilters(): void {
    const search = this.search.trim().toLowerCase();
    const searchDigits = search.replace(/\s/g, '');

    this.filteredPayments = this.payments.filter((p) => {
      const matchSearch =
        !search ||
        `${p.lastName} ${p.firstName}`.toLowerCase().includes(search) ||
        `${p.firstName} ${p.lastName}`.toLowerCase().includes(search) ||
        (!!searchDigits && p.phone.replace(/\s/g, '').includes(searchDigits));
      const matchStatus = !this.statusFilter || p.status === this.statusFilter;
      const matchDate =
        !this.executionDate || (!!p.executedAt && formatDate(p.executedAt, 'yyyy-MM-dd', 'fr') === this.executionDate);
      return matchSearch && matchStatus && matchDate;
    });
    this.pageIndex = 0;
  }

  resetFilters(): void {
    this.search = '';
    this.executionDate = '';
    this.statusFilter = '';
    this.applyFilters();
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  statusLabel(s: TxStatus): string {
    return STATUS_LABELS[s];
  }

  statusBadge(s: TxStatus): string {
    return STATUS_BADGES[s];
  }

  // Exporte les lignes correspondant aux filtres appliqués.
  exportList(): void {
    if (!this.filteredPayments.length) return;

    const rows = [
      ['Nom', 'Prénom', 'Téléphone', 'Montant', 'Frais', 'Coût total', 'Statut', 'Opérateur', "Date d'exécution"],
      ...this.filteredPayments.map((p) => [
        p.lastName,
        p.firstName,
        p.phone,
        p.amount,
        p.fees,
        p.amount + p.fees,
        this.statusLabel(p.status),
        p.operator,
        p.executedAt ? formatDate(p.executedAt, 'dd/MM/yyyy', 'fr') : '',
      ]),
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(rows), 'Bénéficiaires');
    XLSX.writeFile(workbook, `${(this.orderLabel || 'ordre').replace(/[\\/]/g, '-')}.xlsx`);
  }

  retour(): void {
    this.router.navigate(['/dashboard/organization/payments/history']);
  }
}
