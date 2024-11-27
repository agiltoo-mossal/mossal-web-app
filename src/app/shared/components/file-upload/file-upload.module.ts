import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FileUploadComponent } from './file-upload.component';
import { MatIconModule } from '@angular/material/icon';
import { TooltipPosition, MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [FileUploadComponent],
  imports: [CommonModule, MatIconModule, MatTooltipModule],
  exports: [FileUploadComponent],
})
export class FileUploadModule {}
