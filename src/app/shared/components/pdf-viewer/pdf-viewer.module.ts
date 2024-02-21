import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PdfViewerComponent } from './pdf-viewer.component';
import { FlexModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { PdfViewerModule } from 'ng2-pdf-viewer';

@NgModule({
  declarations: [PdfViewerComponent],
  imports: [
    CommonModule,
    FlexModule,
    MatIconModule,
    NgxExtendedPdfViewerModule,
    PdfViewerModule
  ],
  exports: [PdfViewerComponent],
})
export class AppPdfViewerModule {}
