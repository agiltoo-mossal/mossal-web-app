import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BulkPaymentOrder, BulkPaymentOrderStatus, BulkPaymentOrderType, FetchMyBulkPaymentOrdersGQL } from 'src/graphql/generated';

const STATUS_LABELS: Record<BulkPaymentOrderStatus, string> = {
  [BulkPaymentOrderStatus.Draft]: 'Brouillon',
  [BulkPaymentOrderStatus.Pending]: 'En attente',
  [BulkPaymentOrderStatus.Approved]: 'Validé',
  [BulkPaymentOrderStatus.Rejected]: 'Rejeté',
};

const STATUS_BADGE: Record<BulkPaymentOrderStatus, string> = {
  [BulkPaymentOrderStatus.Draft]: 'badge-brouillon',
  [BulkPaymentOrderStatus.Pending]: 'badge-attente',
  [BulkPaymentOrderStatus.Approved]: 'badge-valide',
  [BulkPaymentOrderStatus.Rejected]: 'badge-rejete',
};

@Component({
  selector: 'app-payments-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fetchMyBulkPaymentOrdersGQL: FetchMyBulkPaymentOrdersGQL,
  ) { }

  isLoading = true;
  orders: BulkPaymentOrder[] = [];

  pageSize = 12;
  pageIndex = 0;

  pendingSearch = '';
  pendingStatus = '';
  pendingApprover = '';
  pendingStartDate = '';
  pendingEndDate = '';

  appliedSearch = '';
  appliedStatus = '';
  appliedApprover = '';
  appliedStartDate = '';
  appliedEndDate = '';

  readonly statusOptions = Object.entries(STATUS_LABELS).map(([value, label]) => ({ value, label }));

  ngOnInit(): void {
    this.fetchMyBulkPaymentOrdersGQL.fetch({}, { fetchPolicy: 'network-only' }).subscribe({
      next: (res) => {
        this.orders = (res.data?.fetchMyBulkPaymentOrders ?? []) as BulkPaymentOrder[];
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; },
    });
  }

  get approverOptions(): string[] {
    const names = this.orders
      .flatMap(o => o.approvers ?? [])
      .map(a => `${a.firstName} ${a.lastName}`);
    return Array.from(new Set(names));
  }

  get filteredOrders(): BulkPaymentOrder[] {
    return this.orders.filter((o) => {
      const matchSearch = !this.appliedSearch ||
        (o.label ?? '').toLowerCase().includes(this.appliedSearch.toLowerCase());

      const matchStatus = !this.appliedStatus || o.status === this.appliedStatus;

      const matchApprover = !this.appliedApprover ||
        (o.approvers ?? []).some(a => `${a.firstName} ${a.lastName}` === this.appliedApprover);

      const matchDate = (() => {
        if (!o.createdAt) return !this.appliedStartDate && !this.appliedEndDate;
        const d = new Date(o.createdAt).getTime();
        const afterStart = !this.appliedStartDate || d >= new Date(this.appliedStartDate).getTime();
        const beforeEnd = !this.appliedEndDate || d <= new Date(this.appliedEndDate).getTime();
        return afterStart && beforeEnd;
      })();

      return matchSearch && matchStatus && matchApprover && matchDate;
    });
  }

  get paginatedOrders(): BulkPaymentOrder[] {
    const start = this.pageIndex * this.pageSize;
    return this.filteredOrders.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredOrders.length / this.pageSize));
  }

  get pageNumbers(): (number | '...')[] {
    const total = this.totalPages;
    const current = this.pageIndex + 1;
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    const pages: (number | '...')[] = [1, 2, 3, 4];
    if (current > 5) pages.push('...');
    pages.push(total);
    return pages;
  }

  get displayRangeStart(): number {
    return this.filteredOrders.length === 0 ? 0 : this.pageIndex * this.pageSize + 1;
  }

  get displayRangeEnd(): number {
    return Math.min((this.pageIndex + 1) * this.pageSize, this.filteredOrders.length);
  }

  goToPage(page: number | '...'): void {
    if (page === '...') return;
    this.pageIndex = page - 1;
  }

  prevPage(): void {
    if (this.pageIndex > 0) this.pageIndex--;
  }

  nextPage(): void {
    if (this.pageIndex < this.totalPages - 1) this.pageIndex++;
  }

  statusLabel(status: BulkPaymentOrderStatus): string {
    return STATUS_LABELS[status] ?? status;
  }

  statusBadge(status: BulkPaymentOrderStatus): string {
    return STATUS_BADGE[status] ?? 'badge-attente';
  }

  approversLabel(order: BulkPaymentOrder): string {
    return (order.approvers ?? []).map(a => `${a.firstName} ${a.lastName}`).join(' / ');
  }

  onApply(): void {
    this.appliedSearch = this.pendingSearch;
    this.appliedStatus = this.pendingStatus;
    this.appliedApprover = this.pendingApprover;
    this.appliedStartDate = this.pendingStartDate;
    this.appliedEndDate = this.pendingEndDate;
    this.pageIndex = 0;
  }

  onReset(): void {
    this.pendingSearch = '';
    this.pendingStatus = '';
    this.pendingApprover = '';
    this.pendingStartDate = '';
    this.pendingEndDate = '';
    this.appliedSearch = '';
    this.appliedStatus = '';
    this.appliedApprover = '';
    this.appliedStartDate = '';
    this.appliedEndDate = '';
    this.pageIndex = 0;
  }

  onViewDetails(order: BulkPaymentOrder): void {
    if (order.status === BulkPaymentOrderStatus.Draft) {
      if (order.type === BulkPaymentOrderType.FileImport) {
        this.router.navigate(['/dashboard/organization/payments/manual'], {
          queryParams: { orderId: order.id, recap: 'true' },
        });
      } else {
        this.router.navigate(['../payments/manual'], {
          relativeTo: this.route,
          queryParams: { orderId: order.id },
        });
      }
    } else {
      this.router.navigate(['/dashboard/payments/details', order.id]);
    }
  }
}
