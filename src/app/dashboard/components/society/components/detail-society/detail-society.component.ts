import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { debounceTime, distinctUntilChanged, lastValueFrom, map, merge, startWith, switchMap } from 'rxjs';
import { SnackBarService } from 'src/app/shared/services/snackbar.service';
import { dateToString } from 'src/app/shared/utils/time';
import {
    FetchOperationsMetricsGQL,
    FetchOrganizationGQL,
    FetchPaginatedOperationsGQL,
    OperationsMetrics,
    Organization,
} from 'src/graphql/generated';

@Component({
    selector: 'app-detail-society',
    templateUrl: './detail-society.component.html',
    styleUrl: './detail-society.component.scss',
})
export class DetailSocietyComponent implements AfterViewInit {
    organization: any;
    societyId: string;

    resultsLength = 0;
    isLoadingResults = true;
    isRateLimitReached = false;

    disableCache: boolean;
    search: string = '';
    searchForm: FormGroup;
    displayedColumns: string[] = [
        'amount',
        'date',
        'operation'
    ];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    dataSource = new MatTableDataSource<Organization>();

    page: number = 1;
    data = [];
    organizations = [];

    balanceData = {
        path: "./assets/img/balance-amount.svg",
        style: "#40B139",
    }
    metricsInput: FormGroup;
    metricsData: OperationsMetrics;
    isMenuFilterOpen: boolean = false;

    constructor(
        private route: ActivatedRoute,
        private snackBarService: SnackBarService,
        private fetchOrganizationGQL: FetchOrganizationGQL,
        private fetchPaginatedOperationsGQL: FetchPaginatedOperationsGQL,
        private fb: FormBuilder,
        private fetchOperationsMetrics: FetchOperationsMetricsGQL
    ) {
        this.route.paramMap.subscribe((params) => {
            this.societyId = params.get('id');
            // this.getCollab();
        });

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

        // this.getOperationsMetrics();
        // this.getOrganization();
    }

    getData() {
        try {
            Promise.all([
                this.getOperationsMetrics(),
                this.getOrganization(),
            ]).then(() => {
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

    ngAfterViewInit() {
        this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

        merge(
            this.sort.sortChange,
            this.paginator.page
        )
            .pipe(
                startWith({}),
                switchMap(() => {
                    this.isLoadingResults = true;
                    const queryFilter = {
                        limit: this.paginator.pageSize,
                        page: this.paginator.pageIndex + 1,
                    };

                    return this.fetchPaginatedOperationsGQL.fetch(
                        { queryFilter, organizationId: this.societyId },
                        { fetchPolicy: 'no-cache' }
                    );
                }),
                map((result) => {
                    this.isLoadingResults = false;
                    this.isRateLimitReached = result === null;

                    if (result === null) {
                        return [];
                    }
                    return result.data;
                })
            )
            .subscribe((data: any) => {
                this.data = data.fetchPaginatedOperations.results;
                this.dataSource.data = this.data;
                this.resultsLength =
                    data.fetchPaginatedOperations.pagination.totalItems;
            });
    }

    getOrganization(): void {
        this.fetchOrganizationGQL
            .fetch(
                { organizationId: this.societyId },
                { fetchPolicy: 'no-cache' }
            )
            .subscribe({
                next: (result) => {
                    this.organization = result.data.fetchOrganization as Organization;
                    console.log('Organisation récupérée:', this.organization);
                },
                error: (error) => {
                    console.error('Erreur:', error);
                    this.snackBarService.showErrorSnackBar(5000, 'Erreur lors du chargement');
                }
            });
    }

    getOperationsMetrics(): Promise<void> {
        const startDate =
            this.metricsInput.value.startDate || new Date('2024-01-01');
        const endDate = this.metricsInput.value.endDate || new Date();

        return lastValueFrom(
            this.fetchOperationsMetrics.fetch(
                {
                    metricsInput: { startDate, endDate },
                    organizationId: this.societyId
                },
                {
                    fetchPolicy: 'no-cache',
                }
            )
        )
            .then((result) => {
                this.metricsData = result.data.fetchOperationsMetrics as any;
            })
            .catch((error) => {
                console.error('Error fetching demandes metrics:', error);
                throw error;
            });
    }

}
