import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { ProgressBarService } from '../services/progress-bar.service';
import { SnackBarService } from '../services/snackbar.service';

@Injectable()
export class ProgressBarInterceptor implements HttpInterceptor {
  constructor(
    private progressBarService: ProgressBarService,
    private snackBarService: SnackBarService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.progressBarService.setShowProgressBar(true);

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Afficher un message d'erreur à l'aide de MatSnackBar
        this.snackBarService.showErrorSnackBar();

        return throwError(error); // Propagez l'erreur
      }),
      finalize(() => {
        this.progressBarService.setShowProgressBar(false);
      })
    );
  }
}
