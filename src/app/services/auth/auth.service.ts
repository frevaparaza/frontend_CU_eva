import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject, Observable, throwError} from 'rxjs';
import { tap } from 'rxjs/operators';
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://chatup-backend-i6fa.onrender.com/api/auth';
  //private apiUrl = 'http://localhost:8080/api/auth';

  private isAuthenticated = new BehaviorSubject<boolean>(this.hasToken());

  isLoggedIn(): Observable<boolean> {
    return this.isAuthenticated.asObservable();
  }

  constructor(private http: HttpClient, private router: Router) {}

  //#region Login/Signup/Logout
  login(email: string, password: string): Observable<AuthResponse> {
    localStorage.removeItem('jwt');
    console.log(localStorage.getItem('jwt'));
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, {email, password})
      .pipe(
        tap((response: AuthResponse) => {
          localStorage.setItem('jwt', response.jwt);
          localStorage.setItem('userId', response.userId);
          this.isAuthenticated.next(true);
          console.log('Logged in');
          console.log(localStorage.getItem('jwt'));
        })
      );
  }

  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, {username, email, password}, {responseType: 'text'});
  }

  logout(): void {
    localStorage.removeItem('jwt');
    localStorage.removeItem('userId');
    console.log('Logged out');
    console.log(localStorage.getItem('jwt'));
    this.router.navigate(['/landing']).then(() => window.location.reload());
  }
  //#endregion

  //#region Password change
  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password?email=${email}`, {}, { responseType: 'text' });
  }

  changePassword(token: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/change-password`, null, {
        responseType: 'text',
        params: { token, password: newPassword }
      });
  }
  //#endregion

  //#region Token management
  private hasToken(): boolean {
    const token = localStorage.getItem('jwt');
    return !!token && !this.isTokenExpired();
  }

  updateToken(userId: string, token: string): Observable<string> {
    const url = `${this.apiUrl}/user/${userId}/token`;
    return this.http.post<string>(url, token, { responseType: 'text' as 'json' });
  }

  isTokenExpired(): boolean {
    const token = localStorage.getItem('jwt');
    if (!token) return true;
    const { exp } = JSON.parse(atob(token.split('.')[1]));
    return Date.now() >= exp * 1000;
  }

   getExpirationDate(token: string): Date | null {
    const decodedToken = this.decodeToken(token);
    if (!decodedToken || decodedToken.exp === undefined) return null;
    return new Date(decodedToken.exp * 1000);
  }

  decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(window.atob(payload));
    } catch (e) {
      console.error('Error decoding token', e);
      return null;
    }
  }

  renewToken(): Observable<string> {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      return throwError(() => new Error('User ID not found'));
    }
    return this.http.post<string>(`${this.apiUrl}/user/${userId}/token`, {}, {
      responseType: 'text' as 'json'
    });
  }
  //#endregion
}

export interface AuthResponse {
  jwt: string;
  userId: string;
}
