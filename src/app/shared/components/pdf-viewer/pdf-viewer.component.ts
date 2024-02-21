import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.scss'],
})
export class PdfViewerComponent implements OnInit {
  isZoomed: boolean = false;
  @Input() pdfUrl!: any;

  ngOnInit(): void {
  }

  page: number = 1;
  totalPages: number;

  onPageChange(page: number) {
    this.page = page;
  }

  pdfLoaded(event) {
    this.totalPages = event.pagesCount;
  }

  nextPage() {
    if (this.page < this.totalPages) {
      this.page++;
    }
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
    }
  }
}
