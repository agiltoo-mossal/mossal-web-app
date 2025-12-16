import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrganizationBalanceComponent } from './organization-balance.component';


@NgModule({
  declarations: [OrganizationBalanceComponent],
  imports: [
    CommonModule
  ],
  exports: [OrganizationBalanceComponent],

})
export class OrganizationBalanceModule { }