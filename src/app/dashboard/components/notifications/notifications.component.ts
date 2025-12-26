// import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
// import { map, merge, startWith, Subscription, switchMap } from 'rxjs';
// import {
//   FetchOrganizationNotificationsGQL,
//   FetchPaginatedNotificationsGQL,
//   ViewOrganizationNotificationsGQL,
// } from 'src/graphql/generated';
// import { NotificationsService } from './notifications.service';
// import { MatSort } from '@angular/material/sort';
// import { MatPaginator } from '@angular/material/paginator';

// @Component({
//   selector: 'app-notifications',
//   templateUrl: './notifications.component.html',
//   styleUrls: ['./notifications.component.scss'],
// })
// export class NotificationsComponent implements OnDestroy, OnInit {
//   notfis = [];
//   subscriptions: Subscription[] = [];
//   resultsLength: number = 0;
//   @ViewChild(MatSort) sort: MatSort;
//   @ViewChild(MatPaginator) paginator: MatPaginator;
//   constructor(
//     private notificationsService: NotificationsService,
//     private fetchOrganizationNotificationsGQL: FetchOrganizationNotificationsGQL,
//     private viewOrganizationNotificationsGQL: ViewOrganizationNotificationsGQL,
//     private fetchPaginatedNotificationsGQL: FetchPaginatedNotificationsGQL,
//     private paginatedNofif: FetchPaginatedNotificationsGQL
//   ) {}

//   getNotifications() {
//     const subscription = this.fetchPaginatedNotificationsGQL.fetch().subscribe({
//       next: (result) => {
//         this.notfis = result.data?.fetchPaginatedNotifications?.results || [];
//         this.resultsLength =
//           result.data?.fetchPaginatedNotifications?.pagination?.totalItems || 0;
//       },
//       error: (error) => {
//         console.error('Error fetching notifications:', error);
//       },
//     });
//     this.subscriptions.push(subscription);
//   }

//   ngAfterViewInit(): void {
//     if (this.paginator) {
//       const subscription = merge(this.paginator.page)
//         .pipe(
//           switchMap(() => {
//             return this.fetchPaginatedNotificationsGQL.fetch(
//               {},
//               {
//                 fetchPolicy: 'no-cache',
//               }
//             );
//           }),
//           map((result) => {
//             return result.data?.fetchPaginatedNotifications?.results || [];
//           })
//         )
//         .subscribe({
//           next: (data: any) => {
//             this.notfis = data || [];
//             this.resultsLength =
//               data?.fetchPaginatedNotifications?.pagination?.totalItems || 0;
//           },
//           error: (error) => {
//             console.error('Error in pagination:', error);
//           },
//         });
//       this.subscriptions.push(subscription);
//     }
//   }

//   ngOnInit(): void {
//     this.getNotifications();
//     const viewSubscription = this.viewOrganizationNotificationsGQL
//       .mutate()
//       .subscribe({
//         next: (result) => {
//           this.notificationsService.unViewedNotification.next(false);
//         },
//         error: (error) => {
//           console.error('Error marking notifications as viewed:', error);
//         },
//       });
//     this.subscriptions.push(viewSubscription);
//   }

//   ngOnDestroy(): void {
//     this.subscriptions.forEach((subscription) => {
//       if (subscription) {
//         subscription.unsubscribe();
//       }
//     });
//   }
// }



import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, Subscription, startWith, switchMap, map } from 'rxjs';
import {
  FetchPaginatedNotificationsGQL,
  ViewOrganizationNotificationsGQL,
} from 'src/graphql/generated';
import { NotificationsService } from './notifications.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent implements OnInit, AfterViewInit, OnDestroy {
  notfis: any[] = [];
  resultsLength: number = 0;
  subscriptions: Subscription[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private fetchPaginatedNotificationsGQL: FetchPaginatedNotificationsGQL,
    private viewOrganizationNotificationsGQL: ViewOrganizationNotificationsGQL,
    private notificationsService: NotificationsService
  ) {}

  ngOnInit(): void {
    // Marquer les notifications comme vues
    const viewSub = this.viewOrganizationNotificationsGQL.mutate().subscribe({
      next: () => this.notificationsService.unViewedNotification.next(false),
      error: (err) => console.error('Error marking notifications as viewed:', err),
    });
    this.subscriptions.push(viewSub);
  }

  ngAfterViewInit(): void {
    // Trigger initial load + pagination
    const subscription = merge(this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => this.loadNotifications(this.paginator.pageIndex, this.paginator.pageSize))
      )
      .subscribe({
        next: () => {},
        error: (err) => console.error('Error loading notifications:', err),
      });

    this.subscriptions.push(subscription);
  }

  loadNotifications(pageIndex: number = 0, pageSize: number = 10) {
    // Appel GraphQL avec pagination serveur
    return this.fetchPaginatedNotificationsGQL
      .fetch(
        {
          queryFilter: {
            page: pageIndex + 1, // backend commence souvent à 1
            limit: pageSize,
            // tri si besoin: sortField, sortOrder
          },
        },
        { fetchPolicy: 'no-cache' }
      )
      .pipe(
        map((result) => {
          const data = result.data?.fetchPaginatedNotifications;
          this.notfis = data?.results || [];
          this.resultsLength = data?.pagination?.totalItems || 0;
          return data;
        })
      );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub?.unsubscribe());
  }
}
