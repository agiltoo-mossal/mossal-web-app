import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CollaboratorsComponent } from './collaborators.component';
import { CollaboratorsRoutingModule } from './collaborators-routing.module';
import { OverviewComponent } from './components/overview/overview.component';
import { CreateCollobatorComponent } from './components/create-collobator/create-collobator.component';
import { UserDetailsModule } from 'src/app/shared/components/user-details/user-details.module';
import { MatIconModule } from '@angular/material/icon';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DropdownModule } from 'src/app/shared/directives/dropdown/dropdown.module';
import { EditCollaboratorComponent } from './components/edit-collaborator/edit-collaborator.component';
import { FormCollaboratorComponent } from './components/form-collaborator/form-collaborator.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilterModule } from 'src/app/shared/pipes/filter/filter.module';
import { RequiresConfirmationModule } from 'src/app/shared/directives/requires-confirmation/requires-confirmation.module';
import { FileUploadComponent } from 'src/app/shared/components/file-upload/file-upload.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
  declarations: [
    CollaboratorsComponent,
    OverviewComponent,
    CreateCollobatorComponent,
    EditCollaboratorComponent,
    FormCollaboratorComponent,
    FileUploadComponent,
  ],
  imports: [
    CommonModule,
    CollaboratorsRoutingModule,
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
    MatFormFieldModule
  ],
  exports: [CollaboratorsComponent],
})
export class CollaboratorsModule {}
