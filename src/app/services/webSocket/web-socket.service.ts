import { Injectable } from '@angular/core';
import { Client, Message } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private client: Client;

  constructor() {
    this.client = new Client({
      webSocketFactory: () => new SockJS('https://chatup-backend-i6fa.onrender.com/api/ws'),
      reconnectDelay: 10000,
    });

    this.client.onConnect = (frame) => {
      console.log('Connected:', frame);
    };

    this.client.onStompError = (frame) => {
      console.error('Broker reported error:', frame.headers['message']);
      console.error('Additional details:', frame.body);
    };

    this.client.activate();
  }

  send(destination: string, body: any) {
    if (this.client.connected) {
      console.log('Publishing to:', destination, 'Body:', body);
      this.client.publish({ destination, body: JSON.stringify(body) });
    } else {
      console.error('WebSocket not connected');
    }
  }

  subscribe(destination: string, callback: (message: any) => void) {
    if (this.client.connected) {
      this.client.subscribe(destination, (msg) => callback(JSON.parse(msg.body)));
    } else {
      this.client.onConnect = () => {
        this.client.subscribe(destination, (msg) => callback(JSON.parse(msg.body)));
      };
    }
  }
}
