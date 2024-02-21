import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeValuePipe } from './safe-value.pipe';



@NgModule({
  declarations: [
    SafeValuePipe
  ],
  imports: [
    CommonModule
  ],
  exports: [SafeValuePipe]
})
export class SafeValueModule { }
