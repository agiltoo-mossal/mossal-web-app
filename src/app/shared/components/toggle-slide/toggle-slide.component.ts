import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { ActivationService } from 'src/app/dashboard/components/organization/activation.service';

@Component({
  selector: 'app-toggle-slide',
  templateUrl: './toggle-slide.component.html',
  styleUrl: './toggle-slide.component.scss',
})
export class ToggleSlideComponent {
  randomId = Math.random().toString(36).substring(7);
  valueChecked: boolean;
  @Input() firstText: string = 'Off';
  @Input() secondText: string = 'On';
  @Input() uniqueId: string;
  @Input() serviceId: string;

  @Input() set value(data: boolean) {
    console.log({
      service: this.serviceId,
      data,
    });

    this.valueChecked = data;
  }
  @Output() toggleChange = new EventEmitter<boolean>();
  constructor(private activateService: ActivationService) {}

  onToggleChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;

    this.toggleChange.emit(value === 'First');
  }
}
