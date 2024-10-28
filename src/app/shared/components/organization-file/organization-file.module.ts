import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrganizationFileComponent } from './organization-file.component';
import { MatIconModule } from '@angular/material/icon';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DropdownModule } from '../../directives/dropdown/dropdown.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { DialogDemandeModule } from '../dialog-demande/dialog-demande.module';

@NgModule({
  declarations: [OrganizationFileComponent],
  imports: [
    CommonModule,
    MatIconModule,
    FlexLayoutModule,
    DropdownModule,
    MatButtonModule,
    MatDialogModule,
    DialogDemandeModule,
  ],
  exports: [OrganizationFileComponent],
})
export class OrganizationFileModule {}
