import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { APP_CONTEXT } from '../shared/enums/app-context.enum';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit, OnDestroy {

  constructor(private appService: AppService) {}

  ngOnInit(): void {
    this.appService.setContext(APP_CONTEXT.Auth);
  }

  ngOnDestroy(): void {
    this.appService.setContext(APP_CONTEXT.Default);
  }
}
