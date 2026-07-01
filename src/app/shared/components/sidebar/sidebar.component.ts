import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { FetchCurrentAdminGQL, User } from 'src/graphql/generated';
import { KeycloakService } from 'keycloak-angular';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

// @Component({
//   selector: 'app-sidebar',
//   templateUrl: './sidebar.component.html',
//   styleUrls: ['./sidebar.component.scss'],
// })
// export class SidebarComponent implements OnInit {
//   isSidebarOpened: boolean = true;
//   dashboardNav = [];
//   currentUser: User;
//   isDropdownOpened: boolean = false;

//   constructor(
//     private sidebarService: SidebarService,
//     private fetchCurrentAdminGQL: FetchCurrentAdminGQL,
//     private keycloakService: KeycloakService,
//     private router: Router
//   ) {}
//   ngOnInit(): void {
//     this.getCurrentUser();
//     this.sidebarService.isSidebarOpen().subscribe((resp) => {
//       this.isSidebarOpened = resp;
//     });
//   }
//   getCurrentUser() {
//     this.fetchCurrentAdminGQL
//       .fetch(
//         {},
//         {
//           fetchPolicy: 'no-cache',
//         }
//       )
//       .subscribe((result) => {
//         this.currentUser = result.data.fetchCurrentAdmin as User;
//         this.dashboardNav =
//           this.currentUser.role == 'SUPER_ADMIN_ORG'
//             ? this.menuSuperAdmin
//             : this.menuAdmin;
//         // console.log({ user: this.currentUser });
//       });
//   }
//   get menuAdmin() {
//     return [
//       {
//         label: 'Tableau de bord',
//         link: '/dashboard/overview',
//         icon: 'dashboard',
//       },
//       {
//         label: 'Liste des demandes',
//         link: 'requests-list',
//         icon: 'list_alt',
//         children: [
//           {
//             label: "Dépannage d'urgence",
//             link: 'emergency-repair',
//             icon: 'build', // Icône pour un dépannage ou réparation
//           },
//           {
//             label: 'Avance sur événement',
//             link: 'event-advance',
//             icon: 'event', // Icône pour un événement
//           },
//           {
//             label: 'Avance salariale',
//             link: 'salary-advance',
//             icon: 'attach_money', // Icône pour un paiement/avance d'argent
//           },
//           {
//             label: 'Avance salariale remboursable mensuellement',
//             link: 'monthly-repayable-advance',
//             icon: 'schedule', // Icône pour un remboursement mensuel ou une échéance
//           },
//         ],
//       },
//       {
//         label: 'Collaborateurs',
//         link: '/dashboard/collaborators',
//         icon: 'people',
//       },
//       {
//         label: 'Notifications',
//         link: '/dashboard/Notifications',
//         icon: 'notifications_none',
//       },
//       {
//         label: 'Mon Compte',
//         link: '/dashboard/user',
//         icon: 'person_outline',
//       },
//     ];
//   }
//   toggleDropdown(item) {
//     if (item?.children) {
//       this.isDropdownOpened = !this.isDropdownOpened;
//     }
//   }
//   get menuSuperAdmin() {
//     return [
//       {
//         label: 'Tableau de bord',
//         link: '/dashboard/overview',
//         icon: 'dashboard',
//       },
//       {
//         label: 'Liste des demandes',
//         link: 'requests-list',
//         icon: 'list_alt',
//         children: [
//           {
//             label: "Dépannage d'urgence",
//             link: 'emergency-repair',
//             icon: 'build', // Icône pour un dépannage ou réparation
//           },
//           {
//             label: 'Avance sur événement',
//             link: 'event-advance',
//             icon: 'event', // Icône pour un événement
//           },
//           {
//             label: 'Avance salariale',
//             link: 'salary-advance',
//             icon: 'attach_money', // Icône pour un paiement/avance d'argent
//           },
//           {
//             label: 'Avance salariale remboursable mensuellement',
//             link: 'monthly-repayable-advance',
//             icon: 'schedule', // Icône pour un remboursement mensuel ou une échéance
//           },
//         ],
//       },
//       {
//         label: 'Administrateurs',
//         link: '/dashboard/admins',
//         icon: 'person',
//       },
//       {
//         label: 'Collaborateurs',
//         link: '/dashboard/collaborators',
//         icon: 'people',
//       },

