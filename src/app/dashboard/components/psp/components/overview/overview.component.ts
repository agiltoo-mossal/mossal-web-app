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
  FetchPaginatedFinancialOrganizationGQL,
  FinancialOrganization,
 
  User,
} from 'src/graphql/generated';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent implements AfterViewInit {

  disableCache: boolean;
  search: string = '';
  searchForm: FormGroup;
  displayedColumns: string[] = [
    'name',
    'description',
    'action',
  ];
  type = UserRole.SUPER_ADMIN;

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource = new MatTableDataSource<FinancialOrganization>();

  page: number = 1;

  constructor(
    private fetchPaginatedFinancialOrganizationGQL:FetchPaginatedFinancialOrganizationGQL,
    private activatedRoute: ActivatedRoute,
    private snackBarService: SnackBarService,
    private fileUploadService: FileUploadService,
    private fb: FormBuilder
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
      )
    )
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          const queryConfig = {
            limit: this.paginator.pageSize,
            page: this.paginator.pageIndex + 1,
            search: this.searchForm?.value?.search,
          };

          return this.fetchPaginatedFinancialOrganizationGQL.fetch(
            { queryConfig },
            { fetchPolicy: 'no-cache' }
          );
        }),
        map((result) => {
          this.isLoadingResults = false;
          this.isRateLimitReached = result === null;
          if (result === null) {
            return [];
          }
          console.log("data", result);
          return result.data;
        })
      )
      .subscribe((data: any) => {
          console.log('Données reçues:', data); 
          this.dataSource.data = data?.fetchPaginatedFinancialOrganization?.results || [];  
          this.resultsLength = data?.fetchPaginatedFinancialOrganization?.pagination?.totalItems || 0;
          console.log('Données assignées au dataSource:', this.dataSource.data);
        });
  }

  //******************************************** */

  // suspendPartner(partner: FinancialOrganization) {
  //   // Dialogue de confirmation
  //   const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
  //     width: '400px',
  //     data: {
  //       title: 'Suspendre le partenaire',
  //       message: `Êtes-vous sûr de vouloir suspendre "${partner.name}" ?`,
  //       confirmText: 'Suspendre',
  //       cancelText: 'Annuler'
  //     }
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result === true) {
  //       this.performSuspension(partner);
  //     }
  //   });
  // }

 
  // private performSuspension(partner: FinancialOrganization) {
  //   this.suspendFinancialOrganizationGQL.mutate({
  //     id: partner.id
  //   }).subscribe({
  //     next: (result) => {
  //       if (result.data?.suspendFinancialOrganization) {
  //         this.snackBarService.showSuccessSnackBar('Partenaire suspendu avec succès');
  //         // Mettre à jour localement l'état
  //         this.updatePartnerStatus(partner.id, true);
  //       } else {
  //         this.snackBarService.showSuccessSnackBar('Erreur lors de la suspension');
  //       }
  //     },
  //     error: (error) => {
  //       console.error('Erreur lors de la suspension:', error);
  //       this.snackBarService.showSuccessSnackBar('Erreur lors de la suspension');
  //     }
  //   });
  // }

  // reactivatePartner(partner: FinancialOrganization) {
  //   const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
  //     width: '400px',
  //     data: {
  //       title: 'Réactiver le partenaire',
  //       message: `Êtes-vous sûr de vouloir réactiver "${partner.name}" ?`,
  //       confirmText: 'Réactiver',
  //       cancelText: 'Annuler'
  //     }
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result === true) {
  //       this.performReactivation(partner);
  //     }
  //   });
  // }


  // private performReactivation(partner: FinancialOrganization) {
  //   this.reactivateFinancialOrganizationGQL.mutate({
  //     id: partner.id
  //   }).subscribe({
  //     next: (result) => {
  //       if (result.data?.reactivateFinancialOrganization) {
  //         this.snackBarService.showSuccessSnackBar('Partenaire réactivé avec succès');
  //         // Mettre à jour localement l'état
  //         this.updatePartnerStatus(partner.id, false);
  //       } else {
  //         this.snackBarService.showSuccessSnackBar('Erreur lors de la réactivation');
  //       }
  //     },
  //     error: (error) => {
  //       console.error('Erreur lors de la réactivation:', error);
  //       this.snackBarService.showSuccessSnackBar('Erreur lors de la réactivation');
  //     }
  //   });
  // }


  // private updatePartnerStatus(partnerId: string, blocked: boolean) {
  //   const updatedData = this.dataSource.data.map(partner => {
  //     if (partner.id === partnerId) {
  //       return { ...partner, blocked: blocked };
  //     }
  //     return partner;
  //   });
  //   this.dataSource.data = updatedData;
  // }

}
