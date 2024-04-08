import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequiresConfirmationDirective } from './requires-confirmation.directive';
import { ConfirmDialogModule } from '../../components/confirm-dialog/confirm-dialog.module';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [RequiresConfirmationDirective],
  imports: [CommonModule, MatDialogModule, ConfirmDialogModule],
  exports: [RequiresConfirmationDirective]
})
export class RequiresConfirmationModule {}
