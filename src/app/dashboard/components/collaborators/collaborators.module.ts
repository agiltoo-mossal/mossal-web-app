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
import { FileUploadModule } from 'src/app/shared/components/file-upload/file-upload.module';

@NgModule({
  declarations: [
    CollaboratorsComponent,
    OverviewComponent,
    CreateCollobatorComponent,
    EditCollaboratorComponent,
    FormCollaboratorComponent,
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
    FileUploadModule,
  ],
  exports: [CollaboratorsComponent],
})
export class CollaboratorsModule {}
