import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { OverviewComponent } from './components/overview/overview.component';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { RequestsListComponent } from './components/requests-list/requests-list.component';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';
import { UserDetailsModule } from '../shared/components/user-details/user-details.module';
import { HeaderModule } from '../shared/components/header/header.module';
import { DropdownModule } from '../shared/directives/dropdown/dropdown.module';
import { UserComponent } from './components/user/user.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { RequiresConfirmationModule } from '../shared/directives/requires-confirmation/requires-confirmation.module';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    DashboardComponent,
    OverviewComponent,
    RequestsListComponent,
    UserComponent,
    NotificationsComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    RouterModule,
    FlexLayoutModule,
    MatIconModule,
    Ng2GoogleChartsModule,
    UserDetailsModule,
    HeaderModule,
    DropdownModule,
    RequiresConfirmationModule,
    MatDialogModule,
    ReactiveFormsModule
  ],
})
export class DashboardModule {}
