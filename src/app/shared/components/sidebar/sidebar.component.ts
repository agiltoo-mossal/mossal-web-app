import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { FetchCurrentAdminGQL, User } from 'src/graphql/generated';
import { KeycloakService } from 'keycloak-angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  isSidebarOpened: boolean = true;
  dashboardNav = [
    {
      label: 'Tableau de bord',
      link: 'overview',
      icon: 'dashboard',
    },
    {
      label: 'Liste des demandes',
      link: 'requests-list',
      icon: 'list_alt',
    },
    {
      label: 'Collaborateurs',
      link: 'collaborators',
      icon: 'people',
    },
    {
      label: 'Notifications',
      link: 'Notifications',
      icon: 'notifications_none',
    },
    {
      label: 'Mon Compte',
      link: 'user',
      icon: 'person_outline',
    },
  ];
  currentUser: User;

  constructor(
    private sidebarService: SidebarService,
    private fetchCurrentAdminGQL: FetchCurrentAdminGQL,
    private keycloakService: KeycloakService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.getCurrentUser();
    this.sidebarService.isSidebarOpen().subscribe((resp) => {
      this.isSidebarOpened = resp;
    });
  }
  getCurrentUser() {
    this.fetchCurrentAdminGQL.fetch().subscribe((result) => {
      this.currentUser = result.data.fetchCurrentAdmin as User;
      this.dashboardNav =
        this.currentUser.role == 'SUPER_ADMIN_ORG'
          ? this.menuSuperAdmin
          : this.menuAdmin;
      // console.log({ user: this.currentUser });
    });
  }
  get menuAdmin() {
    return [
      {
        label: 'Tableau de bord',
        link: 'overview',
        icon: 'dashboard',
      },
      {
        label: 'Liste des demandes',
        link: 'requests-list',
        icon: 'list_alt',
      },
      {
        label: 'Collaborateurs',
        link: 'collaborators',
        icon: 'people',
      },
      {
        label: 'Notifications',
        link: 'Notifications',
        icon: 'notifications_none',
      },
      {
        label: 'Mon Compte',
        link: 'user',
        icon: 'person_outline',
      },
    ];
  }

  get menuSuperAdmin() {
    return [
      {
        label: 'Tableau de bord',
        link: 'overview',
        icon: 'dashboard',
      },
      {
        label: 'Liste des demandes',
        link: 'requests-list',
        icon: 'list_alt',
      },
      {
        label: 'Administrateurs',
        link: 'admins',
        icon: 'person',
      },
      {
        label: 'Collaborateurs',
        link: 'collaborators',
        icon: 'people',
      },

      {
        label: 'Notifications',
        link: 'Notifications',
        icon: 'notifications_none',
      },
      {
        label: 'Mon Compte',
        link: 'user',
        icon: 'person_outline',
      },
      {
        label: 'Organization',
        link: 'organization',
        icon: 'business',
      },
    ];
  }

  logout() {
    this.keycloakService.logout().then((result) => {
      this.router.navigate(['/']);
    });
  }
}
