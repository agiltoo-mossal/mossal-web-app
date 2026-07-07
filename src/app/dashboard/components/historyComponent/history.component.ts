import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BulkPaymentOrder, BulkPaymentOrderStatus, FetchMyBulkPaymentOrdersGQL } from 'src/graphql/generated';

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

  // Valeurs "en attente" liées aux champs du formulaire de filtre
  pendingSearch = '';
  pendingStatut = '';
  pendingApprobateur = '';
  pendingStartDate = '';
  pendingEndDate = '';

  // Valeurs réellement appliquées à la liste (mises à jour au clic sur "Appliquer")
  appliedSearch = '';
  appliedStatut = '';
  appliedApprobateur = '';
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

  // Libellés distincts pour peupler le select "Recherche"
  get labelOptions(): string[] {
    const labels = this.orders.map(o => o.label).filter((l): l is string => !!l);
    return Array.from(new Set(labels));
  }

  // Approbateurs distincts pour peupler le select "Approbateur"
  get approbateurOptions(): string[] {
    const names = this.orders
      .flatMap(o => o.approvers ?? [])
      .map(a => `${a.firstName} ${a.lastName}`);
    return Array.from(new Set(names));
  }

  get filteredOrders(): BulkPaymentOrder[] {
    return this.orders.filter((o) => {
      const matchSearch = !this.appliedSearch || o.label === this.appliedSearch;

      const matchStatut = !this.appliedStatut || o.status === this.appliedStatut;

      const matchApprobateur = !this.appliedApprobateur ||
        (o.approvers ?? []).some(a => `${a.firstName} ${a.lastName}` === this.appliedApprobateur);

      const matchDate = (() => {
        if (!o.createdAt) return !this.appliedStartDate && !this.appliedEndDate;
        const d = new Date(o.createdAt).getTime();
        const afterStart = !this.appliedStartDate || d >= new Date(this.appliedStartDate).getTime();
        const beforeEnd = !this.appliedEndDate || d <= new Date(this.appliedEndDate).getTime();
        return afterStart && beforeEnd;
      })();

      return matchSearch && matchStatut && matchApprobateur && matchDate;
    });
  }

  get paginatedOrders(): BulkPaymentOrder[] {
    const start = this.pageIndex * this.pageSize;
    return this.filteredOrders.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredOrders.length / this.pageSize));
  }

  // Numéros de page affichés, avec "..." si beaucoup de pages (comme sur la maquette : 1 2 3 4 ... 8)
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

  onAppliquer(): void {
    this.appliedSearch = this.pendingSearch;
    this.appliedStatut = this.pendingStatut;
    this.appliedApprobateur = this.pendingApprobateur;
    this.appliedStartDate = this.pendingStartDate;
    this.appliedEndDate = this.pendingEndDate;
    this.pageIndex = 0;
  }

  onReinitialiser(): void {
    this.pendingSearch = '';
    this.pendingStatut = '';
    this.pendingApprobateur = '';
    this.pendingStartDate = '';
    this.pendingEndDate = '';
    this.appliedSearch = '';
    this.appliedStatut = '';
    this.appliedApprobateur = '';
    this.appliedStartDate = '';
    this.appliedEndDate = '';
    this.pageIndex = 0;
  }

  onVoirDetails(order: BulkPaymentOrder): void {
    if (order.status === BulkPaymentOrderStatus.Draft) {
      this.router.navigate(['../payments/manual'], {
        relativeTo: this.route,
        queryParams: { orderId: order.id },
      });
    } else {
      this.router.navigate(['/dashboard/payments/details', order.id]);
    }
  }
}