//       {
//         label: 'Notifications',
//         link: '/dashboard/Notifications',
//         icon: 'notifications_none',
//       },
//       {
//         label: 'Mon Compte',
//         link: '/dashboard/user',
//         icon: 'person_outline',
//       },
//       {
//         label: 'Organisation',
//         link: '/dashboard/organization',
//         icon: 'business',
//       },
//       {
//         label: 'Activités',
//         link: '/dashboard/activities',
//         icon: 'feed',
//       },
//     ];
//   }

//   get menuAdminMossall() {
//     return [
//       {
//         label: 'Tableau de bord',
//         link: '/dashboard/overview',
//         icon: 'dashboard',
//       },
//       {
//         label: 'Société',
//         link: '/dashboard/societe',
//         icon: 'people',
//       },
//       {
//         label: 'Institutions financières',
//         link: '/dashboard/institutfinance',
//         icon: 'people',
//       },
//       {
//         label: 'Notifications',
//         link: '/dashboard/Notifications',
//         icon: 'notifications_none',
//       },
//       {
//         label: 'Mon Compte',
//         link: '/dashboard/user',
//         icon: 'person_outline',
//       },
//     ];
//   }

//   handleClick(item) {
//     if (item.children) {
//       this.toggleDropdown(item);
//     } else {
//       console.log(item.link);
//       this.router.navigate([item.link]);
//     }
//   }
//   logout() {
//     this.keycloakService.logout().then((result) => {
//       this.router.navigate(['/']);
//     });
//   }
// }


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
  ) { }

  ngOnInit(): void {
    this.getCurrentUser();
    this.sidebarService.isSidebarOpen().subscribe((resp) => {
      this.isSidebarOpened = resp;
    });
  }

  isActive(link: string): boolean {
    return this.router.url === link || this.router.url.startsWith(link);
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

        // Attribution du menu selon le rôle de l'utilisateur
        const roles = this.currentUser.roles ?? [];
        const isPaymentManagerOnly = roles.length === 1 && roles.includes('PAYMENT_MANAGER');
        if (roles.includes('SUPER_ADMIN')) {
          this.dashboardNav = this.menuAdminMossall;
        } else if (isPaymentManagerOnly) {
          this.dashboardNav = this.menuPaymentManager;
        } else if (roles.includes('SUPER_ADMIN_ORG')) {
          this.dashboardNav = this.getMenuSuperAdmin(roles);
        } else if (roles.includes('ADMIN')) {
          this.dashboardNav = this.getMenuAdmin(roles);
        }
        // console.log({ user: this.currentUser });
      });
  }

  getMenuAdmin(roles: string[]) {
    const items: any[] = [
      {
        label: 'Tableau de bord',
        link: '/dashboard/overview',
        icon: 'dashboard',
      },
      {
        label: 'Liste des demandes',
        link: '/dashboard/requests-list',
        icon: 'list_alt',
        children: [
          {
            label: "Dépannage d'urgence",
            link: '/dashboard/emergency-repair',
            icon: 'build',
          },
          {
            label: 'Avance sur événement',
            link: '/dashboard/event-advance',
            icon: 'event',
          },
          {
            label: 'Avance salariale',
            link: '/dashboard/salary-advance',
            icon: 'attach_money',
          },
          {
            label: 'Avance salariale remboursable mensuellement',
            link: '/dashboard/monthly-repayable-advance',
            icon: 'schedule',
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
    ];
    if (roles.includes('PAYMENT_MANAGER')) {
      items.push({
        label: 'Paiements',
        link: '/dashboard/organization/payments',
        icon: 'payments',
      });
    }
    items.push({
      label: 'Mon Compte',
      link: '/dashboard/user',
      icon: 'person_outline',
    });
    return items;
  }

  get menuPaymentManager() {
    return [
      {
        label: 'Paiement en masse',
        link: '/dashboard/organization/payments',
        icon: 'account_balance_wallet',
      },
      {
        label: 'Mon Compte',
        link: '/dashboard/user',
        icon: 'person_outline',
      },
      {
        label: 'Notifications',
        link: '/dashboard/Notifications',
        icon: 'notifications_none',
      },
    ];
  }

  getMenuSuperAdmin(roles: string[]) {
    const orgChildren: any[] = [
      {
        label: 'Avances',
        link: '/dashboard/organization/avances',
        icon: 'admin_panel_settings',
      },
      {
        label: 'Administration',
        link: '/dashboard/organization/fluxAppro',
        icon: 'approval',
      },
    ];
    if (roles.includes('PAYMENT_MANAGER')) {
      orgChildren.push({
        label: 'Paiements',
        link: '/dashboard/organization/payments',
        icon: 'payments',
      });
    }
    return [
      {
        label: 'Tableau de bord',
        link: '/dashboard/overview',
        icon: 'dashboard',
      },
      {
        label: 'Liste des demandes',
        link: '/dashboard/requests-list',
        icon: 'list_alt',
        children: [
          {
            label: "Dépannage d'urgence",
            link: '/dashboard/emergency-repair',
            icon: 'build',
          },
          {
            label: 'Avance sur événement',
            link: '/dashboard/event-advance',
            icon: 'event',
          },
          {
            label: 'Avance salariale',
            link: '/dashboard/salary-advance',
            icon: 'attach_money',
          },
          {
            label: 'Avance salariale remboursable mensuellement',
            link: '/dashboard/monthly-repayable-advance',
            icon: 'schedule',
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
        children: orgChildren,
      },
      {
        label: 'Activités',
        link: '/dashboard/activities',
        icon: 'feed',
      },
    ];
  }

  get menuAdminMossall() {
    return [
      {
        label: 'Tableau de bord',
        link: '/dashboard/admin-overview',
        icon: 'dashboard',
      },
      {
        label: 'Société',
        link: '/dashboard/society',
        icon: 'people',
      },
      {
        label: 'Institutions financières',
        link: '/dashboard/financial_institutions',
        icon: 'people',
      },
      {
        label: 'Administrateurs',
        link: '/dashboard/admin_mossall',
        icon: 'person',
      },
      {
        label: 'PSP',
        link: '/dashboard/psp',
        icon: 'people',
      },
      // {
      //   label: 'Notifications',
      //   link: '/dashboard/Notifications',
      //   icon: 'notifications_none',
      // },
      {
        label: 'Mon Compte',
        link: '/dashboard/user_admin_mossall',
        icon: 'person_outline',
      },
      
    ];
  }

  // toggleDropdown(item) {
  //   if (item?.children) {
  //     this.isDropdownOpened = !this.isDropdownOpened;
  //   }
  // }

  // handleClick(item) {
  //   if (item.children) {
  //     this.toggleDropdown(item);
  //   } else {
  //     console.log("Item link =========>>>>>>>>>>", item);
  //     this.router.navigate([item.link]);
  //   }
  // }

      toggleDropdown(item) {
      if (item?.children) {
        item.isOpen = !item.isOpen; // ✅ état propre à chaque item
      }
    }

    // handleClick(item) {
    //   if (item.children) {
    //     this.toggleDropdown(item);
    //   } else {
    //     this.router.navigate([item.link]);
    //   }
    // }

    handleClick(item) {
      if (item.children) {
        item.isOpen = !item.isOpen;
            this.router.navigate([item.link]);
      } else {
        this.router.navigate([item.link]);
      }
    }

  logout() {
    this.keycloakService.logout().then((result) => {
      this.router.navigate(['/']);
    });
  }
}