import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProgressBarService {
  private showProgressBarSubject = new BehaviorSubject<boolean>(false);
  showProgressBar$ = this.showProgressBarSubject.asObservable();

  setShowProgressBar(show: boolean): void {
    this.showProgressBarSubject.next(show);
  }
}
