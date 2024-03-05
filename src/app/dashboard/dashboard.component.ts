import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../shared/services/sidebar.service';
import { APP_CONTEXT } from '../shared/enums/app-context.enum';
import { AppService } from '../app.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  isSidebarOpened: boolean = false;
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
      label: 'Messagerie',
      link: 'messaging',
      icon: 'email',
    },
    {
      label: 'Paramétres',
      link: 'settings',
      icon: 'settings',
    },
  ];

  constructor(
    private sidebarService: SidebarService,
    private appService: AppService
  ) {}

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
}
