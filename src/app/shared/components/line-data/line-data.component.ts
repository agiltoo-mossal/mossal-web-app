import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-line-data',
  templateUrl: './line-data.component.html',
  styleUrls: ['./line-data.component.scss']
})
export class LineDataComponent {
  @Input() text: string;
  @Input() id: any;

  @Output() delete: EventEmitter<any> = new EventEmitter();

  @Output() edit: EventEmitter<any> = new EventEmitter();

  deleteLine() {
    this.delete.next(this.id);
  }

  editLine() {
    this.edit.next(this.id);
  }
}
