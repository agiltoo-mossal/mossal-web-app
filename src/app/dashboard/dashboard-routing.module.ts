import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { OverviewComponent } from './components/overview/overview.component';
import { RequestsListComponent } from './components/requests-list/requests-list.component';
import { UserComponent } from './components/user/user.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { OrganizationComponent } from './components/organization/organization.component';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ActivitiesComponent } from './components/activities/activities.component';
import { RequestEmergencyComponent } from './components/request-emergency/request-emergency.component';
import { RequestEventComponent } from './components/request-event/request-event.component';
import { RequestSalaryComponent } from './components/request-salary/request-salary.component';
import { RequestMonthlyRepayableAdvanceComponent } from './components/request-monthly-repayable-advance/request-monthly-repayable-advance.component';
import { RequestDetailsComponent } from './components/request-details/request-details.component';
import { DashboardAdminComponent } from './dashboard-admin/dashboard-admin.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'overview',
    pathMatch: 'full',
  },
  {
    path: '',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'overview',
        component: OverviewComponent,
      },
      {
        path: 'requests-list',
        component: RequestsListComponent,
      },
      {
        path: 'collaborators',
        loadChildren: () =>
          import('./components/collaborators/collaborators.module').then(
            (m) => m.CollaboratorsModule
          ),
      },
      {
        path: 'society',
        loadChildren: () =>
          import('./components/society/society.module').then(
            (m) => m.SocietyModule
          ),
      },
      {
        path: 'financial_institutions',
        loadChildren: () =>
          import('./components/financial_institutions/financial_institutions.module').then(
            (m) => m.FinancialInstitutionsModule
          ),
      },
      {
        path: 'psp',
        loadChildren: () =>
          import('./components/psp/psp.module').then(
            (m) => m.PspModule
          ),
      },
      {
        path: 'admins',
        loadChildren: () =>
          import('./components/admins/admins.module').then(
            (m) => m.AdminsModule
          ),
      },
      {
        path: 'emergency-repair',
        component: RequestEmergencyComponent,
      },
      {
        path: 'event-advance',
        component: RequestEventComponent,
      },
      {
        path: 'salary-advance',
        component: RequestSalaryComponent,
      },
      {
        path: 'monthly-repayable-advance',
        component: RequestMonthlyRepayableAdvanceComponent,
      },
      {
        path: 'requests/details/:id',
        component: RequestDetailsComponent,
      },
      {
        path: 'Notifications',
        component: NotificationsComponent,
      },
      {
        path: 'user',
        component: UserComponent,
      },
      {
        path: 'organization',
        component: OrganizationComponent,
      },
      {
        path: 'activities',
        component: ActivitiesComponent,
      },
      {
        path: 'admin-overview',
        component: DashboardAdminComponent,
      },
    ],
  },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule { }
