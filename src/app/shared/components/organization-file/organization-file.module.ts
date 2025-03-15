import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrganizationFileComponent } from './organization-file.component';
import { MatIconModule } from '@angular/material/icon';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DropdownModule } from '../../directives/dropdown/dropdown.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { DialogDemandeModule } from '../dialog-demande/dialog-demande.module';
import { MatTooltipModule } from '@angular/material/tooltip';

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
    MatTooltipModule,
  ],
  exports: [OrganizationFileComponent],
})
export class OrganizationFileModule {}
