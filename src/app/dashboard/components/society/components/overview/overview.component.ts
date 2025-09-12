import { AfterViewInit, Component, effect, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  merge,
  startWith,
  switchMap,
} from 'rxjs';
import {
  FileUploadService,
  UserRole,
} from 'src/app/shared/services/file-upload.service';
import {
  FetchCurrentAdminGQL,
  FetchOrganizationCollaboratorsGQL,
  FetchPaginatedOrganizationsGQL,
  LockUserGQL,
  Organization,
  UnlockUserGQL,
  User,
} from 'src/graphql/generated';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent implements AfterViewInit {

  disableCache: boolean;
  search: string = '';
  searchForm: FormGroup;
  displayedColumns: string[] = [
    'entreprise',
    'adressePostale',
    'phone',
    'coordSuperAdmin',
    'adminName',
    'action'
  ];
  type = UserRole.SUPER_ADMIN;

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource = new MatTableDataSource<Organization>();

  page: number = 1;
  data = [];

  constructor(
    private router: Router,
    private fileUploadService: FileUploadService,
    private fb: FormBuilder,
    private fetchPaginatedOrganizationsGQL: FetchPaginatedOrganizationsGQL
  ) {
    effect(() => {
      const tempData = this.fileUploadService.getDataResponse();
    });
    this.initSearchForm();
    // this.disableCache = Boolean(this.activatedRoute.snapshot.queryParams['e']);
  }

  initSearchForm() {
    this.searchForm = this.fb.group({
      search: [''],
    });
  }

  title: string = "liste des sociétés"
  requests = [{}, {}, {}, {}, {}, {}];

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

          return this.fetchPaginatedOrganizationsGQL.fetch(
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
          console.log("list of organizations =========>>>>>>> ", result.data);

          return result.data;
        })
      )
      .subscribe((data: any) => {
        this.data = data.fetchPaginatedOrganizations.results as any;

        this.dataSource.data = this.data as any;
        this.resultsLength =
          data.fetchPaginatedOrganizations.pagination.totalItems;
      });
  }


}
