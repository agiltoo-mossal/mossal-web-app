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
  subscriptions: Subscription[] = [];
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
    const subscription = this.fetchPaginatedNotificationsGQL.fetch().subscribe({
      next: (result) => {
        this.notfis = result.data?.fetchPaginatedNotifications?.results || [];
        this.resultsLength =
          result.data?.fetchPaginatedNotifications?.pagination?.totalItems || 0;
      },
      error: (error) => {
        console.error('Error fetching notifications:', error);
      },
    });
    this.subscriptions.push(subscription);
  }

  ngAfterViewInit(): void {
    if (this.paginator) {
      const subscription = merge(this.paginator.page)
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
        .subscribe({
          next: (data: any) => {
            this.notfis = data || [];
            this.resultsLength =
              data?.fetchPaginatedNotifications?.pagination?.totalItems || 0;
          },
          error: (error) => {
            console.error('Error in pagination:', error);
          },
        });
      this.subscriptions.push(subscription);
    }
  }

  ngOnInit(): void {
    this.getNotifications();
    const viewSubscription = this.viewOrganizationNotificationsGQL
      .mutate()
      .subscribe({
        next: (result) => {
          this.notificationsService.unViewedNotification.next(false);
        },
        error: (error) => {
          console.error('Error marking notifications as viewed:', error);
        },
      });
    this.subscriptions.push(viewSubscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => {
      if (subscription) {
        subscription.unsubscribe();
      }
    });
  }
}
