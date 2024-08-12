import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogDemandeComponent } from './dialog-demande.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';

@NgModule({
  declarations: [DialogDemandeComponent],
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatTableModule],
  exports: [DialogDemandeComponent],
})
export class DialogDemandeModule {}
