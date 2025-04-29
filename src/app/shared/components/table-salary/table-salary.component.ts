import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  CancelDemandeByAdminGQL,
  Demande,
  DemandeStatus,
  FetchCountStatusGQL,
  FetchOrganizationDemandesGQL,
  FetchPaginatedOrganizationDemandesGQL,
  PayeDemandeGQL,
  RejectDemandeByAdminGQL,
  ValidateDemandeGQL,
} from 'src/graphql/generated';
import { SnackBarService } from '../../services/snackbar.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  merge,
  startWith,
  switchMap,
} from 'rxjs';

@Component({
  selector: 'app-table-salary',

  templateUrl: './table-salary.component.html',
  styleUrl: './table-salary.component.scss',
})
export class TableSalaryComponent implements OnInit, AfterViewInit {
  requests: Demande[] = [];
  selectedReq: Demande;
  min: number = 0;
  max: number = 10000;
  startDate: string = '2025-01-01';
  endDate: string = '2025-12-31';
  status: DemandeStatus = null;
  search: string = '';
  searchForm: FormGroup;

  // @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource = new MatTableDataSource<Demande>();
  page: number = 1;
  fetchStatus: {
    pending: number;
    validated: number;
    rejected: number;
    payed: number;
  };
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  displayedColumns: string[] = [
    'number',
    'name',
    'balance',
    'createdAt',
    'avance',
    'refundDuration',
    'action',
  ];

  @Input() title: string = 'Avance salariale remboursable mensuellement'; // Titre dynamique
  @Input() supportLabel: string = 'Support de paie'; // Label du bouton

  // Les filtres et données du tableau sont également des inputs
  //utiliser un set pour mettre à jour les données du tableau
  // Données dynamiques du tableau
  @Input() organisationServiceId: string;
  // Filtres
  private _filters = {
    search: '',
    status: '',
    amountRange: [0, 10000],
    date: '',
  };
  public get filters() {
    return this._filters;
  }
  public set filters(value) {
    this._filters = value;
  }
  constructor(
    private fetchOrganizationDemandesGQL: FetchOrganizationDemandesGQL,
    private validateDemandeGQL: ValidateDemandeGQL,
    private payeDemandeGQL: PayeDemandeGQL,
    private cancelDemandeByAdminGQL: CancelDemandeByAdminGQL,
    private rejectDemandeByAdminGQL: RejectDemandeByAdminGQL,
    private snackBarService: SnackBarService,
    private activatedRoute: ActivatedRoute,
    private paginatedRequestGQL: FetchPaginatedOrganizationDemandesGQL,

    private fetchCountStatusGQL: FetchCountStatusGQL,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.initSearchForm();
    this.activatedRoute.queryParams.subscribe((params) => {
      this.search = params['entity'] || '';
    });
  }
  // Fonction pour réinitialiser les filtres
  resetFilters() {
    this.filters = {
      search: '',
      status: '',
      amountRange: [0, 10000],
      date: '',
    };
  }

  ngOnInit(): void {
    this.fetchCountStatusGQL.fetch().subscribe({
      next: (value) => {
        console.log(value);
        this.fetchStatus = value.data.fetchCountStatus;
      },
    });
  }
  initSearchForm() {
    this.searchForm = this.fb.group({
      search: [''],
      status: [''],
      average: [''],
      startDate: ['2025-01-01'],
      endDate: ['2025-12-31'],
    });
  }
  ngAfterViewInit(): void {
    // if (!this.sort || !this.paginator) {
    //   console.error('MatSort or MatPaginator is not initialized');
    //   return;
    // }
    // this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
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
      // this.sort.sortChange,
      this.paginator.page,
      this.searchForm.get('search').valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged()

        // startWith('')
      ),
      this.searchForm.get('status').valueChanges.pipe(debounceTime(300)),
      this.searchForm.get('average').valueChanges.pipe(debounceTime(300)),
      this.searchForm.get('startDate').valueChanges.pipe(debounceTime(300)),
      this.searchForm.get('endDate').valueChanges.pipe(debounceTime(300))
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
          const metricsInput = {};
          console.log('status', this.status);

          if (this.status) {
            metricsInput['status'] = this.status;
          }
          if (this.searchForm.get('average').value) {
            metricsInput['minimum'] = this.searchForm
              .get('average')
              .getRawValue().min;
            metricsInput['maximum'] = this.searchForm
              .get('average')
              .getRawValue().max;
          }
          console.log(
            this.searchForm.get('startDate').value,
            this.searchForm.get('endDate').value
          );

