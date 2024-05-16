import {Component, OnInit} from '@angular/core';
import {ChatService} from "../../services/chat/chat.service";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {UserPreviewsComponent} from "../chat-previews/user-previews.component";

@Component({
  selector: 'app-chat-details',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    RouterLink,
    UserPreviewsComponent,
    NgClass
  ],
  templateUrl: './chat-details.component.html',
  styleUrls: ['./chat-details.component.css']
})
export class ChatDetailsComponent implements OnInit{
  chat: any;
  chatId: string = '';
  members: any[] = [];

  isSidebarVisible: boolean = true;

  constructor(
    private chatService: ChatService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.chatId = params['chatId'];
      if (this.chatId) {
        this.loadChatDetails();
        this.loadChatMembers();
      } else {
        console.error('Chat ID is not defined');
      }
    });
  }

  toggleSidebar(): void {
    this.isSidebarVisible = !this.isSidebarVisible;
  }

  loadChatDetails(): void {
    this.chatService.getChatDetails(this.chatId).subscribe({
      next: chat => this.chat = chat,
      error: error => {
        console.error('Error loading chat details:', error);
        alert('Chat not found');
      }
    });
  }

  loadChatMembers(): void {
    this.chatService.getChatMembers(this.chatId).subscribe({
      next: members => this.members = members,
      error: error => {
        console.error('Error loading chat members:', error);
        alert('Failed to load chat members');
      }
    });
  }

  openChat(chat: { chatId: string; chatName: string; chatType: string }): void {
    this.router.navigate(['/chat', chat.chatId]).then(() => (console.log('Chat opened')));
  }
}
