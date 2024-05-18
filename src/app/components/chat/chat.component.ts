import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { Message } from '../../models/message.model';
import { ChatService } from '../../services/chat/chat.service';
import { UserService } from '../../services/user/user.service';
import { WebSocketService } from '../../services/webSocket/web-socket.service';
import { FormsModule } from '@angular/forms';
import {DatePipe, NgClass, NgForOf, NgIf, NgOptimizedImage} from '@angular/common';
import { UserPreviewsComponent } from '../chat-previews/user-previews.component';
import { Router} from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  standalone: true,
  imports: [FormsModule,
    NgClass,
    UserPreviewsComponent,
    NgForOf,
    NgIf,
    DatePipe, NgOptimizedImage],
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit, AfterViewInit {
  messages: Message[] = [];
  newMessage: string = '';
  chatId: string = '';
  chatName: string = '';
  chatType: string = '';
  currentUserId: string = '';
  userId: string = '';
  chat: any = {};

  private subscribedChatId: string = '';

  @ViewChild('scrollMe') private myScrollContainer!: ElementRef<HTMLDivElement>;

  constructor(
    private chatService: ChatService,
    private userService: UserService,
    private webSocketService: WebSocketService,
    private authService: AuthService,
    private router: Router,
    private sharedService: SharedService,
  ) {
    this.currentUserId = localStorage.getItem('userId') || '';
  }

  ngOnInit(): void {
    console.log("initializing chat component");
    this.chat = this.sharedService.getData();
    if (this.chat) {
      this.openChat(this.chat);
    }
  }

  ngAfterViewInit(): void {
    this.scrollToBottom();
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
        if (message.sender === this.currentUserId) {
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
      sender: this.currentUserId,
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
      this.getPrivateChatDetails().then(memberId => {
        if (memberId) {
          this.router.navigate(['/user-info', memberId]).then(() => console.log('Navigated to user info'));
        } else {
          console.error('Member ID is undefined');
        }
      }).catch(error => {
        console.error('Error navigating to user info:', error);
      });
    } else {
      this.router.navigate(['/chat-details', this.chatId]).then(() => console.log('Navigated to chat details'));
    }
  }

  async getPrivateChatDetails(): Promise<string> {
    try {
      const data = await this.chatService.getChatDetails(this.chatId).toPromise();
      const memberId = data.members.find((m: any) => m !== this.currentUserId);
      console.log('Private chat details:', memberId);
      return memberId;
    } catch (error) {
      console.error('Failed to get private chat details:', error);
      throw error;
    }
  }

  logout(): void {
    this.authService.logout();
  }
}
