// src/app/core/interceptors/error.interceptor.ts
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unknown error occurred!';
      if (error.error instanceof ErrorEvent) {
       
        errorMessage = `Error: ${error.error.message}`;
      } else {
        
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        
        console.error(errorMessage);
      }
   
      return throwError(() => error);
    })
  );
};