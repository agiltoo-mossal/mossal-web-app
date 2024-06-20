import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { AuthService } from 'src/app/auth/auth.service';
import { TranslationService } from 'src/app/translation.service';
import { APP_CONTEXT } from '../../enums/app-context.enum';
import { Subscription } from 'rxjs';
import { KeycloakService } from 'keycloak-angular';
import { Router } from '@angular/router';
import { NotificationsService } from 'src/app/dashboard/components/notifications/notifications.service';
import { FetchCurrentAdminGQL, FetchOrganizationNotificationsGQL, Notification } from 'src/graphql/generated';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnDestroy, OnInit {
  context: APP_CONTEXT = APP_CONTEXT.Default;
  AppContext = APP_CONTEXT;
  isSidebarOpened!: boolean;

  contextSubscription: Subscription;
  headerSubscription: Subscription;
  notificationSubscription: Subscription;
  listNotisSubscription: Subscription;
  viewSubscription: Subscription;
  currentUser;
  newNotificationCounter = 0;
  hasUnviewedNotif = false;

  notificationList: any[] = [

  ];

  constructor(
    private authService: AuthService,
    private appService: AppService,
    // private translationService: TranslationService,
    private keycloakService: KeycloakService,
    private router: Router,
    private notificationsService: NotificationsService,
    private fetchOrganizationNotificationsGQL: FetchOrganizationNotificationsGQL,
    private fetchCurrentAdminGQL: FetchCurrentAdminGQL
  ) {
    this.contextSubscription = this.appService.contextAsync.subscribe((ctx) => {
      this.context = ctx;
    });

    // this.keycloakService.loadUserProfile().then((result) => {
    //   this.currentUser = result;
    // });
    this.fetchCurrentAdmin();
    this.getNotifications();
  }

  ngOnInit(): void {
    this.notificationSubscription = this.notificationsService.listenForNotifications().subscribe(notification => {
      this.notificationList.unshift(notification);
      this.newNotificationCounter++;
    });
    this.viewSubscription = this.notificationsService.unViewedNotification.subscribe(
      result => {
        this.hasUnviewedNotif = result;
      }
    )
  }

  ngOnDestroy(): void {
    // Se désabonner des observables pour éviter les fuites de mémoire
    this.contextSubscription.unsubscribe();
    this.headerSubscription.unsubscribe();
    this.notificationSubscription.unsubscribe();
    this.listNotisSubscription.unsubscribe();
    this.viewSubscription.unsubscribe();
    this.newNotificationCounter = 0;
  }

  getNotifications() {
    this.listNotisSubscription = this.fetchOrganizationNotificationsGQL.fetch().subscribe(
      result => {
        this.notificationList = (result.data?.fetchOrganizationNotifications?.slice(0, 5) || []) as any[];
        if(this.notificationList.length && !this.notificationList[0].viewedByMe) {
          this.hasUnviewedNotif = true;
        }
      }
    )
  }

  get isLogedIn() {
    return this.authService.isLogedIn();
  }

  get user() {
    return this.currentUser || {};
  }

  get userRole() {
    return this.user.role.toLowerCase();
  }

  logout() {
    this.authService.logout()
    // this.keycloakService.logout().then((result) => {
    //   this.router.navigate(['/']);
    // });
  }

  viewNotifications() {
    this.newNotificationCounter = 0;
  }

  fetchCurrentAdmin() {
    this.fetchCurrentAdminGQL.fetch().subscribe((result) => {
      this.currentUser = result.data.fetchCurrentAdmin;
    });
  }
}
