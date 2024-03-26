import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CollaboratorsComponent } from './collaborators.component';
import { CollaboratorsRoutingModule } from './collaborators-routing.module';
import { OverviewComponent } from './components/overview/overview.component';
import { CreateCollobatorComponent } from './components/create-collobator/create-collobator.component';
import { UserDetailsModule } from 'src/app/shared/components/user-details/user-details.module';
import { MatIconModule } from '@angular/material/icon';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  declarations: [
    CollaboratorsComponent,
    OverviewComponent,
    CreateCollobatorComponent,
  ],
  imports: [
    CommonModule,
    CollaboratorsRoutingModule,
    UserDetailsModule,
    MatIconModule,
    FlexLayoutModule,
  ],
  exports: [CollaboratorsComponent],
})
export class CollaboratorsModule {}
