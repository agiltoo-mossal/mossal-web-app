import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestPasswordResetComponent } from './request-password-reset.component';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatSnackBarModule } from '@angular/material/snack-bar';



@NgModule({
  declarations: [
    RequestPasswordResetComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatDialogModule,
    FlexLayoutModule,
    MatSnackBarModule
  ]
})
export class RequestPasswordResetModule { }
