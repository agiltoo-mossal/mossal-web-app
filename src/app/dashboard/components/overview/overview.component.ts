import { FormBuilder, FormGroup } from '@angular/forms';
import {
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
  FetchDemandesMetricsGQL,
  FetchOrganizationCollaboratorsGQL,
  FetchOrganizationDemandesGQL,
  FetchPaginatedOrganizationCollaboratorsGQL,
  FetchTotalDemandesAmountGQL,
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
  switchMap,
} from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent implements OnInit {
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
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource = new MatTableDataSource<Demande>();
  page: number = 1;
  nbActifUsers: number;

  constructor(
    private fetchOrganizationDemandesGQL: FetchOrganizationDemandesGQL,
    private fetchOrganizationCollaboratorsGQL: FetchPaginatedOrganizationCollaboratorsGQL,
    private snackBarService: SnackBarService,
    private fetchDemandesMetricsGQL: FetchDemandesMetricsGQL,
    private fb: FormBuilder,
    private userCollaboratorService: OverviewService,
    private fetchCountStatusGQL: FetchCountStatusGQL,
    private fetchCollaboratorCountGQL: FetchCollaboratorCountGQL,
    private fetchTotalDemandesAmountService: FetchTotalDemandesAmountGQL
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
    this.metricsInput.valueChanges.subscribe((r) => {
      this.getData();
    });
    this.getData();
  }

  ngOnInit(): void {
    this.getFetchCountStatus;
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
      ]).then(() => {
        this.updateStaticData();
      });
    } catch (e) {}
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

  getDemandesMetrics(): Promise<void> {
    const startDate =
      this.metricsInput.value.startDate || new Date('2024-01-01');
    const endDate = this.metricsInput.value.endDate || new Date();
    console.log(startDate, endDate);

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
        { metricsInput: this.metricsInput.value },
        { fetchPolicy: 'no-cache' }
      )
    )
      .then((result) => {
        this.collabs = result.data.fetchPaginatedOrganizationCollaborators
          .results as User[];
        console.log(this.collabs);
        this.dataSource.data = this.collabs;
        this.selectedCollab = this.collabs?.[0];
        this.resultsLength =
          result.data.fetchPaginatedOrganizationCollaborators.pagination.totalItems;
      })
      .catch((error) => {
        console.error('Error fetching collaborators:', error);
        throw error;
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
        console.log(data);
        this.dataSource.data = data.fetchPaginatedOrganizationCollaborators
          .results as Demande[];
        this.selectedCollab = this.collabs?.[0];
        this.resultsLength =
          data.fetchOrganizationCollaborators?.pagination?.totalItems;
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
          error: (error) => {},
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
          error: (error) => {},
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
  getTotalDemandeAmount() {
    this.fetchTotalDemandesAmountService
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
          this.totalDemandeAmount = value.data.fetchTotalDemandesAmount;
        },
      });
  }

  totalDemandeAmount: number;
  totalDemandeToPay: number;

  getTotalDemandeToPay() {
    this.fetchTotalDemandesAmountService
      .fetch(
        {
          status: DemandeStatus.Validated,
          filter: {
            startDate: this.startDate,
            endDate: this.endDate,
          },
        },
        { fetchPolicy: 'no-cache' }
      )
      .subscribe({
        next: (value) => {
          this.totalDemandeToPay = value.data.fetchTotalDemandesAmount;
        },
      });
  }

  getCollaboratorCount() {
    return this.fetchCollaboratorCountGQL
      .fetch(
        {
          filter: {
            startDate: this.startDate,
            endDate: this.endDate,
          },
        },
        {
          fetchPolicy: 'no-cache',
        }
      )
      .subscribe({
        next: (value) => {
          console.log(value);
          this.nbActifUsers = value.data.fetchCollaboratorCount;
        },
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
}
export enum FilterBy {
  createdAt = 'createdAt',
  hasValidatedDemande = 'hasValidatedDemande',
}
