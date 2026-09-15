import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { debounceTime, distinctUntilChanged, map, merge, startWith, switchMap } from 'rxjs';
import { Activity, FetchPaginatedActivitiesGQL } from 'src/graphql/generated';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrl: './activities.component.scss'
})
export class ActivitiesComponent {
  dateRangeForm: FormGroup;

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
    private sanitizer: DomSanitizer

  ) {
    this.initSearchForm();
  }

  // initSearchForm() {
  //   this.searchForm = this.fb.group({
  //     search: [''],
  //   });
  // }

  initSearchForm() {
    this.searchForm = this.fb.group({
      search: [''],
      status: [''],
      period: [''],
      scope: [''],
      action: [''], // nouveau
  });
  this.dateRangeForm = this.fb.group({
    start: [null],
    end: [null],
  });
  }

  getScopeLabel(scope: string): string {
    const labels: Record<string, string> = {
      bulk_payment: 'Paiement en masse',
      advance_request: "Demande d'avance",
    };
    return labels[scope] || scope;
  }

  getScopeClass(scope: string): string {
    const classes: Record<string, string> = {
      bulk_payment: 'scope-bulk',
      advance_request: 'scope-advance',
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

  // resetFilters() {
  //   this.searchForm.reset({ search: '', status: '', period: '', scope: '' });
  //   this.paginator.firstPage();
  // }

  // ngAfterViewInit() {
  //   this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
  //   this.searchForm
  //     .get('search')
  //     .valueChanges.pipe(
  //       debounceTime(300),
  //       distinctUntilChanged(),
  //       startWith('')
  //     )
  //     .subscribe((r) => {
  //       this.paginator.firstPage();
  //     });

  //   merge(
  //     this.sort.sortChange,
  //     this.paginator.page,
  //     this.searchForm.get('search').valueChanges.pipe(
  //       debounceTime(300),
  //       distinctUntilChanged()
  //       // startWith('')
  //     )
  //   )
  //     .pipe(
  //       startWith({}),
  //       switchMap(() => {
  //         this.isLoadingResults = true;
  //         const queryFilter = {
  //           limit: this.paginator.pageSize,
  //           page: this.paginator.pageIndex + 1,
  //           // sortField: this.sort.active,
  //           // sortOrder: this.sort.direction,
  //           search: this.searchForm?.value?.search,
  //           status: this.searchForm?.value?.status || undefined,
  //           period: this.searchForm?.value?.period || undefined,
  //           scope: this.searchForm?.value?.scope || undefined,
  //         };

  //         return this.fetchPaginatedActivitiesGQL.fetch(
  //           { queryFilter },
  //           { fetchPolicy: 'no-cache' }
  //         );
  //       }),
  //       map((result) => {
  //         // Flip flag to show that loading has finished.
  //         this.isLoadingResults = false;
  //         this.isRateLimitReached = result === null;

  //         if (result === null) {
  //           return [];
  //         }

  //         // Only refresh the result length if there is new data. In case of rate
  //         // limit errors, we do not want to reset the paginator to zero, as that
  //         // would prevent users from re-triggering requests
  //         return result.data;
  //       })
  //     )
  //     .subscribe((data: any) => {
  //       this.data = data.fetchPaginatedActivities.results as any;
  //       this.dataSource.data = this.data as any;
  //       this.resultsLength =
  //         data.fetchPaginatedActivities.pagination.totalItems;
  //     });
  // }


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
        const { search, status, scope, action } = this.searchForm.value;
        const { start, end } = this.dateRangeForm.value;

        const queryFilter = {
          limit: this.paginator.pageSize,
          page: this.paginator.pageIndex + 1,
          search: search || undefined,
          status: status || undefined,
          scope: scope || undefined,
          action: action || undefined,
          startDate: start ? start.toISOString() : undefined,
          endDate: end ? end.toISOString() : undefined,
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
    this.searchForm.reset({ search: '', status: '', scope: '', action: '' });
    this.dateRangeForm.reset({ start: null, end: null });
    this.paginator.firstPage();
  }

}
