import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject, forkJoin, of, timer } from 'rxjs';
import { catchError, map, switchMap, takeUntil } from 'rxjs/operators';
import { BulkPaymentOrder, BulkPaymentOrderStatus, FetchMyBulkPaymentOrdersGQL, Wallet } from 'src/graphql/generated';
import { FetchBulkPaymentOrderByIdGQL } from 'src/graphql/bulk-payment-extended';

export type TxStatus = 'EN_ATTENTE' | 'EN_COURS' | 'SUCCES' | 'ECHEC' | 'EXPIRE' | 'REMBOURSE';

export interface BeneficiaryTx {
  id: string;
  orderId: string;
  orderLabel: string;
  lastName: string;
  firstName: string;
  phone: string;
  operator: 'Wave' | 'Orange Money';
  amount: number;
  fees: number;
  status: TxStatus;
  mossalTxId?: string;
  partnerTxId?: string;
  initiatedAt?: string;
  executedAt?: string;
  failureReason?: string;
}

const STATUS_LABELS: Record<TxStatus, string> = {
  EN_ATTENTE: 'En attente',
  EN_COURS: 'En cours',
  SUCCES: 'Succès',
  ECHEC: 'Echec',
  EXPIRE: 'Expiré',
  REMBOURSE: 'Remboursé',
};

const STATUS_BADGE: Record<TxStatus, string> = {
  EN_ATTENTE: 'badge-attente',
  EN_COURS: 'badge-cours',
  SUCCES: 'badge-succes',
  ECHEC: 'badge-echec',
  EXPIRE: 'badge-expire',
  REMBOURSE: 'badge-rembourse',
};

const RAW_STATUS_MAP: Record<string, TxStatus> = {
  PENDING: 'EN_ATTENTE', EN_ATTENTE: 'EN_ATTENTE',
  PROCESSING: 'EN_COURS', IN_PROGRESS: 'EN_COURS', EN_COURS: 'EN_COURS',
  SUCCESS: 'SUCCES', SUCCEEDED: 'SUCCES', COMPLETED: 'SUCCES', SUCCES: 'SUCCES',
  FAILED: 'ECHEC', FAILURE: 'ECHEC', ECHEC: 'ECHEC',
  EXPIRED: 'EXPIRE', EXPIRE: 'EXPIRE',
  REFUNDED: 'REMBOURSE', REMBOURSE: 'REMBOURSE',
};

