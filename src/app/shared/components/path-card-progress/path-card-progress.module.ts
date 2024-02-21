import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PathCardProgressComponent } from './path-card-progress.component';
import { MatIconModule } from '@angular/material/icon';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatProgressBarModule } from '@angular/material/progress-bar';



@NgModule({
  declarations: [
    PathCardProgressComponent
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatIconModule,
    MatProgressBarModule
  ],
  exports: [PathCardProgressComponent]
})
export class PathCardProgressModule { }
