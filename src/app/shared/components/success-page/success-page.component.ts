import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-success-page',
  templateUrl: './success-page.component.html',
  styleUrls: ['./success-page.component.scss']
})
export class SuccessPageComponent {
  @Input() message;
  @Input() link: string;
  @Input() buttonText: string;
  @Input() hideSubMessage = true;
}
