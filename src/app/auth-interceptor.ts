import { HttpInterceptorFn, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: (req: HttpRequest<any>) => Observable<HttpEvent<any>>
): Observable<HttpEvent<any>> => {
  const http = inject(HttpClient);

  return next(req).pipe(
    catchError((error) => {
      if (error.status === 401) {
        const refreshToken = localStorage.getItem('refreshToken');
        const accessToken = localStorage.getItem('accessToken');
        if (!refreshToken) return throwError(() => error);

        const refreshPayload = { refreshToken,accessToken };


        return http.post<any>('http://localhost:9090/api/cloudstack/refresh', refreshPayload).pipe(
          switchMap(newTokens => {
            localStorage.setItem('accessToken', newTokens.accessToken);
            localStorage.setItem('refreshToken', newTokens.refreshToken);

            const retryReq = req.clone({
              headers: req.headers.set('Authorization', `Bearer ${newTokens.accessToken}`)
            });

            return next(retryReq);
          }),
          catchError(refreshError => throwError(() => refreshError))
          
        );
      }
      return throwError(() => error);
    })
  );
};
