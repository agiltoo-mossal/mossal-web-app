import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { map, merge, startWith, Subscription, switchMap } from 'rxjs';
import {
  FetchOrganizationNotificationsGQL,
  FetchPaginatedNotificationsGQL,
  ViewOrganizationNotificationsGQL,
} from 'src/graphql/generated';
import { NotificationsService } from './notifications.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent implements OnDestroy, OnInit {
  notfis = [];
  listNotisSubscription: Subscription;
  viewSubscription: Subscription;
  resultsLength: number = 0;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(
    private notificationsService: NotificationsService,
    private fetchOrganizationNotificationsGQL: FetchOrganizationNotificationsGQL,
    private viewOrganizationNotificationsGQL: ViewOrganizationNotificationsGQL,

    private fetchPaginatedNotificationsGQL: FetchPaginatedNotificationsGQL,

    private paginatedNofif: FetchPaginatedNotificationsGQL
  ) {}

  getNotifications() {
    // this.listNotisSubscription = this.fetchOrganizationNotificationsGQL
    //   .fetch()
    //   .subscribe((result) => {
    //     this.notfis = (result.data?.fetchOrganizationNotifications ||
    //       []) as any[];
    //   });
    this.fetchPaginatedNotificationsGQL.fetch().subscribe({
      next: (result) => {
        this.notfis = result.data?.fetchPaginatedNotifications?.results || [];
        this.resultsLength =
          result.data?.fetchPaginatedNotifications?.pagination?.totalItems || 0;
      },
      error: (error) => {},
    });
  }
  ngAfterViewInit(): void {
    console.log(this.sort, this.paginator);
    // this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    merge(this.paginator.page)
      .pipe(
        switchMap(() => {
          return this.fetchPaginatedNotificationsGQL.fetch(
            {},
            {
              fetchPolicy: 'no-cache',
            }
          );
        }),
        map((result) => {
          return result.data?.fetchPaginatedNotifications?.results || [];
        })
      )
      .subscribe((data: any) => {
        this.notfis = data || [];
        this.resultsLength =
          data?.fetchPaginatedNotifications?.pagination?.totalItems || 0;
      });
  }

  ngOnInit(): void {
    this.getNotifications();
    this.viewSubscription = this.viewOrganizationNotificationsGQL
      .mutate()
      .subscribe((result) => {
        this.notificationsService.unViewedNotification.next(false);
      });
  }

  ngOnDestroy(): void {
    this.listNotisSubscription.unsubscribe();
    this.viewSubscription.unsubscribe();
  }
}
