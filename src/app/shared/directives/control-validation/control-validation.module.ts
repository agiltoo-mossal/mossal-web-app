import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValidationDirective } from './control-validation.directive';



@NgModule({
  declarations: [
    ControlValidationDirective
  ],
  exports: [ControlValidationDirective],
  imports: [
    CommonModule
  ]
})
export class ControlValidationModule { }
