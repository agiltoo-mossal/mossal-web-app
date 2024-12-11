import { Component, Input } from '@angular/core';

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
}
