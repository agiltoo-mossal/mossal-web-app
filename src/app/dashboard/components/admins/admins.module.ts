import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminsComponent } from './admins.component';
import { AdminsRoutingModule } from './admins-routing.module';
import { UserDetailsModule } from 'src/app/shared/components/user-details/user-details.module';
import { MatIconModule } from '@angular/material/icon';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DropdownModule } from 'src/app/shared/directives/dropdown/dropdown.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OverviewComponent } from './components/overview/overview.component';
import { FormAdminComponent } from './components/form-admin/form-admin.component';
import { EditAdminComponent } from './components/edit-admin/edit-admin.component';
import { CreateAdminComponent } from './components/create-admin/create-admin.component';
import { FilterModule } from 'src/app/shared/pipes/filter/filter.module';
import { RequiresConfirmationModule } from 'src/app/shared/directives/requires-confirmation/requires-confirmation.module';
import { FileUploadComponent } from 'src/app/shared/components/file-upload/file-upload.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { FileUploadModule } from 'src/app/shared/components/file-upload/file-upload.module';

@NgModule({
  imports: [
    CommonModule,
    AdminsRoutingModule,
    UserDetailsModule,
    MatIconModule,
    FlexLayoutModule,
    DropdownModule,
    ReactiveFormsModule,
    FormsModule,
    FilterModule,
    RequiresConfirmationModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    FileUploadModule,
    MatIconModule,
  ],
  declarations: [
    AdminsComponent,
    OverviewComponent,
    FormAdminComponent,
    EditAdminComponent,
    CreateAdminComponent,
  ],
})
export class AdminsModule {}
