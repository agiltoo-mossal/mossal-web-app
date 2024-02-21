import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectComponent } from './select.component';
import { MatIconModule } from '@angular/material/icon';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    SelectComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    FlexLayoutModule,
    ReactiveFormsModule
  ],
  exports: [SelectComponent]
})
export class SelectModule { }
