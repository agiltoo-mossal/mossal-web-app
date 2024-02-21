import { Component, Input } from '@angular/core';
import { Course } from 'src/graphql/generated';

@Component({
  selector: 'app-path-card-progress',
  templateUrl: './path-card-progress.component.html',
  styleUrls: ['./path-card-progress.component.scss'],
})
export class PathCardProgressComponent {
  @Input() data: any;
}
