
import { FormBuilder, FormGroup } from '@angular/forms';

import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { GoogleChartInterface, GoogleChartType } from 'ng2-google-charts';
import { SnackBarService } from 'src/app/shared/services/snackbar.service';
import {
  Demande,
  DemandesMetrics,
  DemandeStatus,
  FetchCollaboratorCountGQL,
  FetchCountStatusGQL,
  FetchCurrentAdminGQL,
  FetchDemandesMetricsGQL,
  FetchOperationsGQL,
  FetchOrganizationCollaboratorsGQL,
  FetchOrganizationDemandesGQL,
  FetchPaginatedOrganizationCollaboratorsGQL,
  FetchPaginatedOperationsGQL,
  FetchTotalDemandesAmountGQL,
  Organization,
  User,
} from 'src/graphql/generated';
import { dataStatic } from 'src/app/shared/types/data-static';
import { OverviewService } from './overview.service';
import {
  debounceTime,
  distinctUntilChanged,
  lastValueFrom,
  map,
  merge,
  startWith,
  ReplaySubject,
  switchMap,
} from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent implements OnInit, AfterViewInit {

    displayedTransactionColumns: string[] = [
        'matricule',
        'collaborator',
        'date',
        'operation',
        'numeroOperation',
        'montant',
    ];
  societyId: string;
  EXCEL_TYPE =
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    EXCEL_EXTENSION = '.xlsx';
  datas = [];
  dataStatics = dataStatic;
  requests: Demande[] = [];
  sortedRequests: Demande[] = [];
  selectedReq: Demande;
  collabs: any[] = [];
  selectedCollab: User;
  metricsInput: FormGroup;
  metricsData: DemandesMetrics;
  isMenuFilterOpen: boolean = false;
  resultsLength = 0;
  transactionResultsLength = 0;
  fetchStatus: {
    pending: number;
    validated: number;
    rejected: number;
    payed: number;
  };
  sortBy: 'createdAt' | 'hasValidatedDemande' = 'createdAt';
  filterBy = 'createdAt';
  filterByOption = FilterBy;
  totalNewUsers = 0;

  @ViewChild('collaboratorSort') sort: MatSort;
  @ViewChild('collaboratorPaginator') paginator: MatPaginator;
  @ViewChild('transactionPaginator') transactionPaginator: MatPaginator;
  @ViewChild('transactionSort') transactionSort: MatSort;

  dataSource = new MatTableDataSource<any>();
  dataSourceTransaction = new MatTableDataSource<any>();
  page: number = 1;
  nbActifUsers: number;
  organization: any;

  constructor(
    private fetchOrganizationDemandesGQL: FetchOrganizationDemandesGQL,
    private fetchOrganizationCollaboratorsGQL: FetchPaginatedOrganizationCollaboratorsGQL,
    private snackBarService: SnackBarService,
    private fetchDemandesMetricsGQL: FetchDemandesMetricsGQL,
    private fb: FormBuilder,
    private userCollaboratorService: OverviewService,
    private fetchCountStatusGQL: FetchCountStatusGQL,
    private fetchCollaboratorCountGQL: FetchCollaboratorCountGQL,
    private fetchTotalDemandesAmountService: FetchTotalDemandesAmountGQL,
    private fetchCurrentAdminGQL: FetchCurrentAdminGQL,
    private fetchOperations: FetchOperationsGQL,
    private fetchPaginatedOperationsGQL: FetchPaginatedOperationsGQL
    
  ) {
    const now = new Date('2024-12-31');
    const today = new Date();
    const startDateOfCurrentYear = new Date(today.getFullYear(), 0, 1);
    const endDateOfCurrentYear = new Date(today.getFullYear(), 11, 31);
    this.metricsInput = this.fb.group({
      startDate: [
        `${startDateOfCurrentYear.getFullYear()}-${String(
          startDateOfCurrentYear.getMonth() + 1
        ).padStart(2, '0')}-${String(startDateOfCurrentYear.getDate()).padStart(
          2,
          '0'
        )}`,
      ],
      endDate: [
        `${endDateOfCurrentYear.getFullYear()}-${String(
          endDateOfCurrentYear.getMonth() + 1
        ).padStart(2, '0')}-${String(endDateOfCurrentYear.getDate()).padStart(
          2,
          '0'
        )}`,
      ],
    });
    this.fetchStatus = {
      pending: 0,
      validated: 0,
      rejected: 0,
      payed: 0,
    };
  }

  ngOnInit(): void {
    this.getFetchCountStatus();
    this.getData();

    this.metricsInput.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => {
        this.getData();
      });
  }
  getFetchCountStatus() {
    this.fetchCountStatusGQL
      .fetch(
        {
          filter: {
            startDate: this.startDate,
            endDate: this.endDate,
          },
        },
        { fetchPolicy: 'no-cache' }
      )
      .subscribe({
        next: (value) => {
          console.log(value);
          this.fetchStatus = value.data.fetchCountStatus;
          console.log("fetchCountStatus ==>> ", this.fetchStatus);
        },
      });
  }
  displayedColumns: string[] = [
    'numero',
    'name',
    'solde',
    'createdAt',
    'AvanceSalaire',
  ];
  private updateStaticData() {
    const infoCount = [
      this.nbAccordedRequest,
      this.nbPending,
      this.nbValid,
      this.totalDemandeAmount,
      this.nbActifUsers,
      this.totalDemandeToPay,
    ];
    this.dataStatics = this.dataStatics.map((item, index) => {
      return { ...item, value: infoCount[index] };
    });
  }
  getData() {
    try {
      Promise.all([
        this.getCollaboratorCount(),
        this.getDemandes(),
        this.fetchCollabs(),
        this.getDemandesMetrics(),
        this.getTotalDemandeAmount(),
        this.getTotalDemandeToPay(),
        this.getFetchCountStatus(),
        this.getCurrentorganization(),
        // this.getTransactions()

      ]).then(() => {
        this.updateStaticData();
      });
    } catch (e) { }
  }
  startDateMetric() {
    return this.metricsInput.controls['startDate'];
  }
  endDateMetric() {
    return this.metricsInput.controls['endDate'];
  }
  toggleMenuFilterDate() {
    this.isMenuFilterOpen = !this.isMenuFilterOpen;
  }

  @ViewChild('dropdownContent') dropdownContent: ElementRef;
  @ViewChild('btnToggleDropdownDate') btnToggleDropdownDate: ElementRef;
  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    if (!this.isMenuFilterOpen) {
      return;
    }
    const target = event.target as HTMLElement;
    if (
      !this.dropdownContent.nativeElement.contains(target) &&
      !this.btnToggleDropdownDate.nativeElement.contains(target)
    ) {
      this.isMenuFilterOpen = false;
    }
  }

  get startDate() {
    return this.metricsInput.controls['startDate'].value;
  }

  get endDate() {
    return this.metricsInput.controls['endDate'].value;
  }

  getDemandes(useCache = true): Promise<void> {
    let cache = 'cache-first';
    if (!useCache) {
      cache = 'no-cache';
    }

    return lastValueFrom(
      this.fetchOrganizationDemandesGQL.fetch(
        { metricsInput: this.metricsInput.value },
        { fetchPolicy: 'no-cache' }
      )
    )
      .then((result) => {
        this.requests = result.data.fetchOrganizationDemandes as Demande[];
        this.selectedReq = this.requests?.[0];
        this.sortedRequests = this.requests
          .slice()
          .sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1)) as Demande[];
        this.setHasValidatedDemande();
      })
      .catch((error) => {
        console.error('Error fetching demandes:', error);
        throw error;
      });
  }

  getTransactions() {
    this.fetchOperations
      .fetch({
        organizationId: this.societyId 
      }, { fetchPolicy: 'no-cache' })  
      .subscribe(({ data }) => {
        const operations = data.fetchOperations || [];
        this.dataSourceTransaction.data = operations;
        this.transactionResultsLength = operations.length;
        
        this.dataSourceTransaction.paginator = this.transactionPaginator;
      });
  }

  getDemandesMetrics(): Promise<void> {
    const startDate =
      this.metricsInput.value.startDate || new Date('2024-01-01');
    const endDate = this.metricsInput.value.endDate || new Date();

    return lastValueFrom(
      this.fetchDemandesMetricsGQL.fetch(
        {
          metricsInput: { startDate, endDate },
        },
        {
          fetchPolicy: 'no-cache',
        }
      )
    )
      .then((result) => {
        this.metricsData = result.data.fetchDemandesMetrics as any;
      })
      .catch((error) => {
        console.error('Error fetching demandes metrics:', error);
        throw error;
      });
  }

  fetchCollabs(): Promise<void> {
    return lastValueFrom(
      this.fetchOrganizationCollaboratorsGQL.fetch(
        {
          queryFilter: {
            page: this.paginator ? this.paginator.pageIndex + 1 : 1,
            limit: this.paginator ? this.paginator.pageSize : 10,
          },
        },
        { fetchPolicy: 'no-cache' }
      )
    )
      .then((result) => {
        const data = result.data.fetchPaginatedOrganizationCollaborators;

        this.collabs = data.results || [];
        this.dataSource.data = this.collabs;

        this.selectedCollab = this.collabs?.[0] || null;

        this.resultsLength = data.pagination.totalItems || 0;

        // Important pour que mat-paginator mette à jour son label !
        if (this.paginator) {
          this.paginator.length = this.resultsLength;
          this.paginator._changePageSize(this.paginator.pageSize);
        }
      })
      .catch((err) => {
        console.error('Error fetching collaborators:', err);
        throw err;
      });
  }


  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(
      this.sort.sortChange,
      this.paginator.page,
      this.metricsInput.valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        startWith('')
      )
    )
      .pipe(
        switchMap(() => {
          const queryFilter = {
            limit: this.paginator.pageSize,
            page: this.paginator.pageIndex + 1,
          };
          return this.fetchOrganizationCollaboratorsGQL.fetch(
            { queryFilter },
            { fetchPolicy: 'no-cache' }
          );
        }),
        map((result) => {
          if (result == null) return [];
          return result.data;
        })
      )
      .subscribe((data: any) => {
        this.dataSource.data = data.fetchPaginatedOrganizationCollaborators.results;
        this.selectedCollab = this.collabs?.[0];
        this.resultsLength = data.fetchPaginatedOrganizationCollaborators?.pagination?.totalItems;
      });
  }


  setHasValidatedDemande() {
    return this.collabs.map((c) => {
      c.hasValidatedDemande = false;
      const r = this.getValidatedRequest(c.id);
      if (r) {
        c.hasValidatedDemande = true;
        c.pendingRequest = r;
      }
      return c;
    });
  }

  get collaborators() {
    if (this.filterBy === 'hasValidatedDemande') {
      return this.setHasValidatedDemande().filter((c) => c.pendingRequest);
    } else {
      return this.collabs;
    }
  }
  filterUserByClause(status: FilterBy) {
    if (status === FilterBy.createdAt) {
      const toDay = new Date();
      this.fetchOrganizationCollaboratorsGQL
        .fetch(
          {
            metricsInput: {
              startDate: new Date(
                toDay.getFullYear(),
                toDay.getMonth() - 1,
                toDay.getDate()
              ),
              endDate: toDay,
            },
          },
          { fetchPolicy: 'no-cache' }
        )
        .subscribe({
          next: (value) => {
            console.log(
              'nouvellement créée',
              value.data.fetchPaginatedOrganizationCollaborators
            );
            const temp = value.data.fetchPaginatedOrganizationCollaborators
              .results as any[];
            this.dataSource.data = temp;
            this.resultsLength =
              value.data.fetchPaginatedOrganizationCollaborators.pagination.totalItems;
            this.totalNewUsers =
              value.data.fetchPaginatedOrganizationCollaborators.pagination.totalItems;
          },
          error: (error) => { },
        });
    } else {
      this.fetchOrganizationCollaboratorsGQL
        .fetch(
          { hasPendingDemandes: true },
          {
            fetchPolicy: 'no-cache',
          }
        )
        .subscribe({
          next: (value) => {
            console.log('demande en attente', value);
            const temp = value.data.fetchPaginatedOrganizationCollaborators
              .results as any[];
            this.dataSource.data = temp;
            this.resultsLength =
              value.data.fetchPaginatedOrganizationCollaborators.pagination.totalItems;
            this.totalNewUsers =
              value.data.fetchPaginatedOrganizationCollaborators.pagination.totalItems;
          },
          error: (error) => { },
        });
    }
  }

  selectCollab(selected: User) {
    this.selectedCollab = selected;
    this.userCollaboratorService.updatUserSelected(selected);
  }

  selectReq(selected: Demande) {
    this.selectedReq = selected;
  }

  get nbValid() {
    // return (
    //   this?.requests?.filter?.((r) => r.status === DemandeStatus.Validated)
    //     ?.length || 0
    // );
    return this.fetchStatus.validated;
  }

  get nbAccordedRequest() {
    return (
      this?.requests?.filter?.((r) =>
        [DemandeStatus.Validated, DemandeStatus.Payed].includes(r.status)
      )?.length || 0
    );
    // return this.fetchStatus.validated;
  }

  get nbRejected() {
    return this.fetchStatus.rejected;
  }

  get nbPending() {
    return this.fetchStatus.pending;
  }
  // getTotalDemandeAmount() {
  //   this.fetchTotalDemandesAmountService
  //     .fetch(
  //       {
  //         filter: {
  //           startDate: this.startDate,
  //           endDate: this.endDate,
  //         },
  //         status: [DemandeStatus.Validated, DemandeStatus.Payed],
  //       },
  //       { fetchPolicy: 'no-cache' }
  //     )
  //     .subscribe({
  //       next: (value) => {
  //         this.totalDemandeAmount = value.data.fetchTotalDemandesAmount;
  //       },
  //     });
  // }
  getTotalDemandeAmount(): Promise<void> {
    return lastValueFrom(
      this.fetchTotalDemandesAmountService.fetch(
        {
          filter: {
            startDate: this.startDate,
            endDate: this.endDate,
          },
          status: [DemandeStatus.Validated, DemandeStatus.Payed],
        },
        { fetchPolicy: 'no-cache' }
      )
    ).then(value => {
      this.totalDemandeAmount = value.data.fetchTotalDemandesAmount;
    });
  }


  totalDemandeAmount: number;
  totalDemandeToPay: number;

  // getTotalDemandeToPay() {
  //   this.fetchTotalDemandesAmountService
  //     .fetch(
  //       {
  //         status: [DemandeStatus.Validated],
  //         filter: {
  //           startDate: this.startDate,
  //           endDate: this.endDate,
  //         },
  //       },
  //       { fetchPolicy: 'no-cache' }
  //     )
  //     .subscribe({
  //       next: (value) => {
  //         this.totalDemandeToPay = value.data.fetchTotalDemandesAmount;
  //       },
  //     });
  // }

  getTotalDemandeToPay(): Promise<void> {
    return lastValueFrom(
      this.fetchTotalDemandesAmountService.fetch(
        {
          status: [DemandeStatus.Validated],
          filter: {
            startDate: this.startDate,
            endDate: this.endDate,
          },
        },
        { fetchPolicy: 'no-cache' }
      )
    ).then(value => {
      this.totalDemandeToPay = value.data.fetchTotalDemandesAmount;
    });
  }


  // getCollaboratorCount() {
  //   return this.fetchCollaboratorCountGQL
  //     .fetch(
  //       {
  //         filter: {
  //           startDate: this.startDate,
  //           endDate: this.endDate,
  //         },
  //       },
  //       {
  //         fetchPolicy: 'no-cache',
  //       }
  //     )
  //     .subscribe({
  //       next: (value) => {
  //         console.log(value);
  //         this.nbActifUsers = value.data.fetchCollaboratorCount;
  //       },
  //     });
  // }

  getCollaboratorCount(): Promise<void> {
    return lastValueFrom(
      this.fetchCollaboratorCountGQL.fetch(
        {
          filter: {
            startDate: this.startDate,
            endDate: this.endDate,
          },
        },
        { fetchPolicy: 'no-cache' }
      )
    ).then(value => {
      this.nbActifUsers = value.data.fetchCollaboratorCount;
    });
  }


  getLastRequest(req: any) {
    return (
      req.pendingRequest ||
      this.sortedRequests.find((r) => r.collaborator.id == req.id)
    );
  }

  getValidatedRequest(collabId: string) {
    return this.sortedRequests.find((r) => {
      return (
        r.collaborator.id == collabId && r.status == DemandeStatus.Validated
      );
    });
  }

  getCurrentorganization(useCache = true) {
    this.fetchCurrentAdminGQL
      .fetch({}, { fetchPolicy: 'no-cache' })
      .subscribe((result) => {
        if (result.data) {
          this.organization = result.data.fetchCurrentAdmin
            .organization as Organization;
          this.societyId = this.organization.id; 
          this.getTransactions(); 
          console.log({ org: this.organization });

          console.log('societyId défini:', this.societyId);
        }
      });
  }


  exportTransactions() {
        this.fetchOperations.fetch({ organizationId: this.societyId }, { fetchPolicy: 'no-cache' }).subscribe({
            next: ({ data }) => {
                const temps = data.fetchOperations;
                if (temps.length) {
                    const csvRows = [
                        [
                            'Matricule',
                            'Collaborateur',
                            "Date de l'opération",
                            'Opération',
                            'Numéro opération',
                            "Montant de l'opération",
                        ],
                        ...temps.map((row) => [
                            row.matricule,
                            row.collaborator,
                            row.date,
                            row.operation,
                            row.numeroOperation,
                            row.montant,
                        ]),
                    ];
                    this.convertToXLSX(csvRows, `Operations-${this.organization.name}`);
                } else {
                    this.snackBarService.showSnackBar(
                        "Aucune Demande de paiement n'a encore été effectue sur ce mois !"
                    );
                }
            },
            error: (error) => console.log(error),
        });
    }

     convertToXLSX(data: any[], filename: string) {
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
            this.saveAsExcelFile(excelBuffer, filename);
        }
        saveAsExcelFile(buffer: any, fileName: string): void {
        const data: Blob = new Blob([buffer], { type: this.EXCEL_TYPE });
        const url = window.URL.createObjectURL(data);
        const a = document.createElement('a');
        a.setAttribute('href', url);
        a.setAttribute('download', `${fileName}${this.EXCEL_EXTENSION}`);
        a.click();
        window.URL.revokeObjectURL(url);
    }
  }
  export enum FilterBy {
    createdAt = 'createdAt',
    hasValidatedDemande = 'hasValidatedDemande',
  }

