import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplyContextClassDirective } from './apply-context-class.directive';



@NgModule({
  declarations: [
    ApplyContextClassDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [ApplyContextClassDirective]
})
export class ApplyContextClassModule { }
