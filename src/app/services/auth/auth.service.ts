import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import {Router} from "@angular/router";
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://chatup-backend-i6fa.onrender.com/api/auth';
  //private apiUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient, private router: Router) {}
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

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password?email=${email}`, {}, { responseType: 'text' });
  }

  changePassword(token: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/change-password`,
      null,
      {
        responseType: 'text',
        params: { token, password: newPassword }
      });
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/landing']);
  }
}

export interface AuthResponse {
  jwt: string;
  userId: string;
}
