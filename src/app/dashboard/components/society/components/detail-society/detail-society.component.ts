import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { catchError, debounceTime, distinctUntilChanged, lastValueFrom, map, merge, of, startWith, switchMap } from 'rxjs';
import { SnackBarService } from 'src/app/shared/services/snackbar.service';
import { dateToString } from 'src/app/shared/utils/time';
import {
    FetchOperationsGQL,
    FetchOperationsMetricsGQL,
    FetchOrganizationGQL,
    FetchPaginatedOperationsGQL,
    OperationsMetrics,
    OperationType,
    Organization,
} from 'src/graphql/generated';
import * as XLSX from 'xlsx';

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
    type: OperationType = null;
    amount: number = 0;
    isDateFilterOpen: boolean = false;
    EXCEL_TYPE =
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    EXCEL_EXTENSION = '.xlsx';
    startFilterDate: string = '2025-01-01';
    endFilterDate: string = '2025-12-31';

    constructor(
        private route: ActivatedRoute,
        private snackBarService: SnackBarService,
        private fetchOrganizationGQL: FetchOrganizationGQL,
        private fetchPaginatedOperationsGQL: FetchPaginatedOperationsGQL,
        private fb: FormBuilder,
        private fetchOperationsMetrics: FetchOperationsMetricsGQL,
        private fetchOperations: FetchOperationsGQL
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
        this.initSearchForm();
    }

    initSearchForm() {
        this.searchForm = this.fb.group({
            amount: [],
            type: [''],
            startFilterDate: ['2025-01-01'],
            endFilterDate: ['2025-12-31'],
        });
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

    toggleOperationFilterDate() {
        this.isDateFilterOpen = !this.isDateFilterOpen;
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

    @ViewChild('dropdownFilterContent') dropdownFilterContent: ElementRef;
    @ViewChild('btnToggleDropdownFilterDate') btnToggleDropdownFilterDate: ElementRef;
    @HostListener('document:click', ['$event'])
    clickOutsideDateFilter(event: Event) {
        if (!this.isDateFilterOpen) {
            return;
        }
        const target = event.target as HTMLElement;
        if (
            !this.dropdownFilterContent.nativeElement.contains(target) &&
            !this.btnToggleDropdownFilterDate.nativeElement.contains(target)
        ) {
            this.isDateFilterOpen = false;
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

    changeType(state) {
        this.type = state;
        this.searchForm.get('type').setValue(state);
    }
    onStartDateChange() {
        this.searchForm.get('startFilterDate').setValue(this.startDate);
    }
    onEndDateChange() {
        this.searchForm.get('endFilterDate').setValue(this.endDate);
    }

    applyFilter() {
        merge(
            // this.sort.sortChange,
            this.paginator.page,
            this.searchForm.get('type').valueChanges.pipe(debounceTime(300)),
            this.searchForm.get('amount').valueChanges.pipe(debounceTime(300)),
            this.searchForm.get('startFilterDate').valueChanges.pipe(debounceTime(300)),
            this.searchForm.get('endFilterDate').valueChanges.pipe(debounceTime(300))
        )
            .pipe(
                startWith({}),
                switchMap(() => {
                    console.log('Demande: fetchPaginatedOrganizationDemandes');
                    this.isLoadingResults = true;

                    const queryFilter = {
                        limit: this.paginator.pageSize,
                        page: this.paginator.pageIndex + 1,
                        // sortField: this.sort.active,
                        // sortOrder: this.sort.direction,
                        search: this.searchForm?.value?.search,
                    };
                    const metricsInput = {};

                    if (this.searchForm.get('type').value) {
                        metricsInput['type'] = this.type;
                    }

                    if (this.searchForm.get('amount')?.value) {
                        this.amount = this.searchForm.get('amount').value;
                        metricsInput['amount'] = this.amount
                    }

                    if (
                        this.searchForm.get('startFilterDate').value &&
                        this.searchForm.get('endFilterDate').value
                    ) {
                        metricsInput['startDate'] = this.startFilterDate;
                        metricsInput['endDate'] = this.endFilterDate;
                    }
                    console.log('startFilterDate, endFilterDate ===>>>> ', this.startFilterDate, this.endFilterDate);

                    return this.fetchPaginatedOperationsGQL.fetch(
                        {
                            queryFilter,
                            organizationId: this.societyId,
                            metricsInput,
                        },
                        { fetchPolicy: 'no-cache' }
                    );
                }),
                map((result) => {
                    console.log('Réponse reçue:', result);

                    // Flip flag to show that loading has finished.
                    this.isLoadingResults = false;
                    this.isRateLimitReached = result === null;

                    if (result === null || !result.data) {
                        console.warn('Résultat null ou data manquant');
                        return null;
                    }

                    // Only refresh the result length if there is new data. In case of rate
                    // limit errors, we do not want to reset the paginator to zero, as that
                    // would prevent users from re-triggering requests
                    return result.data;
                }),
                catchError((error) => {
                    console.error('Erreur lors de la requête:', error);
                    this.isLoadingResults = false;
                    this.isRateLimitReached = true;
                    return of(null);
                })
            )
            .subscribe((data: any) => {
                console.log('Data reçue dans subscribe:', data);

                if (!data || !data.fetchPaginatedOperations) {
                    console.warn('Aucune donnée valide reçue');
                    this.data = [];
                    this.dataSource.data = [];
                    //   this.selectedReq = null;
                    this.resultsLength = 0;
                    return;
                }

                const results = data.fetchPaginatedOperations.results;


                // Mise à jour des données du composant
                this.data = results || [];
                // console.log('Nombre de demandes:', this.requests.length);
                this.dataSource.data = this.data;

                // this.selectedReq = this.requests.length > 0 ? this.requests[0] : null;
                this.resultsLength = data.fetchPaginatedOperations.pagination?.totalItems || 0;

            });



    }

    exportOperations() {
        this.fetchOperations.fetch({ organizationId: this.societyId }, { fetchPolicy: 'no-cache' }).subscribe({
            next: ({ data }) => {
                const temps = data.fetchOperations;
                if (temps.length) {
                    const csvRows = [
                        [
                            'Organisation',
                            'Opération',
                            'Montant',
                            'Date',
                        ],
                        ...temps.map((row) => [
                            row.organization,
                            row.type,
                            row.amount,
                            row.date,
                            '',
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
