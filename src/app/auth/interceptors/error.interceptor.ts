import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpInterceptor,
  HttpErrorResponse,
  HttpResponse,
  HttpEvent
} from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private router: Router) {}

  // intercept(req: HttpRequest<any>, next: HttpHandler) {
  //   return next.handle(req).pipe(
  //     catchError((error: HttpErrorResponse) => {
  //     if (error.status === 401 || error.status === 403) {
  //       // handle unauthorized error
  //       this.router.navigate(['/auth/login']);
  //     } else if (error.status === 500) {
  //       // handle internal server error
  //     }
  //     return throwError(error);
  //     })
  //   );
  // }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      map(event => {
        // Here you can check the response and determine if it contains an error
        // For example, if the response has a specific structure for errors
        if (event instanceof HttpResponse && event.body && event.body.errors) {
          // Handle GraphQL errors
          const errors = event.body.errors;
          if (errors.some(error => error.extensions.code === 'UNAUTHENTICATED' || error.extensions.code === 'UNAUTHORIZED' || error.extensions.code === 'FORBIDDEN')) {
            this.router.navigate(['/auth/login']);
          } else if (errors.some(error => error.extensions.code === 'INTERNAL_SERVER_ERROR')) {
            // Handle internal server error
          }
          // Modify the response to include the error in the structure you need
          return event.clone({
            body: { ...event.body, success: false }
          });
        }
        return event;
      }),
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
