import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DemandeStatusPipe } from './demande-status.pipe';

@NgModule({
  declarations: [DemandeStatusPipe],
  imports: [CommonModule],
  exports: [DemandeStatusPipe],
})
export class DemandeStatusModule {}