@Component({
  selector: 'app-payments-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit, OnDestroy {

  constructor(
    private router: Router,
    private fetchMyBulkPaymentOrdersGQL: FetchMyBulkPaymentOrdersGQL,
    private fetchBulkPaymentOrderByIdGQL: FetchBulkPaymentOrderByIdGQL,
  ) { }

  isLoading = true;

    orders: BulkPaymentOrder[] = [];


  items: BeneficiaryTx[] = [];
  selected: BeneficiaryTx | null = null;

  pageSize = 12;
  pageIndex = 0;

  pendingSearch = '';
  pendingStatus = '';
  pendingTxId = '';
  pendingStartDate = '';
  pendingEndDate = '';

  appliedSearch = '';
  appliedStatus = '';
  appliedTxId = '';
  appliedStartDate = '';
  appliedEndDate = '';

  readonly statusOptions = Object.entries(STATUS_LABELS).map(([value, label]) => ({ value, label }));
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    timer(0, 30000).pipe(
      switchMap((tick) => (tick === 0 || this.hasPending) ? this.loadBeneficiaries() : of(this.items)),
      takeUntil(this.destroy$),
    ).subscribe((data) => {
      this.items = data;
      this.isLoading = false;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private get hasPending(): boolean {
    return this.items.some(b => b.status === 'EN_ATTENTE' || b.status === 'EN_COURS');
  }


  private loadBeneficiaries(): Observable<BeneficiaryTx[]> {
    return this.fetchMyBulkPaymentOrdersGQL.fetch({}, { fetchPolicy: 'network-only' }).pipe(
      switchMap((res) => {
        const orders = (res.data?.fetchMyBulkPaymentOrders ?? [])
          .filter(o => o.status !== BulkPaymentOrderStatus.Draft);
        if (orders.length === 0) return of([] as BeneficiaryTx[]);

        return forkJoin(
          orders.map(o =>
            this.fetchBulkPaymentOrderByIdGQL.fetch({ id: o.id }, { fetchPolicy: 'network-only' }).pipe(
              map(r => this.toBeneficiaries(r.data?.fetchBulkPaymentOrderById)),
              catchError(() => of([] as BeneficiaryTx[])),
            )
          )
        ).pipe(map(lists => ([] as BeneficiaryTx[]).concat(...lists)));
      }),
      catchError(() => of(this.items)),
    );
  }

  private toBeneficiaries(order: any): BeneficiaryTx[] {
    if (!order) return [];
    return (order.payments ?? []).map((p: any, i: number): BeneficiaryTx => ({
      id: p.id ?? `${order.id}-${i}`,
      orderId: order.id,
      orderLabel: order.label,
      lastName: p.lastName,
      firstName: p.firstName,
      phone: this.formatPhone(p.phoneNumber),
      operator: p.wallet === Wallet.Wave ? 'Wave' : 'Orange Money',
      amount: p.amount ?? 0,
      fees: p.fees ?? p.fee ?? 0,
      status: this.mapStatus(p.status, order.status),
      // Champs optionnels : à ajouter dans la requête FetchBulkPaymentOrderById (voir message)
      mossalTxId: p.reference ?? p.id,
      partnerTxId: p.transactionId ?? p.partnerTransactionId ?? '',
      initiatedAt: order.createdAt,
      executedAt: p.executedAt ?? p.updatedAt ?? '',
      failureReason: p.failureReason ?? p.errorMessage ?? '',
    }));
  }

  private mapStatus(raw: string | undefined, orderStatus: string): TxStatus {
    const mapped = RAW_STATUS_MAP[(raw ?? '').toUpperCase()];
    if (mapped) return mapped;
    return orderStatus === BulkPaymentOrderStatus.Approved ? 'EN_COURS' : 'EN_ATTENTE';
  }

  private formatPhone(phone: string): string {
    const d = (phone ?? '').replace(/\D/g, '').slice(-9);
    return d.length === 9 ? `${d.slice(0, 2)} ${d.slice(2, 5)} ${d.slice(5, 7)} ${d.slice(7)}` : (phone ?? '');
  }

  // ---------- Filtres ----------
  get filteredItems(): BeneficiaryTx[] {
    const search = this.appliedSearch.trim().toLowerCase();
    const txId = this.appliedTxId.trim().toLowerCase();
    const start = this.appliedStartDate ? new Date(this.appliedStartDate + 'T00:00:00').getTime() : null;
    const end = this.appliedEndDate ? new Date(this.appliedEndDate + 'T23:59:59.999').getTime() : null;

    return this.items.filter((b) => {
      const matchSearch = !search ||
        `${b.orderLabel} ${b.firstName} ${b.lastName} ${b.phone}`.toLowerCase().includes(search);
      const matchStatus = !this.appliedStatus || b.status === this.appliedStatus;
      const matchTx = !txId ||
        (b.partnerTxId ?? '').toLowerCase().includes(txId) ||
        (b.mossalTxId ?? '').toLowerCase().includes(txId);

      const ref = b.executedAt || b.initiatedAt;
      const d = ref ? new Date(ref).getTime() : null;
      const matchDate = (start === null && end === null) ||
        (d !== null && (start === null || d >= start) && (end === null || d <= end));

      return matchSearch && matchStatus && matchTx && matchDate;
    });
  }

  // ---------- Récapitulatif ----------
  get summary() {
    const list = this.items;
    const total = list.length;
    const sum = (f: (b: BeneficiaryTx) => boolean) =>
      list.filter(f).reduce((acc, b) => acc + (b.amount ?? 0), 0);
    const count = (f: (b: BeneficiaryTx) => boolean) => list.filter(f).length;
    const pct = (n: number) => (total ? Math.round((n * 100) / total) : 0);

    const isPending = (b: BeneficiaryTx) => b.status === 'EN_ATTENTE' || b.status === 'EN_COURS';
    const successCount = count(b => b.status === 'SUCCES');
    const failureCount = count(b => b.status === 'ECHEC');
    const pendingCount = count(isPending);

    return {
      total,
      successCount, successPct: pct(successCount),
      failureCount, failurePct: pct(failureCount),
      pendingCount, pendingPct: pct(pendingCount),
      totalSent: sum(b => b.status === 'SUCCES'),
      totalFailed: sum(b => b.status === 'ECHEC'),
      totalPending: sum(isPending),
    };
  }

  // ---------- Pagination ----------
  get paginatedItems(): BeneficiaryTx[] {
    const start = this.pageIndex * this.pageSize;
    return this.filteredItems.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredItems.length / this.pageSize));
  }

  get pageNumbers(): (number | '...')[] {
    const total = this.totalPages;
    const current = this.pageIndex + 1;
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const pages: (number | '...')[] = [1, 2, 3, 4];
    if (current > 5) pages.push('...');
    pages.push(total);
    return pages;
  }

  get displayRangeStart(): number {
    return this.filteredItems.length === 0 ? 0 : this.pageIndex * this.pageSize + 1;
  }

  get displayRangeEnd(): number {
    return Math.min((this.pageIndex + 1) * this.pageSize, this.filteredItems.length);
  }

  goToPage(page: number | '...'): void {
    if (page !== '...') this.pageIndex = page - 1;
  }
  prevPage(): void { if (this.pageIndex > 0) this.pageIndex--; }
  nextPage(): void { if (this.pageIndex < this.totalPages - 1) this.pageIndex++; }

  // ---------- Statuts ----------
  statusLabel(s: TxStatus): string { return STATUS_LABELS[s] ?? s; }
  statusBadge(s: TxStatus): string { return STATUS_BADGE[s] ?? 'badge-attente'; }

  // ---------- Actions ----------
  onApply(): void {
    this.appliedSearch = this.pendingSearch;
    this.appliedStatus = this.pendingStatus;
    this.appliedTxId = this.pendingTxId;
    this.appliedStartDate = this.pendingStartDate;
    this.appliedEndDate = this.pendingEndDate;
    this.pageIndex = 0;
  }

  onReset(): void {
    this.pendingSearch = this.pendingStatus = this.pendingTxId = '';
    this.pendingStartDate = this.pendingEndDate = '';
    this.onApply();
  }

  openDetails(b: BeneficiaryTx): void { this.selected = b; }
  closeDetails(): void { this.selected = null; }

  /** Conserve l'ancienne navigation vers le détail complet de l'ordre. */
  goToOrder(b: BeneficiaryTx): void {
    this.router.navigate(['/dashboard/payments/details', b.orderId]);
  }

  totalFees(b: BeneficiaryTx): number {
     return b.fees ?? 0;
  }

  totalCost(b: BeneficiaryTx): number {
    return (b.amount ?? 0) + this.totalFees(b);
  }
}