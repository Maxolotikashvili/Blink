import { HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable } from 'rxjs';
import { throwError } from 'rxjs';

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const authToken = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
  const router = inject(Router);

  let cloned = req;
  if (authToken) {
    cloned = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${authToken}`)
    });
  }
  
  return next(cloned).pipe(
    catchError((error) => {
      if (error.status === 401) {
        console.log("Unauthorized, clearing token...");
        localStorage.removeItem('access_token');
        sessionStorage.removeItem('access_token');
        router.navigate(['/home']); // Redirect to home or login
      }
      return throwError(error);
    })
  );
  
}
