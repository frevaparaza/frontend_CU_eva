import {Component, EventEmitter, Output} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {Router, RouterOutlet} from "@angular/router";
import {ChatService} from "../../services/chat/chat.service";
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {CreateChatDlgComponent} from "../../dialogs/create-chat-dlg/create-chat-dlg.component";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {timestamp} from "rxjs";
import firebase from "firebase/compat";
import Timestamp = firebase.firestore.Timestamp;

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    FormsModule,
    RouterOutlet,
    NgForOf,
    NgIf,
    MatDialogModule,
    DatePipe
  ],
  templateUrl: './user-previews.component.html',
  styleUrls: ['./user-previews.component.css']
})
export class UserPreviewsComponent {
  chatPreviews: ChatPreviewDTO[] = [];

  @Output() chatSelected = new EventEmitter<{ chatId: string, chatName: string, chatType: string }>();

  constructor(private chatService: ChatService, private router: Router, private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.loadChatPreviews();
  }

  loadChatPreviews(): void {
    const userId = localStorage.getItem('userId')
    if (userId)
    {
      this.chatService.getChatsPreview(userId).subscribe({
        next: (response) => {
          this.chatPreviews = response;
        },
        error: (error) => {
          console.error('Error loading chat previews:', error);
        }
      });
    } else {
      console.error('User id not found in local storage');
    }
  }

  openCreateChatDialog(): void {
    const dialogRef = this.dialog.open(CreateChatDlgComponent);
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.loadChatPreviews();
      }
    });
  }

  openChat(chatId: string, chatName: string): void {
    const chat = this.chatPreviews.find(chat => chat.chatId === chatId);
    if (chat) {
      this.chatSelected.emit({ chatId: chat.chatId, chatName: chat.chatName, chatType: chat.chatType });
      console.log('Chat selected:', chat.chatId, chat.chatName, chat.chatType)
    } else {
      console.error('Chat not found:', chatId);
    }
  }

  deleteChat(chatId: string): void {
    if (confirm('Are you sure you want to delete this chat?')) {
      this.chatService.deleteChat(chatId).subscribe({
        next: () => {
          this.chatPreviews = this.chatPreviews.filter(chat => chat.chatId !== chatId);
          console.log('Chat deleted successfully.');
        },
        error: (error) => {
          console.error('Error deleting chat:', error);
          alert('Failed to delete chat: ' + error.message);
        }
      });
    }
  }
}

export interface ChatPreviewDTO {
  chatId: string;
  chatName: string;
  chatType: string;
  lastMessage: Mensaje;
}

export interface Mensaje {
  content: string;
  sender: string;
  timestamp?: Date;
}

export interface ChatCreationRequest {
  chatName: string;
  members: Set<string>;
  chatType: string;
}
