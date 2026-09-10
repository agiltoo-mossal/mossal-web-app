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
import { AuthService } from 'src/app/auth/auth.service';

type NotifTab = 'toutes' | 'non-lues' | 'lues';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent implements OnDestroy, OnInit {
  notfis = [];
  subscriptions: Subscription[] = [];
  resultsLength: number = 0;
  activeTab: NotifTab = 'toutes';
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(
    private notificationsService: NotificationsService,
    private fetchOrganizationNotificationsGQL: FetchOrganizationNotificationsGQL,
    private viewOrganizationNotificationsGQL: ViewOrganizationNotificationsGQL,
    private fetchPaginatedNotificationsGQL: FetchPaginatedNotificationsGQL,
    private paginatedNofif: FetchPaginatedNotificationsGQL,
    private authService: AuthService,
  ) { }

  get filteredNotifs(): any[] {
    if (this.activeTab === 'non-lues') return this.notfis.filter((n: any) => !n.viewedByMe);
    if (this.activeTab === 'lues') return this.notfis.filter((n: any) => n.viewedByMe);
    return this.notfis;
  }

  setActiveTab(tab: NotifTab): void {
    this.activeTab = tab;
  }

  // Une notif de paiement en masse doit ouvrir la page de détail correspondant au rôle connecté ;
  // les autres notifications (ex: demandes) gardent leur route existante.
  getNotifLink(notif: any): any[] {
    const roles: string[] = this.authService.getSessionAsObject()?.roles ?? [];
    if (roles.includes('PAYMENT_MANAGER')) {
      return ['/dashboard/payments/details', notif.entityId];
    }
    if (roles.includes('APPROVER')) {
      return ['/dashboard/tracking-approvals', notif.entityId, 'view'];
    }
    return ['/dashboard/requests/details', notif.entityId];
  }

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
