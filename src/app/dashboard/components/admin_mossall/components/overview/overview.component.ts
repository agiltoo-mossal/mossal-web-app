import { AfterViewInit, Component, effect, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  merge,
  startWith,
  switchMap,
} from 'rxjs';
import { FileUploadComponent } from 'src/app/shared/components/file-upload/file-upload.component';
import {
  FileUploadService,
  UserRole,
} from 'src/app/shared/services/file-upload.service';
import { SnackBarService } from 'src/app/shared/services/snackbar.service';
import {
  FetchOrganizationAdminsGQL,
  FetchPaginatedMossallAdminsGQL,
  FetchPaginatedOrganisationAdminsGQL,
  LockUserGQL,
  QueryFetchPaginatedOrganisationAdminsArgs,
  UnlockUserGQL,
  User,
} from 'src/graphql/generated';

@Component({
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss',
})
export class OverviewComponent implements AfterViewInit {
  admins: User[] = [];
  selectedAdmin: User;
  search: string = '';
  searchForm: FormGroup;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource = new MatTableDataSource<User>();
  page: number = 1;
  data = [];
  resultsLength = 0;
  isLoadingResults = false; // Mis à false pour les données mockées
  isRateLimitReached = false;

  displayedColumns: string[] = [
    'uniqueIdentifier',
    'admin',
    'email',
    'phone',
    'createdAt',
    'action',
  ];
  type = UserRole.ADMIN;

  // Données mockées
  private mockAdmins: User[] = [
    {
      id: '1',
      uniqueIdentifier: 'ADM001',
      firstName: 'Jean',
      lastName: 'Dupont',
      email: 'jean.dupont@example.com',
      phoneNumber: '+33123456789',
      createdAt: new Date('2024-01-15'),
      blocked: false
    } as User,
    {
      id: '2',
      uniqueIdentifier: 'ADM002',
      firstName: 'Marie',
      lastName: 'Martin',
      email: 'marie.martin@example.com',
      phoneNumber: '+33198765432',
      createdAt: new Date('2024-02-20'),
      blocked: true
    } as User,
    {
      id: '3',
      uniqueIdentifier: 'ADM003',
      firstName: 'Pierre',
      lastName: 'Bernard',
      email: 'pierre.bernard@example.com',
      phoneNumber: '+33156789123',
      createdAt: new Date('2024-03-10'),
      blocked: false
    } as User,
    {
      id: '4',
      uniqueIdentifier: 'ADM004',
      firstName: 'Sophie',
      lastName: 'Dubois',
      email: 'sophie.dubois@example.com',
      phoneNumber: '+33187654321',
      createdAt: new Date('2024-04-05'),
      blocked: false
    } as User,
    {
      id: '5',
      uniqueIdentifier: 'ADM005',
      firstName: 'Laurent',
      lastName: 'Moreau',
      email: 'laurent.moreau@example.com',
      phoneNumber: '+33145678912',
      createdAt: new Date('2024-05-12'),
      blocked: true
    } as User,
    {
      id: '6',
      uniqueIdentifier: 'ADM006',
      firstName: 'Céline',
      lastName: 'Leroy',
      email: 'celine.leroy@example.com',
      phoneNumber: '+33134567891',
      createdAt: new Date('2024-06-18'),
      blocked: false
    } as User,
    {
      id: '7',
      uniqueIdentifier: 'ADM007',
      firstName: 'Thomas',
      lastName: 'Roux',
      email: 'thomas.roux@example.com',
      phoneNumber: '+33123987456',
      createdAt: new Date('2024-07-22'),
      blocked: false
    } as User,
    {
      id: '8',
      uniqueIdentifier: 'ADM008',
      firstName: 'Isabelle',
      lastName: 'Fournier',
      email: 'isabelle.fournier@example.com',
      phoneNumber: '+33167891234',
      createdAt: new Date('2024-08-14'),
      blocked: true
    } as User
  ];

