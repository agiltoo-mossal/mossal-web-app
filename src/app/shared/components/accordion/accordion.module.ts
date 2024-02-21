import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccordionComponent } from './accordion.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { DropdownModule } from '../../directives/dropdown/dropdown.module';



@NgModule({
  declarations: [AccordionComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatIconModule,
    DropdownModule
  ],
  exports: [AccordionComponent]
})
export class AccordionModule { }
