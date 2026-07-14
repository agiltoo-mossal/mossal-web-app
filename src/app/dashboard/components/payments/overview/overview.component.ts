import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { BulkPaymentOrder, BulkPaymentOrderStatus, FetchMyBulkPaymentOrdersGQL } from 'src/graphql/generated';
import * as XLSX from 'xlsx';
import { BulkPaymentFileService } from 'src/app/shared/services/bulk-payment-file.service';

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
  EXCEL_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  EXCEL_EXTENSION = '.xlsx';

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fetchMyBulkPaymentOrdersGQL: FetchMyBulkPaymentOrdersGQL,
    private bulkPaymentFileService: BulkPaymentFileService,
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

  onFileImported(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;
    this.bulkPaymentFileService.set(file);
    this.router.navigate(['../payments/import'], { relativeTo: this.route });
  }

  onGestionManuelle(): void {
    this.router.navigate(['../payments/manual'], { relativeTo: this.route });
  }

  onVoirDetails(order: BulkPaymentOrder): void {
    if (order.status === BulkPaymentOrderStatus.Draft) {
      if (order.type === 'FILE_IMPORT') {
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

  onVoirHistorique(): void {
    // this.reinitialiser();
    this.router.navigate(['../payments/history'], { relativeTo: this.route });

  }

    onTelechargerModele(): void {
    // Feuille "Modèle" avec en-têtes + ligne d'exemple
    const modeleRows = [
      ['Nom', 'Prénom', 'Téléphone', 'Montant', 'Motif', 'Opérateur'],
      ['Diallo', 'Moussa', '774757895', 5000, 'Salaire Mars', 'Wave'],
    ];

    // Feuille "Instructions"
    const instructionsRows = [
      ['Champ', 'Règle', 'Exemple valide', 'Exemple invalide'],
      ['Nom', 'Obligatoire, non vide', 'Diallo', ''],
      ['Prénom', 'Obligatoire, non vide', 'Moussa', ''],
      ['Téléphone', '9 chiffres, préfixe 77/70/76/78/75', '774757895', '654789632'],
      ['Montant', 'Nombre supérieur à 0', '5000', '-100, abc'],
      ['Motif', 'Obligatoire, non vide', 'Salaire Mars', ''],
      ['Opérateur', 'Orange Money, Wave ou Free Money', 'Wave', 'MTN'],
    ];

    this.convertToXLSXMultiSheet(
      [
        { name: 'Modèle', rows: modeleRows },
        { name: 'Instructions', rows: instructionsRows },
      ],
      'modele_import_paiements'
    );
  }

  convertToXLSXMultiSheet(
    sheets: { name: string; rows: any[][] }[],
    filename: string
  ): void {
    const workbook: XLSX.WorkBook = {
      Sheets: {},
      SheetNames: [],
    };

    sheets.forEach(({ name, rows }) => {
      const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(rows);
      workbook.Sheets[name] = worksheet;
      workbook.SheetNames.push(name);
    });

    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    this.saveAsExcelFile(excelBuffer, filename);
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: this.EXCEL_TYPE });
    const url = window.URL.createObjectURL(data);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `${fileName}${this.EXCEL_EXTENSION}`);
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
