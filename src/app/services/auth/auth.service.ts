import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { tap, catchError, switchMap } from 'rxjs/operators';
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://chatup-backend-i6fa.onrender.com/api/auth';
  //private apiUrl = 'http://localhost:8080/api/auth';

  private refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap((response: AuthResponse) => {
          localStorage.setItem('jwt', response.jwt);
          localStorage.setItem('refreshToken', response.refreshToken);
          localStorage.setItem('userId', response.userId);
        })
      );
  }

  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, { username, email, password }, { responseType: 'text' });
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/landing']);
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password?email=${email}`, {}, { responseType: 'text' });
  }

  changePassword(token: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/change-password`, null, {
      responseType: 'text',
      params: { token, password: newPassword }
    });
  }

  getToken(): string | null {
    return localStorage.getItem('jwt');
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    const expirationDate = this.getExpirationDate(token);
    return expirationDate ? expirationDate.valueOf() <= new Date().valueOf() : true;
  }

  private getExpirationDate(token: string): Date | null {
    const decodedToken = this.decodeToken(token);
    if (!decodedToken || decodedToken.exp === undefined) return null;
    return new Date(decodedToken.exp * 1000);
  }

  private decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(window.atob(payload));
    } catch (e) {
      console.error('Error decoding token', e);
      return null;
    }
  }

  renewToken(): Observable<AuthResponse> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      return throwError(() => new Error('Refresh token not found'));
    }
    return this.http.post<AuthResponse>(`${this.apiUrl}/refresh-token`, { refreshToken })
      .pipe(
        tap((response: AuthResponse) => {
          localStorage.setItem('jwt', response.jwt);
          this.refreshTokenSubject.next(response.jwt);
        }),
        catchError(error => {
          this.logout();
          return throwError(error);
        })
      );
  }

  getNewAccessToken(): Observable<string> {
    // @ts-ignore
    return this.renewToken()
      .pipe(
        switchMap(() => this.refreshTokenSubject.asObservable())
      );
  }
}

export interface AuthResponse {
  jwt: string;
  refreshToken: string;
  userId: string;
}
