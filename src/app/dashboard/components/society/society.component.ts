import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-society',
  templateUrl: './society.component.html',
  styleUrls: ['./society.component.scss'],
})
export class SocietyComponent {
  constructor(
    private router: Router
  ) { }

  requests = [{}, {}, {}, {}, {}, {}];

}
