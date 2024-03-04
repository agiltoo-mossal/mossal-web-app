import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserDetailsComponent } from './user-details.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [UserDetailsComponent],
  imports: [CommonModule, FlexLayoutModule, MatIconModule],
  exports: [UserDetailsComponent],
})
export class UserDetailsModule {}
