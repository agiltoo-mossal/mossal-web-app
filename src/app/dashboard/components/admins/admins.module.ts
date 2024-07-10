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
  ],
  declarations: [
    AdminsComponent,
    OverviewComponent,
    FileUploadComponent,
    FormAdminComponent,
    EditAdminComponent,
    CreateAdminComponent,
  ],
})
export class AdminsModule {}
