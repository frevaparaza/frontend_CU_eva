import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import { tap } from 'rxjs/operators';
import {Router} from "@angular/router";
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://chatup-backend-i6fa.onrender.com/api/auth';
  //private apiUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient, private router: Router) {}

  //#region Login/Signup/Logout
  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, {email, password})
      .pipe(
        tap((response: AuthResponse) => {
          localStorage.setItem('jwt', response.jwt);
          localStorage.setItem('userId', response.userId);
        })
      );
  }

  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, {username, email, password}, {responseType: 'text'});
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/landing']);
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
  isLoggedIn(): boolean {
    const token = localStorage.getItem('jwt');
    return !!token;
  }

  updateToken(userId: string, token: string): Observable<string> {
    const url = `${this.apiUrl}/user/${userId}/token`;
    return this.http.post<string>(url, token, { responseType: 'text' as 'json' });
  }

  getToken() {
    return localStorage.getItem('jwt');
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    const expirationDate = this.getExpirationDate(token);
    return expirationDate ? expirationDate.valueOf() <= new Date().valueOf() : true;
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
