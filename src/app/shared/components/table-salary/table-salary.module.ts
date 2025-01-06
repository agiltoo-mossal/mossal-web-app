import { CommonModule, DatePipe } from '@angular/common';
import { NgModule, Pipe } from '@angular/core';
import { TableSalaryComponent } from './table-salary.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { FrenchDatePipe } from '../../pipes/french-date/french-date.pipe';
import { SortDescPipe } from '../../pipes/sort-desc/sort-desc.pipe';
import { DemandeStatusModule } from '../../pipes/demande-status/demande-status.module';
import { RequiresConfirmationModule } from '../../directives/requires-confirmation/requires-confirmation.module';
import { MatPaginatorModule } from '@angular/material/paginator';
import { OrganizationFileModule } from '../organization-file/organization-file.module';
import { UserDetailsModule } from '../user-details/user-details.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DropdownModule } from '../../directives/dropdown/dropdown.module';

@NgModule({
  imports: [
    CommonModule,
    MatMenuModule,
    MatTableModule,
    MatFormFieldModule,
    MatOptionModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    DatePipe,
    FrenchDatePipe,
    SortDescPipe,
    DemandeStatusModule,
    RequiresConfirmationModule,
    MatPaginatorModule,
    OrganizationFileModule,
    UserDetailsModule,
    FlexLayoutModule,
    DropdownModule,
  ],
  declarations: [TableSalaryComponent],
  exports: [TableSalaryComponent],
})
export class TableSalaryModule {}
