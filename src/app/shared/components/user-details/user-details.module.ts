import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserDetailsComponent } from './user-details.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { NgApexchartsModule } from 'ng-apexcharts';

@NgModule({
  declarations: [UserDetailsComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatIconModule,
    RouterModule,
    NgApexchartsModule,
  ],
  exports: [UserDetailsComponent],
})
export class UserDetailsModule {}
