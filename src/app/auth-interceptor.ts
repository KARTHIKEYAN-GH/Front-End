import {
  HttpInterceptorFn,
  HttpRequest,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import {
  Observable,
  catchError,
  switchMap,
  throwError,
  of
} from 'rxjs';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

// Flag to prevent multiple refresh attempts at once
let isRefreshing = false;

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: (req: HttpRequest<any>) => Observable<HttpEvent<any>>
): Observable<HttpEvent<any>> => {
  const http = inject(HttpClient);
  const router = inject(Router);

  // Don't add token or retry for the refresh token API itself
  if (req.url.includes('/refresh')) {
    return next(req);
  }

  const accessToken = sessionStorage.getItem('accessToken');
  if (accessToken) {
    req = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${accessToken}`)
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        const refreshToken = sessionStorage.getItem('refreshToken');

        // If no refresh token logout immediately
        if (!refreshToken || isRefreshing) {
          sessionStorage.clear();
        alert('Session expired. Please login again.');
          router.navigate(['/login']);
          return throwError(() => error);
        }

        isRefreshing = true;

        const refreshPayload = {
          refreshToken,
          accessToken
        };

        return http.post<any>('http://localhost:9090/api/cloudstack/refresh', refreshPayload).pipe(
          switchMap(response => {
            isRefreshing = false;

            // If backend says refresh token is expired or invalid, logout
            if (response?.message === 'Token Expired Please login') {
              sessionStorage.clear();
             alert('Session expired. Please login again.');
              router.navigate(['/login']);
              return throwError(() => error);
            }

            // Save new tokens
            sessionStorage.setItem('accessToken', response.accessToken);
            sessionStorage.setItem('refreshToken', response.refreshToken);

            // Retry original request with new token
            const retryReq = req.clone({
              headers: req.headers.set('Authorization', `Bearer ${response.accessToken}`)
            });

            return next(retryReq);
          }),
          catchError(refreshError => {
            // Refresh token call failed, logout
            isRefreshing = false;
            sessionStorage.clear();
            alert('Session expired. Please login again.');
            router.navigate(['/login']);
            return throwError(() => refreshError);
          })
        );
      }

      // For other errors, just propagate
      return throwError(() => error);
    })
  );
};