  constructor(
    private paginatedAdminsGQL: FetchPaginatedMossallAdminsGQL,
    private lockUserGQL: LockUserGQL,
    private unlockUserGQL: UnlockUserGQL,
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

  fetchAdmins() {
    // Simulation d'un délai de chargement
    setTimeout(() => {
      this.admins = [...this.mockAdmins];
      this.selectedAdmin = this.admins?.[0];
      this.dataSource.data = this.admins;
      this.resultsLength = this.admins.length;
    }, 500);
  }

  initSearchForm() {
    this.searchForm = this.fb.group({
      search: [''],
    });
  }

  selectAdmin(selected: User) {
    this.selectedAdmin = selected;
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

          return this.paginatedAdminsGQL.fetch(
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
        this.data = data.fetchPaginatedMossallAdmins.results as any;
        this.dataSource.data = this.data as any;
        this.selectedAdmin = this.data[0];
        this.resultsLength =
          data.fetchPaginatedMossallAdmins.pagination.totalItems;
        // this.selectedAdmin = this.data?.[0];
      });
  }

  private loadMockedData() {
    this.isLoadingResults = true;

    // Simulation d'un appel API avec délai
    setTimeout(() => {
      let filteredData = [...this.mockAdmins];

      // Filtrage par recherche
      const searchTerm = this.searchForm?.value?.search?.toLowerCase() || '';
      if (searchTerm) {
        filteredData = filteredData.filter(admin =>
          admin.firstName.toLowerCase().includes(searchTerm) ||
          admin.lastName.toLowerCase().includes(searchTerm) ||
          admin.email.toLowerCase().includes(searchTerm) ||
          admin.uniqueIdentifier.toLowerCase().includes(searchTerm)
        );
      }

      // Tri
      if (this.sort.active && this.sort.direction) {
        filteredData.sort((a, b) => {
          const isAsc = this.sort.direction === 'asc';
          switch (this.sort.active) {
            case 'uniqueIdentifier':
              return this.compare(a.uniqueIdentifier, b.uniqueIdentifier, isAsc);
            case 'admin':
              return this.compare(`${a.firstName} ${a.lastName}`, `${b.firstName} ${b.lastName}`, isAsc);
            case 'email':
              return this.compare(a.email, b.email, isAsc);
            case 'phone':
              return this.compare(a.phoneNumber, b.phoneNumber, isAsc);
            case 'createdAt':
              return this.compare(a.createdAt, b.createdAt, isAsc);
            default:
              return 0;
          }
        });
      }

      // Pagination
      const pageSize = this.paginator.pageSize || 10;
      const pageIndex = this.paginator.pageIndex || 0;
      const startIndex = pageIndex * pageSize;
      const endIndex = startIndex + pageSize;

      this.data = filteredData.slice(startIndex, endIndex);
      this.dataSource.data = this.data;
      this.selectedAdmin = this.data[0];
      this.resultsLength = filteredData.length;
      this.isLoadingResults = false;
    }, 300);
  }

  private compare(a: string | number | Date, b: string | number | Date, isAsc: boolean): number {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  lockUser = (userId: string) => {
    // Simulation du blocage d'un utilisateur
    const adminIndex = this.mockAdmins.findIndex(admin => admin.id === userId);
    if (adminIndex !== -1) {
      this.mockAdmins[adminIndex].blocked = true;
      this.snackBarService.showSuccessSnackBar('Utilisateur bloqué avec succès!');
      this.loadMockedData(); // Recharger les données
    } else {
      this.snackBarService.showErrorSnackBar();
    }
  };

  unlockUser = (userId: string) => {
    // Simulation du déblocage d'un utilisateur
    const adminIndex = this.mockAdmins.findIndex(admin => admin.id === userId);
    if (adminIndex !== -1) {
      this.mockAdmins[adminIndex].blocked = false;
      this.snackBarService.showSuccessSnackBar('Utilisateur débloqué avec succès!');
      this.loadMockedData(); // Recharger les données
    } else {
      this.snackBarService.showErrorSnackBar();
    }
  };
}