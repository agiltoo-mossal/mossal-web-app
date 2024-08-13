import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrganizationFileComponent } from './organization-file.component';
import { MatIconModule } from '@angular/material/icon';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DropdownModule } from '../../directives/dropdown/dropdown.module';

@NgModule({
  declarations: [OrganizationFileComponent],
  imports: [CommonModule, MatIconModule, FlexLayoutModule, DropdownModule],
  exports: [OrganizationFileComponent],
})
export class OrganizationFileModule {}
