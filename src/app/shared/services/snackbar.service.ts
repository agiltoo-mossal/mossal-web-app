import { Injectable } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarConfig
} from '@angular/material/snack-bar';

import { Observable, of } from 'rxjs';

export enum SnackBarClassByResult {
  Success = 'success-bar',
  Error = 'error-bar',
}

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {
  constructor(
    private snackBar: MatSnackBar
  ) {}

  public showSnackBar(
    message: string,
    actionsMessage = '✕',
    config: MatSnackBarConfig = {
      panelClass: SnackBarClassByResult.Success,
      duration: 2500
    }
  ): Observable<any> {
    const snackBarRef = this.snackBar.open(message, actionsMessage, {
      ...config,
      direction: 'ltr'
    });
    return new Observable(observer => {
      snackBarRef.onAction().subscribe(() => {
        observer.next({ reverse: true });
        observer.complete();
      });

      snackBarRef.afterDismissed().subscribe(() => {
        observer.next({ dismissed: true });
        observer.complete();
      });
    });
  }

  public showSuccessSnackBar(message: string) {
    this.showSnackBar(message, "X", { panelClass: SnackBarClassByResult.Success, duration: 4000 })
  }

  public showErrorSnackBar(
    duration: number = 4000,
    errorMessage?: string
  ): Observable<void> {
    return this.showSnackBar(errorMessage || "Quelque chose a mal tourné!", undefined, {
      panelClass: SnackBarClassByResult.Error,
      duration,
      direction: 'ltr'
    });
  }
}
