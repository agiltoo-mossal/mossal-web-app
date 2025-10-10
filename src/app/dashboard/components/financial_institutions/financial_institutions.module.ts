import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinancialInstitutionsComponent } from './financial_institutions.component';
import { FinancialInstitutionsRoutingModule } from './financial_institutions-routing.module';
import { OverviewComponent } from './components/overview/overview.component';
import { CreateFinancialInstitutionsComponent } from './components/create-financial_institutions/create-financial_institutions.component';
import { UserDetailsModule } from 'src/app/shared/components/user-details/user-details.module';
import { MatIconModule } from '@angular/material/icon';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DropdownModule } from 'src/app/shared/directives/dropdown/dropdown.module';
import { FormFinancialInstitutionsComponent } from './components/form-financial_institutions/form-financial_institutions.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilterModule } from 'src/app/shared/pipes/filter/filter.module';
import { RequiresConfirmationModule } from 'src/app/shared/directives/requires-confirmation/requires-confirmation.module';
import { FileUploadComponent } from 'src/app/shared/components/file-upload/file-upload.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FileUploadModule } from 'src/app/shared/components/file-upload/file-upload.module';
import { DemandeStatusModule } from 'src/app/shared/pipes/demande-status/demande-status.module';

@NgModule({
  declarations: [
    FinancialInstitutionsComponent,
    OverviewComponent,
    CreateFinancialInstitutionsComponent,
    FormFinancialInstitutionsComponent,
  ],
  imports: [
    CommonModule,
    FinancialInstitutionsRoutingModule,
    UserDetailsModule,
    MatIconModule,
    FlexLayoutModule,
    DropdownModule,
    ReactiveFormsModule,
    FilterModule,
    FormsModule,
    RequiresConfirmationModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatInputModule,
    MatFormFieldModule,
    FileUploadModule,
    DemandeStatusModule,
    MatIconModule,
  ],
  exports: [FinancialInstitutionsComponent],
})
export class FinancialInstitutionsModule {}
