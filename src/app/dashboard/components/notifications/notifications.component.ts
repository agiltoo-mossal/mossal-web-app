import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FetchOrganizationNotificationsGQL, ViewOrganizationNotificationsGQL } from 'src/graphql/generated';
import { NotificationsService } from './notifications.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent implements OnDestroy, OnInit {
  notfis = [];
  listNotisSubscription: Subscription;
  viewSubscription: Subscription;
  constructor(
    private notificationsService: NotificationsService,
    private fetchOrganizationNotificationsGQL: FetchOrganizationNotificationsGQL,
    private viewOrganizationNotificationsGQL: ViewOrganizationNotificationsGQL
  ) {

  }

  getNotifications() {
    this.listNotisSubscription = this.fetchOrganizationNotificationsGQL.fetch().subscribe(
      result => {
        this.notfis = (result.data?.fetchOrganizationNotifications || []) as any[];

      }
    )
  }


  ngOnInit(): void {
    this.getNotifications();
    this.viewSubscription = this.viewOrganizationNotificationsGQL.mutate().subscribe(
      result => {
        this.notificationsService.unViewedNotification.next(false);
      }
    )
  }

  ngOnDestroy(): void {
      this.listNotisSubscription.unsubscribe();
      this.viewSubscription.unsubscribe();
  }
}
