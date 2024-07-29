import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { debounceTime, distinctUntilChanged, map, merge, startWith, switchMap } from 'rxjs';
import { Activity, FetchPaginatedActivitiesGQL } from 'src/graphql/generated';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrl: './activities.component.scss'
})
export class ActivitiesComponent {
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
    private fetchPaginatedActivitiesGQL: FetchPaginatedActivitiesGQL
  ) {
    this.initSearchForm();
  }

  initSearchForm() {
    this.searchForm = this.fb.group({
      search: [''],
    });
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    this.searchForm
      .get('search')
      .valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        startWith('')
      )
      .subscribe((r) => {
        this.paginator.firstPage();
      });

    merge(
      this.sort.sortChange,
      this.paginator.page,
      this.searchForm.get('search').valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged()
        // startWith('')
      )
    )
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          const queryFilter = {
            limit: this.paginator.pageSize,
            page: this.paginator.pageIndex + 1,
            // sortField: this.sort.active,
            // sortOrder: this.sort.direction,
            search: this.searchForm?.value?.search,
          };

          return this.fetchPaginatedActivitiesGQL.fetch(
            { queryFilter },
            { fetchPolicy: 'no-cache' }
          );
        }),
        map((result) => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          this.isRateLimitReached = result === null;

          if (result === null) {
            return [];
          }

          // Only refresh the result length if there is new data. In case of rate
          // limit errors, we do not want to reset the paginator to zero, as that
          // would prevent users from re-triggering requests
          return result.data;
        })
      )
      .subscribe((data: any) => {
        this.data = data.fetchPaginatedActivities.results as any;
        this.dataSource.data = this.data as any;
        this.resultsLength =
          data.fetchPaginatedActivities.pagination.totalItems;
      });
  }
}
