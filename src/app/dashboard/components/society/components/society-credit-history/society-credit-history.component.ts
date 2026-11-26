import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as XLSX from 'xlsx';

export interface CreditHistoryRow {
  label: string;
  date: string; // ISO yyyy-MM-dd
  amount: number;
  initiatorId: string;
  initiatorName: string;
  email: string;
  phone: string;
}

// TODO: remplacer par l'appel GraphQL quand le backend sera prêt.
const MOCK_DATA: CreditHistoryRow[] = [
  { label: 'Rechargement décembre', date: '2026-05-15', amount: 2320000, initiatorId: '1', initiatorName: 'Khadija Sarr', email: 'ksarr@gmail.com', phone: '+221 77 123 45 67' },
  { label: 'Rechargement Novembre', date: '2026-04-14', amount: 950000, initiatorId: '2', initiatorName: 'Anta Diop', email: 'adiop@gmail.com', phone: '+221 77 123 45 67' },
  { label: 'Rechargement décembre', date: '2026-03-12', amount: 1100000, initiatorId: '1', initiatorName: 'Khadija Sarr', email: 'ksarr@gmail.com', phone: '+221 77 123 45 67' },
  { label: 'Paiement Février 2026', date: '2026-02-12', amount: 748000, initiatorId: '3', initiatorName: 'Ousseynou Diop', email: 'od@gmail.com', phone: '+221 77 123 45 67' },
  { label: 'Paiement Janvier 2026', date: '2026-01-02', amount: 1230000, initiatorId: '1', initiatorName: 'Khadija Sarr', email: 'ksarr@gmail.com', phone: '+221 77 123 45 67' },
  { label: 'Paiement Décembre 2025', date: '2025-12-02', amount: 320000, initiatorId: '2', initiatorName: 'Anta Diop', email: 'adiop@gmail.com', phone: '+221 77 123 45 67' },
  { label: 'Paiement Novembre 2025', date: '2025-11-01', amount: 900000, initiatorId: '3', initiatorName: 'Ousseynou Diop', email: 'od@gmail.com', phone: '+221 77 123 45 67' },
  { label: 'Paiement Octobre 2025', date: '2025-10-08', amount: 457000, initiatorId: '2', initiatorName: 'Anta Diop', email: 'adiop@gmail.com', phone: '+221 77 123 45 67' },
  { label: 'Paiement Septembre 2025', date: '2025-09-05', amount: 640000, initiatorId: '1', initiatorName: 'Khadija Sarr', email: 'ksarr@gmail.com', phone: '+221 77 123 45 67' },
  { label: 'Paiement Août 2025', date: '2025-08-06', amount: 743000, initiatorId: '3', initiatorName: 'Ousseynou Diop', email: 'od@gmail.com', phone: '+221 77 123 45 67' },
  { label: 'Paiement Juillet 2025', date: '2025-07-02', amount: 1200000, initiatorId: '2', initiatorName: 'Anta Diop', email: 'adiop@gmail.com', phone: '+221 77 123 45 67' },
  { label: 'Paiement Juin 2025', date: '2025-06-19', amount: 2320000, initiatorId: '3', initiatorName: 'Ousseynou Diop', email: 'od@gmail.com', phone: '+221 77 123 45 67' },
  { label: 'Rechargement Mai 2025', date: '2025-05-10', amount: 500000, initiatorId: '1', initiatorName: 'Khadija Sarr', email: 'ksarr@gmail.com', phone: '+221 77 123 45 67' },
  { label: 'Rechargement Avril 2025', date: '2025-04-08', amount: 800000, initiatorId: '2', initiatorName: 'Anta Diop', email: 'adiop@gmail.com', phone: '+221 77 123 45 67' },
];

@Component({
  selector: 'app-society-credit-history',
  templateUrl: './society-credit-history.component.html',
  styleUrls: [
    '../../../historyComponent/history.component.scss',
    './society-credit-history.component.scss',
  ],
})
export class SocietyCreditHistoryComponent implements OnInit {
  organizationId = '';
  isLoading = true;
  isExporting = false;

