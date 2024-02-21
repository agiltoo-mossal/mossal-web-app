import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit, OnChanges {
  @Input() currentPage: number;
  @Input() totalItems: number;
  @Input() itemsPerPage: number;
  @Input() items: any[] = [];
  @Output() pageChange: EventEmitter<number> = new EventEmitter();
  @Output() itemsChange: EventEmitter<any[]> = new EventEmitter();

  ngOnInit(): void {
    this.itemsChange.next(this.reNewItems());
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.itemsChange.next(this.reNewItems());
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  toArr(val: number) {
    const result = new Array();
    for(let i=1; i < val + 1; i++) {
      result.push(i);
    }
    return result;
  }

  onPageChange(pageNumber: number): void {
    if (pageNumber > 0 && pageNumber <= this.totalPages) {
      this.currentPage = pageNumber;
      // this.pageChange.emit(pageNumber);
      this.itemsChange.next(this.reNewItems());
    }
  }

  reNewItems() {
    const newItems = this.items.slice(((this.currentPage - 1) * this.itemsPerPage), ((this.currentPage - 1) * this.itemsPerPage)+ this.itemsPerPage);
    return newItems;
  }

  onItemsChange() {

  }
}