          if (
            this.searchForm.get('startDate').value &&
            this.searchForm.get('endDate').value
          ) {
            metricsInput['startDate'] = this.startDate;
            metricsInput['endDate'] = this.endDate;
          }
          return this.paginatedRequestGQL.fetch(
            {
              queryFilter,
              metricsInput,
              organizationServiceId: this.organisationServiceId,
            },
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
        this.requests = data.fetchPaginatedOrganizationDemandes.results;
        console.log(data);
        this.dataSource.data = data.fetchPaginatedOrganizationDemandes.results;

        this.selectedReq = data.fetchPaginatedOrganizationDemandes.results[0];
        this.resultsLength =
          data.fetchPaginatedOrganizationDemandes.pagination.totalItems;
        // this.selectedAdmin = this.data?.[0];
      });
  }
  isMenuFilterOpen: boolean = false;
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

  getDemandes(useCache = true) {
    let cache = 'cache-first';
    if (!useCache) {
      cache = 'no-cache';
    }
    this.fetchOrganizationDemandesGQL
      .fetch({}, { fetchPolicy: 'no-cache' })
      .subscribe((result) => {
        this.requests = result.data.fetchOrganizationDemandes as Demande[];
        this.selectedReq = this.requests?.[0];
        this.dataSource.data = this.requests;
        // console.log({r: this.requests})
      });
  }

  selectReq(selected: Demande) {
    this.selectedReq = selected;
  }
  updateListDemande(demandeId: string, status: DemandeStatus) {
    this.dataSource.data = this.dataSource.data.map((d: Demande) => {
      if (d.id === demandeId) {
        d.status = status;
      }
      return d;
    });
  }
  cancelDemande = (demandeId: string) => {
    this.cancelDemandeByAdminGQL.mutate({ demandeId }).subscribe(
      (result) => {
        if (result.data.cancelDemandeByAdmin) {
          this.snackBarService.showSuccessSnackBar(
            'demande annulée avec succés!'
          );
          this.getDemandes(false);
        } else {
          this.snackBarService.showErrorSnackBar();
        }
      },
      (error) => {
        this.snackBarService.showErrorSnackBar(
          5000,
          'Vous ne pouvez pas effectuer cette action.'
        );
      }
    );
  };

  rejectDemande = (demandeId: string, reason: string) => {
    this.rejectDemandeByAdminGQL
      .mutate({ demandeId, rejectedReason: reason })
      .subscribe(
        (result) => {
          if (result.data.rejectDemandeByAdmin) {
            this.snackBarService.showSuccessSnackBar(
              'demande rejetée avec succés!'
            );
            this.getDemandes(false);
          } else {
            this.snackBarService.showErrorSnackBar();
          }
        },
        (error) => {
          this.snackBarService.showErrorSnackBar(
            5000,
            'Vous ne pouvez pas effectuer cette action.'
          );
        }
      );
  };

  validateDemande = (demandeId: string) => {
    this.validateDemandeGQL.mutate({ demandeId }).subscribe(
      (result) => {
        if (result.data.validateDemande) {
          this.snackBarService.showSuccessSnackBar(
            'demande validée avec succés!'
          );
          this.getDemandes(false);
        } else {
          this.snackBarService.showErrorSnackBar();
        }
      },
      (error) => {
        this.snackBarService.showErrorSnackBar(
          5000,
          'Vous ne pouvez pas effectuer cette action.'
        );
      }
    );
  };

  payeDemande = (demandeId: string) => {
    this.router.navigate(['/dashboard/requests/details', demandeId]);
    // this.payeDemandeGQL.mutate({ demandeId }).subscribe(
    //   (result) => {
    //     if (result.data.payeDemande) {
    //       this.snackBarService.showSuccessSnackBar(
    //         'demande payée avec succés!'
    //       );
    //       this.getDemandes(false);
    //     } else {
    //       this.snackBarService.showErrorSnackBar();
    //     }
    //   },
    //   (error) => {
    //     this.snackBarService.showErrorSnackBar(
    //       5000,
    //       'Vous ne pouvez pas effectuer cette action.'
    //     );
    //   }
    // );
  };

  get nbValid() {
    return (
      this?.requests?.filter?.((r) => r.status === DemandeStatus.Validated)
        ?.length || 0
    );
  }

  get nbRejected() {
    return (
      this?.requests?.filter?.((r) => r.status === DemandeStatus.Rejected)
        ?.length || 0
    );
  }

  get nbPending() {
    return (
      this?.requests?.filter?.((r) => r.status === DemandeStatus.Pending)
        ?.length || 0
    );
  }
  get nbPayed() {
    return (
      this?.requests?.filter?.((r) => r.status === DemandeStatus.Payed)
        ?.length || 0
    );
  }
  get nbCanceled() {
    return (
      this?.requests?.filter?.((r) => r.status === DemandeStatus.Rejected)
        ?.length || 0
    );
  }

  changeMinMax(mini, maxi) {
    this.min = mini * 1000;
    this.max = maxi * 1000;
    this.searchForm.get('average').setValue({ min: this.min, max: this.max });
  }

  changeStatus(state) {
    console.log({ state });
    this.status = state;
    this.searchForm.get('status').setValue(state);
    console.log(this.searchForm.getRawValue());
  }
  onStartDateChange() {
    this.searchForm.get('startDate').setValue(this.startDate);
  }
  onEndDateChange() {
    this.searchForm.get('endDate').setValue(this.endDate);
  }
  resetFilter() {
    this.min = 0;
    this.max = 10000;
    this.startDate = '2025-01-01';
    this.endDate = '2025-12-31';
    this.status = null;
    this.search = '';
    this.searchForm.patchValue({
      startDate: '2025-01-01',
      endDate: '2025-12-31',

      average: {
        min: 0,
        max: 10000,
      },
    });
  }
}
