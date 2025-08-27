import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SocietyComponent } from './society.component';
import { SocietyRoutingModule } from './society-routing.module';
import { OverviewComponent } from './components/overview/overview.component';
import { CreateSocietyComponent } from './components/create-society/create-society.component';
import { UserDetailsModule } from 'src/app/shared/components/user-details/user-details.module';
import { MatIconModule } from '@angular/material/icon';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DropdownModule } from 'src/app/shared/directives/dropdown/dropdown.module';
import { EditSocietyComponent } from './components/edit-society/edit-society.component';
import { FormSocietyComponent } from './components/form-society/form-society.component';
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
// import { DetailSocietyComponent } from './components/detail-society/detail-society.component';
import { DemandeStatusModule } from 'src/app/shared/pipes/demande-status/demande-status.module';

@NgModule({
  declarations: [
    SocietyComponent,
    OverviewComponent,
    CreateSocietyComponent,
    EditSocietyComponent,
    FormSocietyComponent,
    // DetailSocietyComponent,
  ],
  imports: [
    CommonModule,
    SocietyRoutingModule,
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
  exports: [SocietyComponent],
})
export class SocietyModule {}
