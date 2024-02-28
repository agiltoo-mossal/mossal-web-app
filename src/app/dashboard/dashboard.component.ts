import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../shared/services/sidebar.service';

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

  constructor(private sidebarService: SidebarService) {}

  ngOnInit(): void {
    this.sidebarService.toggleSidebar(this.isSidebarOpened);
  }

  handleToggleSidebar() {
    this.isSidebarOpened = !this.isSidebarOpened;
    this.sidebarService.toggleSidebar(this.isSidebarOpened);
  }
}
