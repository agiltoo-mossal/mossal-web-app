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
import {
  FileUploadService,
  UserRole,
} from 'src/app/shared/services/file-upload.service';
import { SnackBarService } from 'src/app/shared/services/snackbar.service';
import {
  FetchOrganizationCollaboratorsGQL,
  FetchPaginatedOrganizationCollaboratorsGQL,
  LockUserGQL,
  UnlockUserGQL,
  User,
} from 'src/graphql/generated';
import * as XLSX from 'xlsx';

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
  type = UserRole.COLLABORATOR;

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  EXCEL_TYPE =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  EXCEL_EXTENSION = '.xlsx';

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
          // would prevent users from re-triggering requests
          return result.data;
        })
      )
      .subscribe((data: any) => {
        this.data = data.fetchPaginatedOrganizationCollaborators.results as any;
        this.dataSource.data = this.data as any;
        this.selectedCollab = this.data[0];
        this.resultsLength =
          data.fetchPaginatedOrganizationCollaborators.pagination.totalItems;
        this.selectedCollab = this.data?.[0];
      });
  }

  fetchCollabs() {
    this.fetchPaginatedOrganizationCollaboratorsGQL
      .fetch({}, { fetchPolicy: 'no-cache' })
      .subscribe((result) => {
        this.collabs = result.data.fetchPaginatedOrganizationCollaborators
          .results as User[];
        this.dataSource.data = this.collabs;
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


  downloadCollaborators() {
    this.fetchOrganizationCollaboratorsGQL.fetch({}, { fetchPolicy: 'no-cache' }).subscribe({
      next: ({ data }) => {
        console.log("result =>>>>>>>>>>> ", data);

        const temps = data.fetchOrganizationCollaborators;
        if (temps.length) {
          const csvRows = [
            [
              'Nom',
              'Prenom',
              'Identifiant unique',
              'Date d\'inscription',
            ],
            ...temps.map((row) => [
              row.lastName,
              row.firstName,
              row.uniqueIdentifier,
              row.createdAt,
              '',
            ]),
          ];
          this.convertToXLSX(csvRows);
        } else {
          this.snackBarService.showSnackBar(
            "Aucun collaborateur trouvé !"
          );
        }
      },
      error: (error) => console.log(error),
    });
  }

  convertToXLSX(data: any[]) {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data, {
      skipHeader: true,
    });
    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ['data'],
    };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    this.saveAsExcelFile(excelBuffer, 'collaborateurs_Eyone_2025-06-23');
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: this.EXCEL_TYPE });
    const url = window.URL.createObjectURL(data);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `${fileName}${this.EXCEL_EXTENSION}`);
    a.click();
    window.URL.revokeObjectURL(url);
    // FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + this.EXCEL_EXTENSION);
  }
}
