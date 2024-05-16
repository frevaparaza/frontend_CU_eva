import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { Message } from '../../models/message.model';
import { ChatService } from '../../services/chat/chat.service';
import { UserService } from '../../services/user/user.service';
import { WebSocketService } from '../../services/webSocket/web-socket.service';
import { FormsModule } from '@angular/forms';
import { DatePipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { UserPreviewsComponent } from '../chat-previews/user-previews.component';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  standalone: true,
  imports: [FormsModule, NgClass, UserPreviewsComponent, NgForOf, NgIf, DatePipe],
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit {
  messages: Message[] = [];
  newMessage: string = '';
  chatId: string = '';
  currentUser: string = '';
  chatName: string = '';
  chatType: string = '';
  isSidebarVisible: boolean = true;

  private subscribedChatId: string = '';

  @ViewChild('scrollMe') private myScrollContainer!: ElementRef<HTMLDivElement>;

  constructor(
    private chatService: ChatService,
    private userService: UserService,
    private webSocketService: WebSocketService,
    private authService: AuthService,
    private router: Router
  ) {
    this.currentUser = localStorage.getItem('userId') || '';
  }

  ngOnInit(): void {
    this.subscribeToMessages();
  }

  ngAfterViewInit(): void {
    this.scrollToBottom();
  }

  toggleSidebar(): void {
    this.isSidebarVisible = !this.isSidebarVisible;
  }

  scrollToBottom(): void {
    setTimeout(() => {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    });
  }

  openChat(chat: { chatId: string; chatName: string; chatType: string }): void {
    this.chatId = chat.chatId;
    this.chatName = chat.chatName;
    this.chatType = chat.chatType;
    this.getMessages(this.chatId);
    this.subscribeToMessages();
    console.log('Opened chat:', chat.chatName);
  }

  fetchAndAssignUsername(message: Message): void {
    this.userService.searchUsers(message.sender).subscribe(users => {
      const user = users.find(u => u.id === message.sender);
      if (user) {
        message.senderUsername = user.username;
      }
    });
  }

  subscribeToMessages(): void {
    if (this.chatId && this.chatId !== this.subscribedChatId) {
      this.subscribedChatId = this.chatId;
      this.webSocketService.subscribe(`/topic/chat/${this.chatId}`, (message: Message) => {
        console.log('Message received:', message);
        if (message.sender === this.currentUser) {
          const index = this.messages.findIndex(
            (m) => m.content === message.content && m.senderUsername === 'You'
          );
          if (index !== -1) {
            this.messages[index] = message;
          } else {
            this.messages.push(message);
          }
        } else {
          this.messages.push(message);
        }
        this.scrollToBottom();
      });
    }
  }

  getMessages(chatId: string): void {
    this.chatService.getMessages(chatId).subscribe({
      next: (messages) => {
        this.messages = messages;
        messages.forEach((msg) => {
          if (!msg.senderUsername) {
            this.fetchAndAssignUsername(msg);
          }
        });
        console.log('Messages retrieved successfully:', messages);
        this.scrollToBottom();
      },
      error: (error) => {
        console.error('Error loading messages:', error);
      },
    });
  }

  sendMessage(): void {
    console.log('Current chatId:', this.chatId);
    const message: Message = {
      chatId: this.chatId,
      sender: this.currentUser,
      content: this.newMessage,
      senderUsername: 'You',
    };
    this.messages.push(message);
    this.newMessage = '';

    this.webSocketService.send(`/app/processMessage/${this.chatId}`, message);
  }

  navigateToInfo(): void {
    console.log('Navigating to chat details with chatId:', this.chatId);
    if (this.chatType === 'private') {
      this.router.navigate(['/user-info', this.chatId]);
    } else {
      this.router.navigate(['/chat-details', this.chatId]);
    }
  }

  logout(): void {
    this.authService.logout();
  }
}
