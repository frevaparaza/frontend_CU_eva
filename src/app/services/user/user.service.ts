import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {UserDTO} from "../../dto/UserDTO";
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'https://chatup-backend-i6fa.onrender.com/api/user';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const jwt = localStorage.getItem('jwt');
    return new HttpHeaders({
      Authorization: `Bearer ${jwt}`
    });
  }

  searchUsers(query: string): Observable<UserDTO[]> {
    return this.http.get<UserDTO[]>(`${this.baseUrl}/search`, {
      headers: this.getAuthHeaders(),
      params: { query }    });
  }

  getUser(userId: string): Observable<UserDTO> {
    return this.http.get<UserDTO>(`${this.baseUrl}/info/${userId}`, {
      headers: this.getAuthHeaders()
    });
  }
}
