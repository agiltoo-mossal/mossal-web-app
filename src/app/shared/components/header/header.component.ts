import { Component, OnDestroy } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { AuthService } from 'src/app/auth/auth.service';
import { TranslationService } from 'src/app/translation.service';
import { APP_CONTEXT } from '../../enums/app-context.enum';
import { Subscription } from 'rxjs';
import { KeycloakService } from 'keycloak-angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnDestroy {
  context: APP_CONTEXT = APP_CONTEXT.Default;
  AppContext = APP_CONTEXT;
  isSidebarOpened!: boolean;

  contextSubscription: Subscription;
  headerSubscription: Subscription;
  currentUser;

  notificationList = [
    {
      title: 'Demande N°021',
      content: `Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt Lorem ipsum dolor sit amet, consectetuer adipiscing elit,  sed diam nonummy nibh euismod tincidunt`,
      date: 'Aujourd’hui',
      author: 'Youssouph Ndiaye',
    },
    {
      title: 'Remboursement',
      content: `Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt Lorem ipsum dolor sit amet, consectetuer adipiscing elit,  sed diam nonummy nibh euismod tincidunt`,
      date: 'Hier',
      author: 'Laurent Diop',
    },
    {
      title: 'Demande N°022',
      content: `Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt Lorem ipsum dolor sit amet, consectetuer adipiscing elit,  sed diam nonummy nibh euismod tincidunt`,
      date: '12 janvier 2024',
      author: ' Demba Dia',
    },
    {
      title: 'Réinitialisation mot de passe',
      content: `Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt Lorem ipsum dolor sit amet, consectetuer adipiscing elit,  sed diam nonummy nibh euismod tincidunt`,
      date: '10 janvier 2024 ',
      author: ' Mossal',
    },
  ];

  constructor(
    private authService: AuthService,
    private appService: AppService,
    // private translationService: TranslationService,
    private keycloakService: KeycloakService,
    private router: Router
  ) {
    this.contextSubscription = this.appService.contextAsync.subscribe((ctx) => {
      this.context = ctx;
    });

    this.keycloakService.loadUserProfile().then((result) => {
      this.currentUser = result;
    });
  }

  ngOnDestroy(): void {
    // Se désabonner des observables pour éviter les fuites de mémoire
    this.contextSubscription.unsubscribe();
    this.headerSubscription.unsubscribe();
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
    this.keycloakService.logout().then((result) => {
      this.router.navigate(['/']);
    });
  }
}
