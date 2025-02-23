import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-toggle-slide',
  templateUrl: './toggle-slide.component.html',
  styleUrl: './toggle-slide.component.scss',
})
export class ToggleSlideComponent {
  randomId = Math.random().toString(36).substring(7);
  @Input() firstText: string = 'Off';
  @Input() secondText: string = 'On';
  @Input() uniqueId: string;
  @Input() value!: boolean;
  @Output() toggleChange = new EventEmitter<boolean>();
  ngAfterViewInit() {
    console.log('uniqueId', this.uniqueId);
    console.log('value', this.value);
  }
  onToggleChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    console.log(value, 'value');

    this.toggleChange.emit(value === 'First');
  }
}
