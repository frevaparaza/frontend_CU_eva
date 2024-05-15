import { Component } from '@angular/core';
import {ChatService} from "../../services/chat/chat.service";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-chat-details',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    RouterLink
  ],
  templateUrl: './chat-details.component.html',
  styleUrl: './chat-details.component.css'
})
export class ChatDetailsComponent {
  chat: any;
  chatId: string = '';
  members: any[] = [];

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

}