  rows: CreditHistoryRow[] = [];

  // Filtres saisis (appliqués au clic sur « Appliquer »)
  pendingSearch = '';
  pendingStartDate = '';
  pendingEndDate = '';
  pendingInitiator = '';
  private applied = { search: '', startDate: '', endDate: '', initiator: '' };

  readonly initiatorOptions = [
    { value: '1', label: 'Khadija Sarr' },
    { value: '2', label: 'Anta Diop' },
    { value: '3', label: 'Ousseynou Diop' },
  ];

  readonly pageSize = 12;
  pageIndex = 0;
  totalItems = 0;
  totalPages = 0;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.organizationId = this.route.snapshot.paramMap.get('id') ?? '';
    this.load();
  }

  // Simule l'appel serveur : filtre + pagination sur les données mockées.
  private filtered(): CreditHistoryRow[] {
    const { search, startDate, endDate, initiator } = this.applied;
    const s = search.toLowerCase();
    return MOCK_DATA.filter((r) =>
      (!s || r.label.toLowerCase().includes(s)) &&
      (!startDate || r.date >= startDate) &&
      (!endDate || r.date <= endDate) &&
      (!initiator || r.initiatorId === initiator),
    );
  }

  load(): void {
    this.isLoading = true;
    setTimeout(() => {
      const all = this.filtered();
      this.totalItems = all.length;
      this.totalPages = Math.ceil(all.length / this.pageSize);
      const start = this.pageIndex * this.pageSize;
      this.rows = all.slice(start, start + this.pageSize);
      this.isLoading = false;
    }, 300);
  }

  onApply(): void {
    this.applied = {
      search: this.pendingSearch.trim(),
      startDate: this.pendingStartDate,
      endDate: this.pendingEndDate,
      initiator: this.pendingInitiator,
    };
    this.pageIndex = 0;
    this.load();
  }

  onReset(): void {
    this.pendingSearch = '';
    this.pendingStartDate = '';
    this.pendingEndDate = '';
    this.pendingInitiator = '';
    this.onApply();
  }

  // ---------- Pagination ----------
  get displayRangeStart(): number {
    return this.totalItems ? this.pageIndex * this.pageSize + 1 : 0;
  }
  get displayRangeEnd(): number {
    return Math.min((this.pageIndex + 1) * this.pageSize, this.totalItems);
  }
  get pageNumbers(): (number | '...')[] {
    const total = this.totalPages;
    const current = this.pageIndex + 1;
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const pages: (number | '...')[] = [1];
    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);
    if (start > 2) pages.push('...');
    for (let p = start; p <= end; p++) pages.push(p);
    if (end < total - 1) pages.push('...');
    pages.push(total);
    return pages;
  }
  goToPage(p: number | '...'): void {
    if (p === '...' || p - 1 === this.pageIndex) return;
    this.pageIndex = p - 1;
    this.load();
  }
  prevPage(): void { if (this.pageIndex > 0) this.goToPage(this.pageIndex); }
  nextPage(): void { if (this.pageIndex < this.totalPages - 1) this.goToPage(this.pageIndex + 2); }

  // ---------- Export ----------
  exportList(): void {
    if (!this.totalItems || this.isExporting) return;
    this.isExporting = true;
    const all = this.filtered();
    const sheet = XLSX.utils.aoa_to_sheet([
      ['Libellé / opération', 'Date', 'Montant', 'Initiateur', 'Adresse mail', 'Numéro de téléphone'],
      ...all.map((r) => [r.label, r.date.split('-').reverse().join('/'), r.amount, r.initiatorName, r.email, r.phone]),
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, sheet, 'Historique des crédits');
    XLSX.writeFile(wb, 'historique-des-credits.xlsx');
    this.isExporting = false;
  }

  retour(): void {
    this.router.navigate(['/dashboard/society']);
  }
}