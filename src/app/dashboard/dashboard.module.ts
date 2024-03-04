import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { OverviewComponent } from './components/overview/overview.component';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { SettingsComponent } from './components/settings/settings.component';
import { MessagingComponent } from './components/messaging/messaging.component';
import { CollaboratorsComponent } from './components/collaborators/collaborators.component';
import { RequestsListComponent } from './components/requests-list/requests-list.component';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';
import { UserDetailsModule } from '../shared/components/user-details/user-details.module';

@NgModule({
  declarations: [
    DashboardComponent,
    OverviewComponent,
    SettingsComponent,
    MessagingComponent,
    CollaboratorsComponent,
    RequestsListComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    RouterModule,
    FlexLayoutModule,
    MatIconModule,
    Ng2GoogleChartsModule,
    UserDetailsModule,
  ],
})
export class DashboardModule {}
