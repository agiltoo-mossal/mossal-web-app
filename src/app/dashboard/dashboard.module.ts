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
import { NgApexchartsModule } from 'ng-apexcharts';
import { RefundChartsComponent } from './components/overview/components/refund-charts/refund-charts.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SidebarModule } from '../shared/components/sidebar/sidebar.module';
import { FrenchDatePipe } from '../shared/pipes/french-date/french-date.pipe';
import { SortDescPipe } from '../shared/pipes/sort-desc/sort-desc.pipe';
import { NotificationsService } from './components/notifications/notifications.service';
import { RangeFilterPipe } from '../shared/pipes/range-filter/range-filter.pipe';
import { DateRangerFilterPipe } from '../shared/pipes/date-range-filter/date-ranger-filter.pipe';
import { PropertyMatchPipe } from '../shared/pipes/property-match/property-match.pipe';
import { FilterModule } from '../shared/pipes/filter/filter.module';
import { DemandeStatusModule } from '../shared/pipes/demande-status/demande-status.module';
import { OrganizationComponent } from './components/organization/organization.component';
import { CardDashboardComponent } from '../shared/card-dashboard/card-dashboard.component';

@NgModule({
  declarations: [
    DashboardComponent,
    OverviewComponent,
    RequestsListComponent,
    UserComponent,
    NotificationsComponent,
    RefundChartsComponent,
    OrganizationComponent,
    CardDashboardComponent,
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
    ReactiveFormsModule,
    NgApexchartsModule,
    FormsModule,
    SidebarModule,
    FrenchDatePipe,
    SortDescPipe,
    RangeFilterPipe,
    DateRangerFilterPipe,
    PropertyMatchPipe,
    FilterModule,
    DemandeStatusModule,
  ],
  providers: [NotificationsService],
})
export class DashboardModule {}
