import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { InactivityService } from './inactivity.service';
import { APP_CONTEXT } from './shared/enums/app-context.enum';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  private context = APP_CONTEXT.Default;
  contextAsync = new Subject<APP_CONTEXT>();
  constructor(private inactivityService: InactivityService) { }

  setContext(context: APP_CONTEXT) {
    this.context = context;
    this.contextAsync.next(context);
  }

  getContext() {
    return this.context;
  }
}
