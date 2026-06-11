import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { BulkPayment, BulkPaymentStatus, FetchMyBulkPaymentsGQL } from 'src/graphql/generated';

const STATUS_LABELS: Record<BulkPaymentStatus, string> = {
  [BulkPaymentStatus.Pending]:   'En attente',
  [BulkPaymentStatus.InProcess]: 'En cours',
  [BulkPaymentStatus.Validated]: 'Validé',
  [BulkPaymentStatus.Payed]:     'Payé',
  [BulkPaymentStatus.Rejected]:  'Rejeté',
  [BulkPaymentStatus.Cancelled]: 'Annulé',
};

const STATUS_BADGE: Record<BulkPaymentStatus, string> = {
  [BulkPaymentStatus.Pending]:   'badge-attente',
  [BulkPaymentStatus.InProcess]: 'badge-en-cours',
  [BulkPaymentStatus.Validated]: 'badge-valide',
  [BulkPaymentStatus.Payed]:     'badge-valide',
  [BulkPaymentStatus.Rejected]:  'badge-rejete',
  [BulkPaymentStatus.Cancelled]: 'badge-rejete',
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
    private fetchMyBulkPaymentsGQL: FetchMyBulkPaymentsGQL,
  ) {}

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

  bulkPayments: BulkPayment[] = [];

  readonly statusOptions = Object.entries(STATUS_LABELS).map(([value, label]) => ({ value, label }));

  readonly dateOptions: { value: string; label: string }[] = (() => {
    const now = new Date();
    const months = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
    const options: { value: string; label: string }[] = [];
    for (let m = 0; m <= now.getMonth(); m++) {
      options.push({ value: `${now.getFullYear()}-${String(m + 1).padStart(2, '0')}`, label: `${months[m]} ${now.getFullYear()}` });
    }
    return options;
  })();

  ngOnInit(): void {
    this.fetchMyBulkPaymentsGQL.fetch({}, { fetchPolicy: 'network-only' }).subscribe({
      next: (res) => {
        this.bulkPayments = (res.data?.fetchMyBulkPayments ?? []) as BulkPayment[];
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  get filteredPayments(): BulkPayment[] {
    const search = this.searchText.toLowerCase();
    return this.bulkPayments.filter((p) => {
      const matchSearch = !search ||
        p.firstName?.toLowerCase().includes(search) ||
        p.lastName?.toLowerCase().includes(search) ||
        p.phoneNumber?.includes(search) ||
        String(p.number)?.includes(search);
      const matchStatut = !this.selectedStatut || p.status === this.selectedStatut;
      const matchDate = !this.selectedDate || (() => {
        if (!p.createdAt) return false;
        const d = new Date(p.createdAt);
        const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        return ym === this.selectedDate;
      })();
      return matchSearch && matchStatut && matchDate;
    });
  }

  statusLabel(status: BulkPaymentStatus): string {
    return STATUS_LABELS[status] ?? status;
  }

  statusBadge(status: BulkPaymentStatus): string {
    return STATUS_BADGE[status] ?? 'badge-attente';
  }

  formatNumber(n?: number | null): string {
    if (n == null) return '—';
    const year = new Date().getFullYear().toString().slice(-2);
    return `${year}-${String(n).padStart(3, '0')}`;
  }

  resetPage(): void {
    this.pageIndex = 0;
  }

  onPageChange(event: { pageIndex: number; pageSize: number }): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  get paginatedPayments(): BulkPayment[] {
    const start = this.pageIndex * this.pageSize;
    return this.filteredPayments.slice(start, start + this.pageSize);
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
}
