import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { OverviewComponent } from './components/overview/overview.component';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { SettingsComponent } from './components/settings/settings.component';

@NgModule({
  declarations: [DashboardComponent, OverviewComponent, SettingsComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    RouterModule,
    FlexLayoutModule,
    MatIconModule,
  ],
})
export class DashboardModule {}
