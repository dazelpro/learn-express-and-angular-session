import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpClient,
    HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    static accessToken = '';
    refresh = false;

    constructor(private http: HttpClient) {}

    intercept(
        request: HttpRequest<unknown>,
        next: HttpHandler
    ): Observable<HttpEvent<unknown>> {
        const req = request.clone({
            setHeaders: {
                Authorization: `Bearer ${AuthInterceptor.accessToken}`,
            },
        });
        return next.handle(req).pipe(catchError((err: HttpErrorResponse) => {
                if (err.status === 401 && !this.refresh) {
                    this.refresh = true;
                    return this.http
                        .get(
                            'http://localhost:8000/refresh-token',
                            { withCredentials: true }
                        )
                        .pipe(
                            switchMap((res: any) => {
                                AuthInterceptor.accessToken = res.token;

                                return next.handle(
                                    request.clone({
                                        setHeaders: {
                                            Authorization: `Bearer ${AuthInterceptor.accessToken}`,
                                        },
                                    })
                                );
                            })
                        );
                }
                this.refresh = false;
                return throwError(() => err);
            })
        );
    }
}
