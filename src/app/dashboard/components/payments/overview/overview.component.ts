import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { BulkPaymentOrder, BulkPaymentOrderStatus, FetchMyBulkPaymentOrdersGQL } from 'src/graphql/generated';
// import * as XLSX from 'xlsx';
import * as XLSX from 'xlsx-js-style';

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
    if (order.status === BulkPaymentOrderStatus.Draft) {
      this.router.navigate(['../payments/manual'], {
        relativeTo: this.route,
        queryParams: { orderId: order.id },
      });
    } else {
      this.router.navigate(['/dashboard/payments/details', order.id]);
    }
  }

  onVoirHistorique(): void {
    // this.reinitialiser();
    this.router.navigate(['../payments/history'], { relativeTo: this.route });

  }

  //   onTelechargerModele(): void {
  //   // Feuille "Modèle" avec en-têtes + ligne d'exemple
  //   const modeleRows = [
  //     ['Nom', 'Prénom', 'Téléphone', 'Montant', 'Motif', 'Opérateur'],
  //     ['Diallo', 'Moussa', '774757895', 5000, 'Salaire Mars', 'Wave'],
  //   ];

  //   // Feuille "Instructions"
  //   const instructionsRows = [
  //     ['Champ', 'Règle', 'Exemple valide', 'Exemple invalide'],
  //     ['Nom', 'Obligatoire, non vide', 'Diallo', ''],
  //     ['Prénom', 'Obligatoire, non vide', 'Moussa', ''],
  //     ['Téléphone', '9 chiffres, préfixe 77/70/76/78/75', '774757895', '654789632'],
  //     ['Montant', 'Nombre supérieur à 0', '5000', '-100, abc'],
  //     ['Motif', 'Obligatoire, non vide', 'Salaire Mars', ''],
  //     ['Opérateur', 'Orange Money, Wave ou Free Money', 'Wave', 'MTN'],
  //   ];

  //   this.convertToXLSXMultiSheet(
  //     [
  //       { name: 'Modèle', rows: modeleRows },
  //       { name: 'Instructions', rows: instructionsRows },
  //     ],
  //     'modele_import_paiements'
  //   );
  // }


  onTelechargerModele(): void {
  const modeleRows = [
    ['Nom', 'Prénom', 'Téléphone', 'Montant', 'Motif', 'Opérateur'],
    ['Diallo', 'Moussa', '774757895', 5000, 'Salaire Mars', 'Wave'],
  ];

  const instructionsRows = [
    ['Règles métier récapitulées: Instructions de remplissage'],
    ['Champ', 'Règle', 'Exemple valide', 'Exemple invalide'],
    ['Nom', 'Obligatoire, non vide', 'Diallo', ''],
    ['Prénom', 'Obligatoire, non vide', 'Moussa', ''],
    ['Téléphone', '9 chiffres, préfixe 77/70/76/78/75', '774757895', '654789632'],
    ['Montant', 'Nombre supérieur à 0', '5000', '-100, abc'],
    ['Motif', 'Obligatoire, non vide', 'Salaire Mars', ''],
    ['Opérateur', 'Orange Money, Wave ou Free Money', 'Wave', 'MTN'],
  ];

  const wsModele = this.buildStyledSheet(modeleRows, { headerRow: 0 });
  const wsInstructions = this.buildStyledSheet(instructionsRows, {
    titleRow: 0,
    headerRow: 1,
    mergeTitleCols: 4,
  });

  const workbook: XLSX.WorkBook = { Sheets: {}, SheetNames: [] };
  workbook.Sheets['Modèle'] = wsModele;
  workbook.SheetNames.push('Modèle');
  workbook.Sheets['Instructions'] = wsInstructions;
  workbook.SheetNames.push('Instructions');

  const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  this.saveAsExcelFile(excelBuffer, 'modele_import_paiements');
}

private buildStyledSheet(
  rows: any[][],
  opts: { headerRow: number; titleRow?: number; mergeTitleCols?: number }
): XLSX.WorkSheet {
  const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(rows);

  const thinBorder = {
    top: { style: 'thin', color: { rgb: '000000' } },
    bottom: { style: 'thin', color: { rgb: '000000' } },
    left: { style: 'thin', color: { rgb: '000000' } },
    right: { style: 'thin', color: { rgb: '000000' } },
  };

  const range = XLSX.utils.decode_range(ws['!ref']!);

  for (let R = range.s.r; R <= range.e.r; R++) {
    for (let C = range.s.c; C <= range.e.c; C++) {
      const addr = XLSX.utils.encode_cell({ r: R, c: C });
      if (!ws[addr]) continue;

      const isTitle = opts.titleRow !== undefined && R === opts.titleRow;
      const isHeader = R === opts.headerRow;

      ws[addr].s = {
        border: isTitle ? undefined : thinBorder,
        font: {
          bold: isTitle || isHeader,
          sz: isTitle ? 12 : 11,
        },
        fill: isHeader
          ? { fgColor: { rgb: 'D9E1F2' } }
          : undefined,
        alignment: {
          vertical: 'center',
          horizontal: isTitle ? 'center' : 'left',
          wrapText: true,
        },
      };
    }
  }

  // Fusionner la ligne de titre sur plusieurs colonnes
  if (opts.titleRow !== undefined && opts.mergeTitleCols) {
    ws['!merges'] = [
      { s: { r: opts.titleRow, c: 0 }, e: { r: opts.titleRow, c: opts.mergeTitleCols - 1 } },
    ];
  }

  // Largeur des colonnes
  ws['!cols'] = [
    { wch: 12 }, { wch: 35 }, { wch: 18 }, { wch: 18 },
  ];

  return ws;
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
