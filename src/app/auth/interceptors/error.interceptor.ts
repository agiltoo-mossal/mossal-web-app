import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
    catchError((error: HttpErrorResponse) => {
    if (error.status === 401 || error.status === 403) {
      // handle unauthorized error
      this.router.navigate(['/auth/login']);
    } else if (error.status === 500) {
      // handle internal server error
    }
    return throwError(error);
    })
    );
  }
}
