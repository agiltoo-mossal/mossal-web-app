import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input
} from '@angular/core';
import { MenuAction } from '../../types/typings';

@Component({
  selector: 'app-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccordionComponent implements OnInit {
  @Input() isOpen: boolean = false;
  @Input() headerText: string;
  @Input() subtitle: string;
  @Input() subtitleIcon: string;
  @Input() actions: MenuAction[];
  constructor() {}

  ngOnInit() {}

  get headerTextJoined() {
    if(this.headerText) {
      return this.headerText.split(' ').join('').toLocaleLowerCase();
    }
    return Math.random();
  }

  triggerAction(action: MenuAction) {
    action.callback(action.callbackParams);
  }
}
