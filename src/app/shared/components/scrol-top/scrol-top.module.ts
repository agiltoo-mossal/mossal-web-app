import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrolTopComponent } from './scrol-top.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [ScrolTopComponent],
  imports: [CommonModule, FlexLayoutModule, MatIconModule],
  exports: [ScrolTopComponent],
})
export class ScrolTopModule {}
