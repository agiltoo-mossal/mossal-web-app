import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterPipe } from './filter.pipe';
import { FrenchDatePipe } from './Users/genieouz/Documents/codes/travail/agiltoo/mossall/mossal-web-app/src/app/shared/pipes/french-date.pipe';


@NgModule({
  declarations: [	
    FilterPipe,
      FrenchDatePipe
   ],
  imports: [
    CommonModule
  ],
  exports: [FilterPipe]
})
export class FilterModule { }
