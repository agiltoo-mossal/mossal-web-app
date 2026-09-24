import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { debounceTime, distinctUntilChanged, map, merge, startWith, switchMap } from 'rxjs';
import { first } from 'rxjs/operators';
import { Activity, FetchCurrentAdminGQL, FetchPaginatedActivitiesGQL, SubscriptionCode } from 'src/graphql/generated';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import * as XLSX from 'xlsx-js-style';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

type ExportFormat = 'csv' | 'xlsx' | 'pdf';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrl: './activities.component.scss'
})
export class ActivitiesComponent implements OnInit {
  dateRangeForm: FormGroup;

  // Les statuts "Validé"/"Payée" (demande) et "Approuvé" (paiement en masse) ne sont
  // proposés dans le filtre que si l'organisation est souscrite à l'offre correspondante.
  showSalaryAdvance = false;
  showBulkPayment = false;
  organizationName = '';

  searchForm: FormGroup;
  displayedColumns: string[] = [
    'message',
    'user',
    'email',
    'scope',
    'createdAt',
  ];

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  isExporting = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource = new MatTableDataSource<Activity>();

  page: number = 1;
  data = [];

  constructor(
    private fb: FormBuilder,
    private fetchPaginatedActivitiesGQL: FetchPaginatedActivitiesGQL,
    private fetchCurrentAdminGQL: FetchCurrentAdminGQL,
    private sanitizer: DomSanitizer
  ) {
    this.initSearchForm();
  }

  ngOnInit() {
    this.fetchCurrentAdminGQL.fetch({}, { fetchPolicy: 'no-cache' }).subscribe((result) => {
      const org = result.data.fetchCurrentAdmin?.organization;
      const codes = (org?.subscriptions ?? []).map((s) => s?.code).filter(Boolean);
      this.showSalaryAdvance = codes.includes(SubscriptionCode.SalaryAdvance);
      this.showBulkPayment = codes.includes(SubscriptionCode.BulkPayment);
      this.organizationName = org?.name ?? '';
    });
  }

  initSearchForm() {
    this.searchForm = this.fb.group({ search: [''], status: [''] });
    this.dateRangeForm = this.fb.group({ start: [null], end: [null] });
  }

  // --- Menu Période ---
  isDateMenuOpen = false;

  toggleDateMenu() {
    this.isDateMenuOpen = !this.isDateMenuOpen;
  }

  @ViewChild('periodToggle') periodToggle: ElementRef;
  @ViewChild('periodPanel') periodPanel: ElementRef;

  // --- Menu Export ---
  isExportMenuOpen = false;
  toggleExportMenu() {
    this.isExportMenuOpen = !this.isExportMenuOpen;
  }
  @ViewChild('exportToggle') exportToggle: ElementRef;
  @ViewChild('exportPanel') exportPanel: ElementRef;

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const target = event.target as HTMLElement;

    if (this.isDateMenuOpen &&
        !this.periodToggle?.nativeElement.contains(target) &&
        !this.periodPanel?.nativeElement.contains(target)) {
      this.isDateMenuOpen = false;
    }

