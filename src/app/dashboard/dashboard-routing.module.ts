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
import { UserAdminMossallComponent } from './components/user_admin_mossall/user_admin_mossall.component';
import { OverviewComponent as PaymentsOverviewComponent } from './components/payments/overview/overview.component';
import { AvancesComponent } from './components/avancesComponent/avances.component';
import { ImportFichierComponent } from './components/import-fichier-component/import-fichier.component';
import { ManualPaymentComponent } from './components/manual-payment.component/manual-payment.component';
import { FluxApprobationComponent } from './components/flux-approbation.component/flux-approbation.component';
import { PaymentDetailsComponent } from './components/admin_mossall/components/payment-details/payment-details.component';
import { HistoryComponent } from './components/historyComponent/history.component';
import { TrackingApprovalsComponent } from './components/tracking-approvals/tracking-approvals.component';
import { TrackingApprovalsDetailsComponent } from './components/tracking-approvals-details/tracking-approvals-details.component';
import { ApproverOrderViewComponent } from './components/approver-order-view/approver-order-view.component';

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
        path: 'admin_mossall',
        loadChildren: () =>
          import('./components/admin_mossall/admin_mossall.module').then(
            (m) => m.AdminMossallModule
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
        path: 'user_admin_mossall',
        component: UserAdminMossallComponent,
      },
      {
        path: 'organization',
        component: OrganizationComponent,
      },
      {
        path: 'organization/payments',  
        component: PaymentsOverviewComponent,
      },
      {
        path: 'organization/avances',
        component: AvancesComponent,
      },
      {
        path: 'organization/fluxAppro',
        component: FluxApprobationComponent,
      },
      {
        path: 'activities',
        component: ActivitiesComponent,
      },
      { path: 'organization/payments/import',
        component: ImportFichierComponent 
      },
      { path: 'organization/payments/manual', component: ManualPaymentComponent },
      { path: 'payments/details/:id', component: PaymentDetailsComponent },
      {
        path: 'organization/payments/history',
        component: HistoryComponent,
      },
      {
        path: 'tracking-approvals',
        component: TrackingApprovalsComponent,
      },
      {
        path: 'tracking-approvals/:id',
        component: TrackingApprovalsDetailsComponent,
      },
      {
        path: 'tracking-approvals/:id/view',
        component: ApproverOrderViewComponent,
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
