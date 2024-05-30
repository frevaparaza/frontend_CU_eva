import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserConfigService {
  private baseUrl = 'https://chatup-backend-i6fa.onrender.com/api/configuration';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const jwt = localStorage.getItem('jwt');
    return new HttpHeaders({
      Authorization: `Bearer ${jwt}`,
    });
  }

  deleteUser(userId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete/${userId}`, {
      headers: this.getAuthHeaders(),
      responseType: 'text' as 'json'
    });
  }

  updateUser(userId: string, updateUserDTO: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/update/${userId}`, updateUserDTO, {
      headers: this.getAuthHeaders(),
      responseType: 'text' as 'json'
    });
  }

  uploadImage(userId: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.put(`${this.baseUrl}/uploadImage/${userId}`, formData, {
      headers: this.getAuthHeaders()
    });
  }

  getImage(userId: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/image/${userId}`, {
      headers: this.getAuthHeaders(),
      responseType: 'blob'
    });
  }
}
