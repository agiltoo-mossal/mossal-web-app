import { AfterViewInit, Component, effect, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  merge,
  startWith,
  switchMap,
} from 'rxjs';
import { FileUploadComponent } from 'src/app/shared/components/file-upload/file-upload.component';
import { FileUploadService } from 'src/app/shared/services/file-upload.service';
import { SnackBarService } from 'src/app/shared/services/snackbar.service';
import {
  FetchOrganizationAdminsGQL,
  FetchPaginatedOrganisationAdminsGQL,
  LockUserGQL,
  QueryFetchPaginatedOrganisationAdminsArgs,
  UnlockUserGQL,
  User,
} from 'src/graphql/generated';

@Component({
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss',
})
export class OverviewComponent implements AfterViewInit {
  admins: User[] = [];
  selectedAdmin: User;
  search: string = '';
  searchForm: FormGroup;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource = new MatTableDataSource<User>();
  page: number = 1;
  data = [];
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  displayedColumns: string[] = [
    'uniqueIdentifier',
    'admin',
    'phone',
    'createdAt',
    'action',
  ];

  constructor(
    private fetchOrganizationAdminsGQL: FetchOrganizationAdminsGQL,
    private paginatedAdminsGQL: FetchPaginatedOrganisationAdminsGQL,
    private lockUserGQL: LockUserGQL,
    private unlockUserGQL: UnlockUserGQL,
    private snackBarService: SnackBarService,
    private fileUploadService: FileUploadService,
    private fb: FormBuilder
  ) {
    this.fetchAdmins();
    this.initSearchForm();
  }

  fetchAdmins() {
    this.fetchOrganizationAdminsGQL
      .fetch({}, { fetchPolicy: 'no-cache' })
      .subscribe((result) => {
        this.admins = result.data.fetchOrganizationAdmins as User[];
        this.selectedAdmin = this.admins?.[0];
      });
  }
  initSearchForm() {
    this.searchForm = this.fb.group({
      search: [''],
    });
  }
  selectAdmin(selected: User) {
    this.selectedAdmin = selected;
  }

  ngAfterViewInit(): void {
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

          return this.paginatedAdminsGQL.fetch(
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
        this.data = data.fetchPaginatedOrganisationAdmins.results as any;
        this.dataSource.data = this.data as any;
        this.selectedAdmin = this.data[0];
        this.resultsLength =
          data.fetchPaginatedOrganisationAdmins.pagination.totalItems;
        // this.selectedAdmin = this.data?.[0];
      });
  }

  lockUser = (userId: string) => {
    this.lockUserGQL.mutate({ userId }).subscribe((result) => {
      if (result.data.lockUser) {
        this.snackBarService.showSuccessSnackBar(
          'Utilisateur bloqué avec succès!'
        );
        this.fetchAdmins();
      } else {
        this.snackBarService.showErrorSnackBar();
      }
    });
  };

  unlockUser = (userId: string) => {
    this.unlockUserGQL.mutate({ userId }).subscribe((result) => {
      if (result.data.unlockUser) {
        this.snackBarService.showSuccessSnackBar(
          'Utilisateur débloqué avec succès!'
        );
        this.fetchAdmins();
      } else {
        this.snackBarService.showErrorSnackBar();
      }
    });
  };
}
