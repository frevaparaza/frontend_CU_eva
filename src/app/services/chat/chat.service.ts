import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Message} from "../../models/message.model";
import {catchError, Observable, throwError} from "rxjs";
import {ChatCreationRequest} from "../../components/chat-previews/user-previews.component";
import {tap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = 'https://chatup-backend-i6fa.onrender.com/api/chat';
  //private apiUrl = 'http://localhost:8080/api/chat';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const jwt = localStorage.getItem('jwt');
    return new HttpHeaders({
      Authorization: `Bearer ${jwt}`
    });
  }

  sendMessage(message: Message): Observable<any> {
    console.log("Sending message:", message);
    return this.http.post(`${this.apiUrl}/chat/${message.chatId}`, message, {headers: this.getAuthHeaders()})
      .pipe(
        tap(() => console.log("Message sent:", message)),
        catchError(error => {
          console.error("Error sending message:", error);
          return throwError(() => new Error("Failed to send message"));
        })
      );
  }

  getMessages(chatId: string): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}/messages/${chatId}`,
      {
        headers: this.getAuthHeaders()
      });
  }

  getChatsPreview(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/previews`, {
      headers: this.getAuthHeaders(),
      params: { userId }
    });
  }

  createChat(creationRequest: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/newChat`, creationRequest, {
      headers: this.getAuthHeaders()
    });
  }

  getChatDetails(chatId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${chatId}/details`, {
      headers: this.getAuthHeaders()
    });
  }

  getChatMembers(chatId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${chatId}/members`, {
      headers: this.getAuthHeaders()
    });
  }

  deleteChat(chatId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${chatId}`, { headers: this.getAuthHeaders() });
  }
}
