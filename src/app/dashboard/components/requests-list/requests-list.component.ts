import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  merge,
  startWith,
  switchMap,
} from 'rxjs';
import { SnackBarService } from 'src/app/shared/services/snackbar.service';
import {
  CancelDemandeByAdminGQL,
  Demande,
  DemandeStatus,
  FetchOrganizationDemandesGQL,
  FetchPaginatedOrganizationDemandesGQL,
  PayeDemandeGQL,
  RejectDemandeByAdminGQL,
  User,
  ValidateDemandeGQL,
} from 'src/graphql/generated';

@Component({
  selector: 'app-requests-list',
  templateUrl: './requests-list.component.html',
  styleUrls: ['./requests-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class RequestsListComponent implements AfterViewInit {
  requests: Demande[] = [];
  selectedReq: Demande;
  min: number = 0;
  max: number = 10000;
  startDate: string = '2024-01-01';
  endDate: string = '2024-12-31';
  status: DemandeStatus = null;
  search: string = '';
  searchForm: FormGroup;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource = new MatTableDataSource<Demande>();
  page: number = 1;
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  displayedColumns: string[] = [
    'number',
    'name',
    'balance',
    'createdAt',
    'avance',
    'action',
  ];
  constructor(
    private fetchOrganizationDemandesGQL: FetchOrganizationDemandesGQL,
    private validateDemandeGQL: ValidateDemandeGQL,
    private payeDemandeGQL: PayeDemandeGQL,
    private cancelDemandeByAdminGQL: CancelDemandeByAdminGQL,
    private rejectDemandeByAdminGQL: RejectDemandeByAdminGQL,
    private snackBarService: SnackBarService,
    private activatedRoute: ActivatedRoute,
    private paginatedRequestGQL: FetchPaginatedOrganizationDemandesGQL,
    private fb: FormBuilder
  ) {
    this.initSearchForm();
    this.activatedRoute.queryParams.subscribe((params) => {
      this.search = params['entity'] || '';
    });
  }

  initSearchForm() {
    this.searchForm = this.fb.group({
      search: [''],
      status: [''],
      average: [''],
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
        distinctUntilChanged(),
        filter((value) => value && value.length >= 3) // Filtre pour ne passer que les valeurs dont la longueur est supérieure à 3

        // startWith('')
      ),
      this.searchForm.get('status').valueChanges.pipe(debounceTime(300)),
      this.searchForm.get('average').valueChanges.pipe(debounceTime(300))
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

          return this.paginatedRequestGQL.fetch(
            { queryFilter, metricsInput },
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
        this.dataSource.data = this.requests as any;
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
        // console.log({r: this.requests})
      });
  }

  selectReq(selected: Demande) {
    this.selectedReq = selected;
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
    this.payeDemandeGQL.mutate({ demandeId }).subscribe(
      (result) => {
        if (result.data.payeDemande) {
          this.snackBarService.showSuccessSnackBar(
            'demande payée avec succés!'
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

  resetFilter() {
    this.min = 0;
    this.max = 10000;
    this.startDate = '2024-01-01';
    this.endDate = '2024-12-31';
    this.status = null;
    this.search = '';
  }
}
