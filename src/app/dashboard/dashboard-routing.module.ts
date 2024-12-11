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
    ],
  },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
