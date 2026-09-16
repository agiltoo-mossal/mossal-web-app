import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { debounceTime, distinctUntilChanged, map, merge, startWith, switchMap } from 'rxjs';
import { Activity, FetchCurrentAdminGQL, FetchPaginatedActivitiesGQL, SubscriptionCode } from 'src/graphql/generated';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

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
      const codes = (result.data.fetchCurrentAdmin?.organization?.subscriptions ?? [])
        .map((s) => s?.code)
        .filter(Boolean);
      this.showSalaryAdvance = codes.includes(SubscriptionCode.SalaryAdvance);
      this.showBulkPayment = codes.includes(SubscriptionCode.BulkPayment);
    });
  }

  initSearchForm() {
    this.searchForm = this.fb.group({
      search: [''],
      status: [''],
    });
    this.dateRangeForm = this.fb.group({
      start: [null],
      end: [null],
    });
  }

  isDateMenuOpen = false;

  toggleDateMenu() {
    this.isDateMenuOpen = !this.isDateMenuOpen;
  }

  @ViewChild('periodToggle') periodToggle: ElementRef;
  @ViewChild('periodPanel') periodPanel: ElementRef;

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (!this.isDateMenuOpen) {
      return;
    }
    const target = event.target as HTMLElement;
    if (
      !this.periodToggle?.nativeElement.contains(target) &&
      !this.periodPanel?.nativeElement.contains(target)
    ) {
      this.isDateMenuOpen = false;
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

      html = html.replace(/^([^\n]+?) a /, '<strong>$1</strong> a ');

      // Statuts en orange gras
      html = html.replace(/\b(EN ATTENTE|PENDING|VALIDÉ|VALIDATED|REJETÉ|REJECTED)\b/g,
        '<span class="text-status">$1</span>');

      // Référence (PM-2026-00158, ADV-2026_0124) en orange gras aussi
      html = html.replace(/\b([A-Z]{2,4}[-_]\d{4}[-_]\d+)\b/g,
        '<span class="text-ref">$1</span>');

      // Montants en vert gras
      html = html.replace(/([\d.,\s]+ XOF)/g, '<span class="text-amount">$1</span>');

      html = html.replace(
        /\b(DRAFT|EN ATTENTE|PENDING|VALIDÉ|VALIDATED|REJETÉ|REJECTED|SOUMIS|SUBMITTED)\b/g,
        '<span class="text-status">$1</span>'
      );

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
          const { search, status } = this.searchForm.value;
          const { start, end } = this.dateRangeForm.value;

          const queryFilter = {
            limit: this.paginator.pageSize,
            page: this.paginator.pageIndex + 1,
            search: search || undefined,
            status: status || undefined,
            startDate: start ? new Date(start).toISOString() : undefined,
            endDate: end ? new Date(end).toISOString() : undefined,
          };

          return this.fetchPaginatedActivitiesGQL.fetch({ queryFilter }, { fetchPolicy: 'no-cache' });
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

}
