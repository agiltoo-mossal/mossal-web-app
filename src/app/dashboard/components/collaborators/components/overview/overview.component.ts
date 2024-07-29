import { AfterViewInit, Component, effect, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  merge,
  startWith,
  switchMap,
} from 'rxjs';
import { FileUploadService } from 'src/app/shared/services/file-upload.service';
import { SnackBarService } from 'src/app/shared/services/snackbar.service';
import {
  FetchOrganizationCollaboratorsGQL,
  FetchPaginatedOrganizationCollaboratorsGQL,
  LockUserGQL,
  UnlockUserGQL,
  User,
} from 'src/graphql/generated';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];
@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent implements AfterViewInit {
  collabs: User[] = [];
  selectedCollab: User;
  disableCache: boolean;
  search: string = '';
  searchForm: FormGroup;
  displayedColumns: string[] = [
    'uniqueIdentifier',
    'collaborator',
    'phone',
    'createdAt',
    'action',
  ];

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource = new MatTableDataSource<User>();

  page: number = 1;
  data = [];

  constructor(
    private fetchOrganizationCollaboratorsGQL: FetchOrganizationCollaboratorsGQL,
    private fetchPaginatedOrganizationCollaboratorsGQL: FetchPaginatedOrganizationCollaboratorsGQL,
    private activatedRoute: ActivatedRoute,
    private lockUserGQL: LockUserGQL,
    private unlockUserGQL: UnlockUserGQL,
    private snackBarService: SnackBarService,
    private fileUploadService: FileUploadService,
    private fb: FormBuilder
  ) {
    // this.fetchCollabs();
    effect(() => {
      const tempData = this.fileUploadService.getDataResponse();
      if (tempData) {
        // this.data = [
        //   ...tempData.data.filter((item) => item.error == false),
        //   ...this.data,
        // ];
        // this.dataSource.data = this.data;
        // this.initSearchForm();

        this.searchForm.patchValue({
          search: '',
        });
      }
    });
    this.initSearchForm();
    // this.disableCache = Boolean(this.activatedRoute.snapshot.queryParams['e']);
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
          console.log({ queryFilter });

          return this.fetchPaginatedOrganizationCollaboratorsGQL.fetch(
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
          // would prevent users from re-triggering requests.
          console.log({ result });
          return result.data;
        })
      )
      .subscribe((data: any) => {
        this.data = data.fetchPaginatedOrganizationCollaborators.results as any;
        this.dataSource.data = this.data as any;
        this.selectedCollab = this.data[0];
        this.resultsLength =
          data.fetchPaginatedOrganizationCollaborators.pagination.totalItems;
        console.log({ data });
      });
  }

  fetchCollabs() {
    this.fetchOrganizationCollaboratorsGQL
      .fetch({}, { fetchPolicy: 'no-cache' })
      .subscribe((result) => {
        this.collabs = result.data.fetchOrganizationCollaborators as User[];
        this.selectedCollab = this.collabs?.[0];
      });
  }

  selectCollab(selected: User) {
    this.selectedCollab = selected;
  }

  lockUser = (userId: string) => {
    this.lockUserGQL.mutate({ userId }).subscribe((result) => {
      if (result.data.lockUser) {
        this.snackBarService.showSuccessSnackBar(
          'Utilisateur bloqué avec succès!'
        );
        this.fetchCollabs();
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
        this.fetchCollabs();
      } else {
        this.snackBarService.showErrorSnackBar();
      }
    });
  };
}
