import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {Message} from "../../models/message.model";
import {catchError, Observable, throwError} from "rxjs";
import {tap} from "rxjs/operators";
import {user} from "@angular/fire/auth";
import {ErrorHandlingService} from "../errorHandling/error-handling.service";

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = 'https://chatup-backend-i6fa.onrender.com/api/chat';

  constructor(
    private http: HttpClient,
    private errorService: ErrorHandlingService
) {}

  private getAuthHeaders(): HttpHeaders {
    const jwt = localStorage.getItem('jwt');
    return new HttpHeaders({
      Authorization: `Bearer ${jwt}`
    });
  }

  //region Messages
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
      }). pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error getting messages:', error);
          return throwError(() => new Error('Failed to get messages'));
        })
    );
  }
  //#endregion

  //#region Create/Delete chat
  createChat(creationRequest: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/newChat`, creationRequest, {
      headers: this.getAuthHeaders()
    });
  }

  deleteChat(chatId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${chatId}`
      , {
        headers: this.getAuthHeaders(),
        responseType: 'text' as 'json'
      }
    ).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error deleting chat:', error);
        return throwError(() => new Error('Failed to delete chat'));
      })
    ) as Observable<void>;
  }
  //#endregion

  getChatsPreview(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/previews`, {
      headers: this.getAuthHeaders(),
      params: { userId }
    })
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

  //#region Add/Remove members
  addChatMember(chatId: string, userId: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${chatId}/addUser`, {userId: userId}, {
      headers: this.getAuthHeaders()
    });
  }

  removeChatMember(chatId: string, userId: string): Observable<any> {
    const url = `${this.apiUrl}/${chatId}/removeUser/${userId}`;
    return this.http.delete(url, {
      headers: this.getAuthHeaders(),
      responseType: 'json'
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error removing user from chat:', error);
        return throwError(() => new Error('Failed to remove user from chat'));
      })
    );
  }
  //#endregion
}
