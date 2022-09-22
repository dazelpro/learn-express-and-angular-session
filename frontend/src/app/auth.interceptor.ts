import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpClient,
    HttpErrorResponse,
} from '@angular/common/http';
import { from, Observable, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import decode from 'jwt-decode';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    static accessToken = '';

    constructor(private http: HttpClient, private route: Router) {}

    intercept( request: HttpRequest<unknown>, next: HttpHandler ): Observable<HttpEvent<unknown>> {
        const req = request.clone({
            setHeaders: {
                Authorization: `Bearer ${AuthInterceptor.accessToken}`,
            },
        });
        return next.handle(req).pipe(
            catchError((err: HttpErrorResponse) => {
                if (err.status === 401) {
                    return this.http.get('http://localhost:8000/refresh-token', { withCredentials: true }).pipe(
                        switchMap((data:any)=>{
                            AuthInterceptor.accessToken = data.accessToken;
                            return next.handle(request.clone({
                                setHeaders: {
                                    Authorization: `Bearer ${AuthInterceptor.accessToken}`,
                                },
                            }))
                        })
                    )
                }
                if (err.status === 403) {
                    this.http.delete('http://localhost:8000/logout', { withCredentials: true });
                    AuthInterceptor.accessToken = '';
                    this.route.navigate(['/login']);
                }
                return throwError(() => err);
            })
        );
    }
}
