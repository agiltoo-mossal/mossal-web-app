import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuccessPageComponent } from './success-page.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SuccessRoutingModule } from './success-page-routing.module';



@NgModule({
  declarations: [
    SuccessPageComponent
  ],
  imports: [
    CommonModule,
    SuccessRoutingModule,
    FlexLayoutModule
  ],
  exports: [SuccessPageComponent]
})
export class SuccessPageModule { }
