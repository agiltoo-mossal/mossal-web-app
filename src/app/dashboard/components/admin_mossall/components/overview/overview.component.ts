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
import {
  FileUploadService,
  UserRole,
} from 'src/app/shared/services/file-upload.service';
import { SnackBarService } from 'src/app/shared/services/snackbar.service';
import {
  FetchMossallAdminGQL,
  FetchPaginatedMossallAdminsGQL,
  LockAdminGQL,
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
  isLoadingResults = false; // Mis à false pour les données mockées
  isRateLimitReached = false;

  displayedColumns: string[] = [
    'uniqueIdentifier',
    'admin',
    'email',
    'phone',
    'createdAt',
    'fonction',
    'action',
  ];
  type = UserRole.ADMIN;

  constructor(
    private paginatedAdminsGQL: FetchPaginatedMossallAdminsGQL,
    private lockAdminGQL: LockAdminGQL,
    private snackBarService: SnackBarService,
    private fileUploadService: FileUploadService,
    private fb: FormBuilder,
    private fetchMossallAdmin: FetchMossallAdminGQL
  ) {
    effect(() => {
      const tempData = this.fileUploadService.getDataResponse();
      if (tempData) {
        this.searchForm.patchValue({
          search: '',
        });
      }
    });
    this.initSearchForm();
  }


  fetchAdmins() {
    this.paginatedAdminsGQL
      .fetch({}, { fetchPolicy: 'no-cache' })
      .subscribe((result) => {
        this.admins = result.data.fetchPaginatedMossallAdmins
          .results as User[];
        this.dataSource.data = this.admins;
      });
  }

  initSearchForm() {
    this.searchForm = this.fb.group({
      search: [''],
    });
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
        this.data = data.fetchPaginatedMossallAdmins.results as any;
        this.dataSource.data = this.data as any;
        this.selectedAdmin = this.data[0];
        this.resultsLength =
          data.fetchPaginatedMossallAdmins.pagination.totalItems;
        // this.selectedAdmin = this.data?.[0];
      });
  }

  // lockUser = (userId: string) => {
  //   // Simulation du blocage d'un utilisateur
  //   const adminIndex = this.mockAdmins.findIndex(admin => admin.id === userId);
  //   if (adminIndex !== -1) {
  //     this.mockAdmins[adminIndex].blocked = true;
  //     this.snackBarService.showSuccessSnackBar('Utilisateur bloqué avec succès!');
  //     // this.loadMockedData(); // Recharger les données
  //   } else {
  //     this.snackBarService.showErrorSnackBar();
  //   }
  // };

  // unlockUser = (userId: string) => {
  //   // Simulation du déblocage d'un utilisateur
  //   const adminIndex = this.mockAdmins.findIndex(admin => admin.id === userId);
  //   if (adminIndex !== -1) {
  //     this.mockAdmins[adminIndex].blocked = false;
  //     this.snackBarService.showSuccessSnackBar('Utilisateur débloqué avec succès!');
  //     // this.loadMockedData(); // Recharger les données
  //   } else {
  //     this.snackBarService.showErrorSnackBar();
  //   }
  // };

  lockUser = (userId: string) => {
    this.lockAdminGQL.mutate({ userId }).subscribe((result) => {
      if (result.data.lockAdmin) {
        this.fetchMossallAdmin.fetch(
          { adminId: userId },
          { fetchPolicy: 'no-cache' }
        ).subscribe((org) => {
          const admin = org.data.fetchMossallAdmin as User;

          let message = admin.blocked
            ? 'Utilisateur bloquée avec succès!'
            : 'Utilisateur débloquée avec succès!';

          this.snackBarService.showSuccessSnackBar(message);
        });
        this.fetchAdmins();
      } else {
        this.snackBarService.showErrorSnackBar();
      }
    });
  };
}