import { AfterViewInit, Component, effect, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
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
import { dateToString } from 'src/app/shared/utils/time';
import {
  FetchCurrentAdminGQL,
  FetchOrganizationCollaboratorsGQL,
  FetchPaginatedOrganizationCollaboratorsGQL,
  LockUserGQL,
  Organization,
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
    'society',
    'phone',
    'createdAt',
    'action',
  ];
  type = UserRole.SUPER_ADMIN;

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
  organization: Organization;

  constructor(
    private router: Router,
    private fileUploadService: FileUploadService,
    private fb: FormBuilder,
  ) {
    // this.fetchCollabs();
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

  ngAfterViewInit() {

  }

  title: string = "liste des sociétés"
  requests = [{}, {}, {}, {}, {}, {}];


  addSocity() {
    this.router.navigate(['/dashboard/society/create-society']);
  }




}
