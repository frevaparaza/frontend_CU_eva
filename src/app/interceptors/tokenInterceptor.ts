import {Injectable} from "@angular/core";
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {AuthService} from "../services/auth/auth.service";
import {catchError, from, Observable, switchMap, throwError} from "rxjs";

@Injectable()
export class TokenInterceptor implements HttpInterceptor{

  constructor( private authService: AuthService ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.authService.isTokenExpired()) {
      return from(this.authService.renewToken()).pipe(
        switchMap((newToken: string) => {
          const clonedRequest = request.clone({
            headers: request.headers.set('Authorization', `Bearer ${newToken}`)
          });
          return next.handle(clonedRequest);
        }),
        catchError(error => {
          console.error('Error in token renewal:', error);
          return throwError(() => new Error('Token renewal failed'));
        })
      );
    }

    return next.handle(request);
  }
}
