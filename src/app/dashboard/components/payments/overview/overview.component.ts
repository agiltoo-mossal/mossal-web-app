import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
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
  selector: 'app-payments',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fetchMyBulkPaymentOrdersGQL: FetchMyBulkPaymentOrdersGQL,
  ) { }

  isLoading = true;
  pageSize = 10;
  pageIndex = 0;

  private _searchText = '';
  private _selectedStatut = '';
  private _selectedDate = '';

  get searchText() { return this._searchText; }
  set searchText(v: string) { this._searchText = v; this.resetPage(); }

  get selectedStatut() { return this._selectedStatut; }
  set selectedStatut(v: string) { this._selectedStatut = v; this.resetPage(); }

  get selectedDate() { return this._selectedDate; }
  set selectedDate(v: string) { this._selectedDate = v; this.resetPage(); }

  orders: BulkPaymentOrder[] = [];

  readonly statusOptions = Object.entries(STATUS_LABELS).map(([value, label]) => ({ value, label }));

  readonly dateOptions: { value: string; label: string }[] = (() => {
    const now = new Date();
    const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    const options: { value: string; label: string }[] = [];
    for (let m = 0; m <= now.getMonth(); m++) {
      options.push({ value: `${now.getFullYear()}-${String(m + 1).padStart(2, '0')}`, label: `${months[m]} ${now.getFullYear()}` });
    }
    return options;
  })();

  ngOnInit(): void {
    this.fetchMyBulkPaymentOrdersGQL.fetch({}, { fetchPolicy: 'network-only' }).subscribe({
      next: (res) => {
        this.orders = (res.data?.fetchMyBulkPaymentOrders ?? []) as BulkPaymentOrder[];
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; },
    });
  }

  get filteredOrders(): BulkPaymentOrder[] {
    const search = this.searchText.toLowerCase();
    return this.orders.filter((o) => {
      const matchSearch = !search || o.label?.toLowerCase().includes(search);
      const matchStatut = !this.selectedStatut || o.status === this.selectedStatut;
      const matchDate = !this.selectedDate || (() => {
        if (!o.createdAt) return false;
        const d = new Date(o.createdAt);
        const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        return ym === this.selectedDate;
      })();
      return matchSearch && matchStatut && matchDate;
    });
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

  resetPage(): void {
    this.pageIndex = 0;
  }

  onPageChange(event: { pageIndex: number; pageSize: number }): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  get paginatedOrders(): BulkPaymentOrder[] {
    const start = this.pageIndex * this.pageSize;
    return this.filteredOrders.slice(start, start + this.pageSize);
  }

  reinitialiser(): void {
    this.searchText = '';
    this.selectedStatut = '';
    this.selectedDate = '';
  }

  onImporterFichier(): void {
    this.router.navigate(['../payments/import'], { relativeTo: this.route });
  }

  onGestionManuelle(): void {
    this.router.navigate(['../payments/manual'], { relativeTo: this.route });
  }

  onVoirDetails(order: BulkPaymentOrder): void {
    this.router.navigate([order.id], { relativeTo: this.route });
  }

  onVoirHistorique(): void {
    this.reinitialiser();
  }
}
