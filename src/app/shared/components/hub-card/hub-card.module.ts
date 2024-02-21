import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HubCardComponent } from './hub-card.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [HubCardComponent],
  imports: [CommonModule, FlexLayoutModule, MatIconModule],
  exports: [HubCardComponent],
})
export class HubCardModule {}
