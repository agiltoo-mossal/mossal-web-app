import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FlexLayoutModule } from '@angular/flex-layout';
import { InputFileComponent } from './input-file.component';



@NgModule({
  declarations: [
    InputFileComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    FlexLayoutModule
  ],
  exports: [InputFileComponent]
})
export class InputFileModule { }
