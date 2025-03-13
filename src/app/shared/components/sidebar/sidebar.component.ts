import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { FetchCurrentAdminGQL, User } from 'src/graphql/generated';
import { KeycloakService } from 'keycloak-angular';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  isSidebarOpened: boolean = true;
  dashboardNav = [];
  currentUser: User;
  isDropdownOpened: boolean = false;

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
    this.fetchCurrentAdminGQL
      .fetch(
        {},
        {
          fetchPolicy: 'no-cache',
        }
      )
      .subscribe((result) => {
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
        link: '/dashboard/overview',
        icon: 'dashboard',
      },
      {
        label: 'Liste des demandes',
        link: 'requests-list',
        icon: 'list_alt',
        children: [
          {
            label: "Dépannage d'urgence",
            link: 'emergency-repair',
            icon: 'build', // Icône pour un dépannage ou réparation
          },
          {
            label: 'Avance sur événement',
            link: 'event-advance',
            icon: 'event', // Icône pour un événement
          },
          {
            label: 'Avance salariale',
            link: 'salary-advance',
            icon: 'attach_money', // Icône pour un paiement/avance d'argent
          },
          {
            label: 'Avance salariale remboursable mensuellement',
            link: 'monthly-repayable-advance',
            icon: 'schedule', // Icône pour un remboursement mensuel ou une échéance
          },
        ],
      },
      {
        label: 'Collaborateurs',
        link: '/dashboard/collaborators',
        icon: 'people',
      },
      {
        label: 'Notifications',
        link: '/dashboard/Notifications',
        icon: 'notifications_none',
      },
      {
        label: 'Mon Compte',
        link: '/dashboard/user',
        icon: 'person_outline',
      },
    ];
  }
  toggleDropdown(item) {
    if (item?.children) {
      this.isDropdownOpened = !this.isDropdownOpened;
    }
  }
  get menuSuperAdmin() {
    return [
      {
        label: 'Tableau de bord',
        link: '/dashboard/overview',
        icon: 'dashboard',
      },
      {
        label: 'Liste des demandes',
        link: 'requests-list',
        icon: 'list_alt',
        children: [
          {
            label: "Dépannage d'urgence",
            link: 'emergency-repair',
            icon: 'build', // Icône pour un dépannage ou réparation
          },
          {
            label: 'Avance sur événement',
            link: 'event-advance',
            icon: 'event', // Icône pour un événement
          },
          {
            label: 'Avance salariale',
            link: 'salary-advance',
            icon: 'attach_money', // Icône pour un paiement/avance d'argent
          },
          {
            label: 'Avance salariale remboursable mensuellement',
            link: 'monthly-repayable-advance',
            icon: 'schedule', // Icône pour un remboursement mensuel ou une échéance
          },
        ],
      },
      {
        label: 'Administrateurs',
        link: '/dashboard/admins',
        icon: 'person',
      },
      {
        label: 'Collaborateurs',
        link: '/dashboard/collaborators',
        icon: 'people',
      },

      {
        label: 'Notifications',
        link: '/dashboard/Notifications',
        icon: 'notifications_none',
      },
      {
        label: 'Mon Compte',
        link: '/dashboard/user',
        icon: 'person_outline',
      },
      {
        label: 'Organisation',
        link: '/dashboard/organization',
        icon: 'business',
      },
      {
        label: 'Activités',
        link: '/dashboard/activities',
        icon: 'feed',
      },
    ];
  }
  handleClick(item) {
    if (item.children) {
      this.toggleDropdown(item);
    } else {
      console.log(item.link);
      this.router.navigate([item.link]);
    }
  }
  logout() {
    this.keycloakService.logout().then((result) => {
      this.router.navigate(['/']);
    });
  }
}
