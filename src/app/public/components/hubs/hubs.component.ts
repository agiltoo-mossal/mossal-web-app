import { Component } from '@angular/core';
import { Hubs } from './mock';

@Component({
  selector: 'app-hubs',
  templateUrl: './hubs.component.html',
  styleUrls: ['./hubs.component.scss'],
})
export class HubsComponent {
  hubList = Hubs;
}
