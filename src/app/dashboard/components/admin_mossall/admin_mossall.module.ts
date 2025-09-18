import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminMossallComponent } from './admin_mossall.component';
import { AdminMossallRoutingModule } from './admin_mossall-routing.module';
import { UserDetailsModule } from 'src/app/shared/components/user-details/user-details.module';
import { MatIconModule } from '@angular/material/icon';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DropdownModule } from 'src/app/shared/directives/dropdown/dropdown.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OverviewComponent } from './components/overview/overview.component';
import { FormAdminMossallComponent } from './components/form-admin-mossall/form-admin-mossall.component';
import { EditAdminMossallComponent } from './components/edit-admin-mossall/edit-admin-mossall.component';
import { CreateAdminMossallComponent } from './components/create-admin-mossall/create-admin-mossall.component';
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
    AdminMossallRoutingModule,
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
    AdminMossallComponent,
    OverviewComponent,
    FormAdminMossallComponent,
    EditAdminMossallComponent,
    CreateAdminMossallComponent,
  ],
})
export class AdminMossallModule {}
