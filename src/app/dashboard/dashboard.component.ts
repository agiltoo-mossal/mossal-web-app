import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../shared/services/sidebar.service';
import { APP_CONTEXT } from '../shared/enums/app-context.enum';
import { AppService } from '../app.service';
import { FetchCurrentAdminGQL, User } from 'src/graphql/generated';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
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
    private appService: AppService,
    private fetchCurrentAdminGQL: FetchCurrentAdminGQL
  ) {
    this.getCurrentUser();
  }

  ngOnInit(): void {
    this.sidebarService.toggleSidebar(this.isSidebarOpened);
    this.appService.setContext(APP_CONTEXT.Dashboard);
  }

  ngOnDestroy(): void {
    this.appService.setContext(APP_CONTEXT.Dashboard);
  }

  handleToggleSidebar() {
    this.isSidebarOpened = !this.isSidebarOpened;
    this.sidebarService.toggleSidebar(this.isSidebarOpened);
  }

  getCurrentUser() {
    this.fetchCurrentAdminGQL.fetch().subscribe(
      result => {
        this.currentUser = result.data.fetchCurrentAdmin as User;
        this.dashboardNav = this.currentUser.role == 'SUPER_ADMIN_ORG' ? this.menuSuperAdmin : this.menuAdmin;
        console.log({user: this.currentUser})
      }
    )
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
    ]
  }

  get menuSuperAdmin() {
    return[
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
      ]


  }
}
