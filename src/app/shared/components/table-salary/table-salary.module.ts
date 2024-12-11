import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TableSalaryComponent } from './table-salary.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    MatMenuModule,
    MatTableModule,
    MatFormFieldModule,
    MatOptionModule,
    FormsModule,
  ],
  declarations: [TableSalaryComponent],
  exports: [TableSalaryComponent],
})
export class TableSalaryModule {}