    if (this.isExportMenuOpen &&
        !this.exportToggle?.nativeElement.contains(target) &&
        !this.exportPanel?.nativeElement.contains(target)) {
      this.isExportMenuOpen = false;
    }
  }

  getScopeLabel(scope: string): string {
    const labels: Record<string, string> = {
      bulk_payment: 'Paiement en masse',
      demande: "Demande d'avance",
    };
    return labels[scope] || scope;
  }

  getScopeClass(scope: string): string {
    const classes: Record<string, string> = {
      bulk_payment: 'scope-bulk',
      demande: 'scope-advance',
    };
    return classes[scope] || '';
  }

  formatMessage(message: string): SafeHtml {
    let html = this.escapeHtml(message); // échapper d'abord, cf. remarque XSS précédente

    // Supprime l'email entre parenthèses juste après le nom (ex: "John Doe (john@mail.com) a ...")
    html = html.replace(/\s*\([^()\s]+@[^()\s]+\)/g, '');

    html = html.replace(/^([^\n]+?) a /, '<strong>$1</strong> a ');

    html = html.replace(
      /\b(DRAFT|EN ATTENTE|PENDING|VALIDÉ|VALIDATED|REJETÉ|REJECTED|SOUMIS|SUBMITTED)\b/g,
      '<span class="text-status">$1</span>'
    );

    // Référence (PM-2026-00158, ADV-2026_0124) en orange gras
    html = html.replace(/\b([A-Z]{2,4}[-_]\d{4}[-_]\d+)\b/g,
      '<span class="text-ref">$1</span>');

    // Montants en vert gras
    html = html.replace(
      /([\d.,\s]+ XOF)/g,
      '<span class="text-amount">$1</span>'
    );

    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  private escapeHtml(str: string): string {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(
      this.sort.sortChange,
      this.paginator.page,
      this.searchForm.valueChanges.pipe(debounceTime(300), distinctUntilChanged()),
      this.dateRangeForm.valueChanges.pipe(debounceTime(300), distinctUntilChanged())
    )
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.fetchPaginatedActivitiesGQL.fetch(
            { queryFilter: this.buildQueryFilter(this.paginator.pageSize, this.paginator.pageIndex + 1) },
            { fetchPolicy: 'no-cache' }
          );
        }),
        map((result) => {
          this.isLoadingResults = false;
          this.isRateLimitReached = result === null;
          return result === null ? [] : result.data;
        })
      )
      .subscribe((data: any) => {
        this.data = data.fetchPaginatedActivities.results as any;
        this.dataSource.data = this.data as any;
        this.resultsLength = data.fetchPaginatedActivities.pagination.totalItems;
      });
  }

  resetFilters() {
    this.searchForm.reset({ search: '', status: '' });
    this.dateRangeForm.reset({ start: null, end: null });
    this.paginator.firstPage();
  }

  // --- Export ---

  private buildQueryFilter(limit: number, page: number) {
    const { search, status } = this.searchForm.value;
    const { start, end } = this.dateRangeForm.value;
    return {
      limit,
      page,
      search: search || undefined,
      status: status || undefined,
      startDate: start ? new Date(start).toISOString() : undefined,
      endDate: end ? new Date(end).toISOString() : undefined,
    };
  }

  private hasActiveFilters(): boolean {
    const { search, status } = this.searchForm.value;
    const { start, end } = this.dateRangeForm.value;
    return !!(search || status || start || end);
  }

  private fetchOnePage(limit: number, page: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.fetchPaginatedActivitiesGQL
        .fetch(
          { queryFilter: this.buildQueryFilter(limit, page) },
          { fetchPolicy: 'no-cache', errorPolicy: 'all' }
        )
        .pipe(first())
        .subscribe({
          next: (result) => resolve(result),
          error: (err) => reject(err),
        });
    });
  }

  /** Récupère toutes les entrées correspondant aux filtres actifs, page par page. */
  private async fetchAllForExport(): Promise<any[]> {
    const pageSize = 100;
    let page = 1;
    let all: any[] = [];
    let total = Infinity;

    while (all.length < total) {
      const result = await this.fetchOnePage(pageSize, page);

      if ((result as any)?.errors?.length) {
        console.warn('Certaines activités ont des données incomplètes:', (result as any).errors);
        // on continue avec les données partielles, pas d'interruption de l'export
      }

      const payload = (result as any)?.data?.fetchPaginatedActivities;
      if (!payload) break;

      all = all.concat(payload.results);
      total = payload.pagination.totalItems;
      page++;
    }

    return all;
  }

  private getExportFilename(format: ExportFormat): string {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10);
    const parts = ['journal-activites', dateStr];

    const { status } = this.searchForm.value;
    const { start, end } = this.dateRangeForm.value;

    if (status) parts.push(status.toLowerCase());
    if (start && end) {
      const fmt = (d: string) => new Date(d).toISOString().slice(0, 10);
      parts.push(`${fmt(start)}_au_${fmt(end)}`);
    }

    const ext = format === 'xlsx' ? 'xlsx' : format;
    return `${parts.join('_')}.${ext}`;
  }

  private buildExportRows(activities: any[]) {
    return activities
      .filter((row) => row != null)
      .map((row) => ({
        Message: this.stripHtml(row.message),
        'Fait par': row.user
          ? `${row.user.firstName ?? ''} ${row.user.lastName ?? ''}`.trim()
          : 'Utilisateur supprimé',
        Email: row.user?.email ?? '—',
        Scope: this.getScopeLabel(row.scope),
        Date: new Date(row.createdAt).toLocaleString('fr-FR'),
      }));
  }

  private stripHtml(message: string): string {
    return message.replace(/\s*\([^()\s]+@[^()\s]+\)/g, '');
  }

  async exportActivities(format: ExportFormat) {
    this.isExportMenuOpen = false;
    this.isExporting = true;
    try {
      const activities = await this.fetchAllForExport();

      if (!activities.length) {
        console.warn('Aucune activité à exporter pour les filtres actuels.');
        return;
      }

      const rows = this.buildExportRows(activities);
      const filename = this.getExportFilename(format);

      if (format === 'csv') {
        this.exportCsv(rows, filename);
      } else if (format === 'xlsx') {
        this.exportExcel(rows, filename);
      } else {
        this.exportPdf(rows, filename);
      }
    } catch (err) {
      console.error('Export échoué:', err);
      // remplacez par votre snackbar/toast habituel
    } finally {
      this.isExporting = false;
    }
  }

  private exportCsv(rows: Record<string, string>[], filename: string) {
    const headers = Object.keys(rows[0] ?? { Message: '', 'Fait par': '', Email: '', Scope: '', Date: '' });
    const escape = (v: string) => `"${(v ?? '').replace(/"/g, '""')}"`;
    const lines = [
      headers.join(','),
      ...rows.map((r) => headers.map((h) => escape(r[h])).join(',')),
    ];
    const blob = new Blob(['\uFEFF' + lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    this.downloadBlob(blob, filename);
  }

  private exportExcel(rows: Record<string, string>[], filename: string) {
    const worksheet = XLSX.utils.json_to_sheet(rows);

    const headerCount = Object.keys(rows[0] ?? {}).length;
    for (let c = 0; c < headerCount; c++) {
      const cellRef = XLSX.utils.encode_cell({ r: 0, c });
      if (worksheet[cellRef]) {
        worksheet[cellRef].s = {
          font: { bold: true, color: { rgb: 'FFFFFF' } },
          fill: { fgColor: { rgb: '061E5C' } },
        };
      }
    }
    worksheet['!cols'] = [{ wch: 50 }, { wch: 22 }, { wch: 28 }, { wch: 18 }, { wch: 20 }];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Activités');
    XLSX.writeFile(workbook, filename);
  }

  private exportPdf(rows: Record<string, string>[], filename: string) {
    const doc = new jsPDF({ orientation: 'landscape' });
    const now = new Date().toLocaleString('fr-FR');

    doc.setFontSize(14);
    doc.text(this.organizationName || 'Journal des activités', 14, 15);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Export du ${now}`, 14, 21);

    autoTable(doc, {
      startY: 26,
      head: [['Message', 'Fait par', 'Email', 'Scope', 'Date']],
      body: rows.map((r) => [r['Message'], r['Fait par'], r['Email'], r['Scope'], r['Date']]),
      styles: { fontSize: 8, cellWidth: 'wrap' },
      headStyles: { fillColor: [6, 30, 92] },
      columnStyles: { 0: { cellWidth: 90 } },
    });

    doc.save(filename);
  }

  private downloadBlob(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }
}