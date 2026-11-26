import { Component, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import * as XLSX from 'xlsx';
import {
  DemandeStatus,
  DemandesMetricsInput,
  FetchPaginatedDemandesByOrganizationGQL,
  FetchOrganizationGQL,
  FetchPaginatedDemandesByOrganizationQuery,
  QueryDataConfigInput,
} from 'src/graphql/generated';
import { SnackBarService } from 'src/app/shared/services/snackbar.service';

type DemandeRow = FetchPaginatedDemandesByOrganizationQuery['fetchPaginatedDemandesByOrganization']['results'][number];

// Mêmes libellés que le pipe demandeStatus.
const STATUS_LABELS: Record<DemandeStatus, string> = {
  [DemandeStatus.Pending]: 'En attente',
  [DemandeStatus.Validated]: 'Validée',
  [DemandeStatus.InProcess]: 'En cours',
  [DemandeStatus.Payed]: 'Remboursée',
  [DemandeStatus.Rejected]: 'Rejetée',
  [DemandeStatus.Cancelled]: 'Annulée',
};

// Classes de badge définies dans historyComponent/history.component.scss.
const STATUS_BADGES: Record<DemandeStatus, string> = {
  [DemandeStatus.Pending]: 'badge-attente',
  [DemandeStatus.Validated]: 'badge-cours', // bleu #1956F0
  [DemandeStatus.InProcess]: 'badge-cours',
  [DemandeStatus.Payed]: 'badge-succes',
  [DemandeStatus.Rejected]: 'badge-rejete',
  [DemandeStatus.Cancelled]: 'badge-brouillon',
};

/**
 * Super admin Mossall : liste des demandes d'une société
 * (Sociétés -> Action -> « Liste des demandes »).
 */
@Component({
  selector: 'app-society-demandes',
  templateUrl: './society-demandes.component.html',
  styleUrls: [
    '../../../historyComponent/history.component.scss',
    './society-demandes.component.scss',
  ],
})
export class SocietyDemandesComponent implements OnInit {
  organizationId = '';
  organizationName = '';
  demandes: DemandeRow[] = [];
  isLoading = true;
  isExporting = false;

  // Valeurs saisies dans les filtres ; appliquées seulement au clic sur « Appliquer ».
  pendingSearch = '';
  pendingStartDate = '';
  pendingEndDate = '';
  pendingStatus: DemandeStatus | '' = '';
  private applied = { search: '', startDate: '', endDate: '', status: '' as DemandeStatus | '' };

  readonly statusOptions = Object.entries(STATUS_LABELS).map(([value, label]) => ({ value, label }));

  readonly pageSize = 12;
  pageIndex = 0;
  totalItems = 0;
  totalPages = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fetchDemandesGQL: FetchPaginatedDemandesByOrganizationGQL,
    private fetchOrganizationGQL: FetchOrganizationGQL,
    private snackBarService: SnackBarService,
  ) {}

  ngOnInit(): void {
    this.organizationId = this.route.snapshot.paramMap.get('id') ?? '';
    if (!this.organizationId) {
      this.isLoading = false;
      return;
    }
    this.load();
    // Nom de la société pour le fichier exporté ; en cas d'échec, le fichier s'appelle « liste-des-demandes ».
    this.fetchOrganizationGQL.fetch({ organizationId: this.organizationId }).subscribe({
      next: ({ data }) => { this.organizationName = data?.fetchOrganization?.name ?? ''; },
      error: () => { this.organizationName = ''; },
    });
  }

  private buildVariables(page: number, limit: number) {
    const metricsInput: DemandesMetricsInput = {};
    if (this.applied.startDate) metricsInput.startDate = this.applied.startDate;
    if (this.applied.endDate) metricsInput.endDate = this.applied.endDate;
    if (this.applied.status) metricsInput.status = this.applied.status;

    const queryFilter: QueryDataConfigInput = { page, limit };
    if (this.applied.search) queryFilter.search = this.applied.search;

    return { organizationId: this.organizationId, metricsInput, queryFilter };
  }

  load(): void {
    this.isLoading = true;
    this.fetchDemandesGQL
      .fetch(this.buildVariables(this.pageIndex + 1, this.pageSize), { fetchPolicy: 'no-cache' })
      .subscribe({
        next: ({ data }) => {
          const result = data?.fetchPaginatedDemandesByOrganization;
          this.demandes = result?.results ?? [];
          this.totalItems = result?.pagination.totalItems ?? 0;
          this.totalPages = result?.pagination.pageCount ?? 0;
          this.isLoading = false;
        },
        error: () => {
          this.demandes = [];
          this.isLoading = false;
          this.snackBarService.showErrorSnackBar(4000, 'Impossible de charger la liste des demandes.');
        },
      });
  }

  onApply(): void {
    this.applied = {
      search: this.pendingSearch.trim(),
      startDate: this.pendingStartDate,
      endDate: this.pendingEndDate,
      status: this.pendingStatus,
    };
    this.pageIndex = 0;
    this.load();
  }

  onReset(): void {
    this.pendingSearch = '';
    this.pendingStartDate = '';
    this.pendingEndDate = '';
    this.pendingStatus = '';
    this.onApply();
  }

  // ---------- Affichage ----------

  collaboratorName(d: DemandeRow): string {
    return d.collaborator ? `${d.collaborator.firstName ?? ''} ${d.collaborator.lastName ?? ''}`.trim() : '—';
  }

  totalCost(d: DemandeRow): number {
    return (d.amount ?? 0) + (d.fees ?? 0);
  }

  statusLabel(s: DemandeStatus): string {
    return STATUS_LABELS[s] ?? s;
  }

  statusBadge(s: DemandeStatus): string {
    return STATUS_BADGES[s] ?? 'badge-brouillon';
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

  prevPage(): void {
    if (this.pageIndex > 0) this.goToPage(this.pageIndex);
  }

  nextPage(): void {
    if (this.pageIndex < this.totalPages - 1) this.goToPage(this.pageIndex + 2);
  }

  // ---------- Export ----------

  // Exporte toutes les demandes correspondant aux filtres appliqués (pas seulement la page affichée).
  exportList(): void {
    if (!this.totalItems || this.isExporting) return;
    this.isExporting = true;
    this.fetchDemandesGQL
      .fetch(this.buildVariables(1, this.totalItems), { fetchPolicy: 'no-cache' })
      .subscribe({
        next: ({ data }) => {
          const rows = data?.fetchPaginatedDemandesByOrganization.results ?? [];
          const sheet = XLSX.utils.aoa_to_sheet([
            ['Matricule', 'Collaborateur', 'Date', 'N° de la demande', 'Montant', 'Frais', 'Coût total', 'Statut'],
            ...rows.map((d) => [
              d.collaborator?.uniqueIdentifier ?? '',
              this.collaboratorName(d),
              formatDate(d.createdAt, 'dd/MM/yyyy', 'fr'),
              d.number,
              d.amount,
              d.fees,
              this.totalCost(d),
              this.statusLabel(d.status),
            ]),
          ]);
          const workbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbook, sheet, 'Demandes');
          XLSX.writeFile(workbook, `${this.exportFileName()}.xlsx`);
          this.isExporting = false;
        },
        error: () => {
          this.isExporting = false;
          this.snackBarService.showErrorSnackBar(4000, "Impossible d'exporter la liste des demandes.");
        },
      });
  }

  // « liste-des-demandes-NomOrg » ; seuls les caractères interdits dans un nom de fichier sont remplacés.
  private exportFileName(): string {
    const orgName = this.organizationName.trim().replace(/[\\/:*?"<>|]/g, '-');
    return orgName ? `liste-des-demandes-${orgName}` : 'liste-des-demandes';
  }

  retour(): void {
    this.router.navigate(['/dashboard/society']);
  }
}
