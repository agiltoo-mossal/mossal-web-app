import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShowOnContextDirective } from './show-on-context.directive';



@NgModule({
  declarations: [
    ShowOnContextDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [ShowOnContextDirective]
})
export class ShowOnContextModule { }
