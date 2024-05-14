import {Component, EventEmitter, Output} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {Router, RouterOutlet} from "@angular/router";
import {ChatService} from "../../services/chat/chat.service";
import {NgForOf, NgIf} from "@angular/common";
import {CreateChatDlgComponent} from "../../dialogs/create-chat-dlg/create-chat-dlg.component";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    FormsModule,
    RouterOutlet,
    NgForOf,
    NgIf,
    MatDialogModule
  ],
  templateUrl: './user-previews.component.html',
  styleUrls: ['./user-previews.component.css']
})
export class UserPreviewsComponent {
  chatPreviews: ChatPreviewDTO[] = [];

  @Output() chatSelected = new EventEmitter<{ chatId: string, chatName: string }>();

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
      this.chatSelected.emit({ chatId: chat.chatId, chatName: chat.chatName });
    } else {
      console.error('Chat not found:', chatId);
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
