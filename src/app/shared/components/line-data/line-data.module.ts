import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LineDataComponent } from './line-data.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';



@NgModule({
  declarations: [
    LineDataComponent
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatIconModule
  ],
  exports: [LineDataComponent]
})
export class LineDataModule { }
