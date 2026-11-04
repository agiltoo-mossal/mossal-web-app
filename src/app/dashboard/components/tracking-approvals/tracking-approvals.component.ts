import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { interval, startWith, Subject, switchMap, takeUntil } from 'rxjs';
import {
  ApproverOrdersQueryFilter,
  FetchPaginatedOrdersForApproverGQL,
  FetchPaginatedOrdersForApproverQuery,
} from 'src/graphql/bulk-payment-extended';
import {FetchCurrentAdminGQL, Organization} from 'src/graphql/generated';
export type ValidationStatus = 'pending' | 'approved' | 'rejected';

export interface PaymentValidation {
  id: string;
  title: string;
  submittedBy: string;
  submittedAt: string;
  dateISO: string;
  beneficiariesCount: number;
  amount: number;
  operatorFees: number;
  status: ValidationStatus;
  currentLevel: number;
  totalLevels: number;
  alreadyProcessed: boolean;
  isMyTurn: boolean;
}

type ApproverOrderCounts = FetchPaginatedOrdersForApproverQuery['fetchPaginatedOrdersForApprover']['counts'];
type ApproverOrder = FetchPaginatedOrdersForApproverQuery['fetchPaginatedOrdersForApprover']['results'][number];

const BALANCE_POLL_INTERVAL_MS = 10000;


const STATUS_MAP: Record<string, ValidationStatus> = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};

@Component({
  selector: 'app-tracking-approvals',
  templateUrl: './tracking-approvals.component.html',
  styleUrls: ['./tracking-approvals.component.scss']
})
export class TrackingApprovalsComponent implements OnInit, OnDestroy {

  search = '';
  startDate = '';
  endDate = '';
  statusFilter = 'all';

  statusOptions = [
    { value: 'all', label: 'Tous les statuts' },
    { value: 'pending', label: 'En attente' },
    { value: 'approved', label: 'Approuvé' },
    { value: 'rejected', label: 'Rejeté' }
  ];

  isLoading = true;
  payments: PaymentValidation[] = [];

  readonly pageSizeOptions = [10, 25, 50, 100];
  pageIndex = 0;
  pageSize = 10;
  totalItems = 0;
  counts: ApproverOrderCounts = { pending: 0, approved: 0, rejected: 0 };

  // Filtres réellement envoyés au backend : les champs du formulaire ne comptent qu'au clic sur « Appliquer ».
  private appliedFilters: Omit<ApproverOrdersQueryFilter, 'page' | 'limit'> = {};

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fetchPaginatedOrdersForApproverGQL: FetchPaginatedOrdersForApproverGQL,
        private fetchCurrentAdminGQL: FetchCurrentAdminGQL,

  ) {}

  private destroy$ = new Subject<void>();
  private loadOrders$ = new Subject<void>();

  isLoadingBalance = true;
    organization: Organization | null = null;

  ngOnInit(): void {
    // switchMap : une nouvelle page/un nouveau filtre annule la requête précédente encore en cours.
    this.loadOrders$
      .pipe(
        switchMap(() => {
          this.isLoading = true;
          return this.fetchPaginatedOrdersForApproverGQL.fetch(
            { queryFilter: { ...this.appliedFilters, page: this.pageIndex + 1, limit: this.pageSize } },
            { fetchPolicy: 'network-only' },
          );
        }),
        takeUntil(this.destroy$),
      )
      .subscribe({
        next: (res) => {
          const data = res.data?.fetchPaginatedOrdersForApprover;
          this.payments = (data?.results ?? []).map((o) => this.toPaymentValidation(o));
          this.totalItems = data?.pagination?.totalItems ?? 0;
          this.counts = data?.counts ?? { pending: 0, approved: 0, rejected: 0 };
          this.isLoading = false;
        },
        error: () => { this.isLoading = false; },
      });

    this.loadOrders$.next();
    this.startBalancePolling();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private toPaymentValidation(o: ApproverOrder): PaymentValidation {
    const createdAt = new Date(o.createdAt);
    const globalStatus = STATUS_MAP[o.status] ?? 'pending';

    const isApprovedByCurrentUser = o.isApprovedByCurrentUser ?? false;
    const alreadyProcessed = isApprovedByCurrentUser || globalStatus === 'approved' || globalStatus === 'rejected';
    const isMyTurn = !alreadyProcessed && globalStatus === 'pending';

    return {
      id: o.id,
      title: o.label,
      submittedBy: o.createdByUser
        ? `${o.createdByUser.firstName} ${o.createdByUser.lastName}`
        : '—',
      submittedAt: new Intl.DateTimeFormat('fr-FR', {
        day: 'numeric', month: 'long', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
      }).format(createdAt),
      dateISO: createdAt.toISOString().substring(0, 10),
      beneficiariesCount: o.paymentsCount ?? 0,
      amount: o.totalAmount,
      operatorFees: o.totalFees ?? 0,
      status: globalStatus,
      currentLevel: o.currentApprovalLevel ?? 1,
      totalLevels: o.approversByLevel?.length ?? 1,
      alreadyProcessed,
      isMyTurn,
    };
  }

  private startBalancePolling(): void {
      this.isLoadingBalance = true;
      interval(BALANCE_POLL_INTERVAL_MS)
        .pipe(
          startWith(0), // premier appel immédiat, sans attendre le premier tick
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

  getBadgeLabel(p: PaymentValidation): string {
    if (p.status === 'rejected') return 'Rejeté';
    if (p.alreadyProcessed) return 'Approuvé';
    if (p.isMyTurn) return 'En attente de votre approbation';
    return 'En attente';
  }

  getBadgeClass(p: PaymentValidation): string {
    if (p.status === 'rejected') return 'badge-rejected';
    if (p.alreadyProcessed) return 'badge-approved';
    return 'badge-pending';
  }

  // Compteurs calculés côté backend sur tous les ordres visibles (hors filtres et pagination).
  get pendingCount(): number {
    return this.counts.pending;
  }

  get approvedCount(): number {
    return this.counts.approved;
  }

  get rejectedCount(): number {
    return this.counts.rejected;
  }

  applyFilters(): void {
    this.appliedFilters = {
      search: this.search.trim() || undefined,
      status: this.statusFilter === 'all' ? undefined : this.statusFilter,
      startDate: this.startDate || undefined,
      endDate: this.endDate || undefined,
    };
    this.pageIndex = 0;
    this.loadOrders$.next();
  }

  resetFilters(): void {
    this.search = '';
    this.startDate = '';
    this.endDate = '';
    this.statusFilter = 'all';
    this.applyFilters();
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadOrders$.next();
  }

  formatAmount(amount: number): string {
    return amount.toLocaleString('fr-FR') + ' XOF';
  }

  viewDetails(payment: PaymentValidation): void {
    if (payment.alreadyProcessed || payment.status !== 'pending') {
      this.router.navigate([payment.id, 'view'], { relativeTo: this.route });
    } else {
      this.router.navigate([payment.id], { relativeTo: this.route });
    }
  }
}
