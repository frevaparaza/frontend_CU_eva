import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ChatService} from "../../services/chat/chat.service";
import {ActivatedRoute, Router, RouterLink, RouterOutlet} from "@angular/router";
import {NgClass, NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {UserPreviewsComponent} from "../chat-previews/user-previews.component";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {AddChatMemberDialogComponent} from "../../dialogs/add-chat-member-dialog/add-chat-member-dialog.component";
import {Location} from "@angular/common";

@Component({
  selector: 'app-chat-details',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    RouterLink,
    UserPreviewsComponent,
    MatDialogModule,
    NgClass,
    RouterOutlet,
    NgOptimizedImage
  ],
  templateUrl: './chat-details.component.html',
  styleUrls: ['./chat-details.component.css']
})
export class ChatDetailsComponent implements OnInit{
  chat: any;
  chatId: string = '';
  members: any[] = [];

  isSidebarVisible: boolean = true;

  @Output() chatSelected = new EventEmitter<{ chatId: string, chatName: string}>();

  constructor(
    private chatService: ChatService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private location: Location
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

  async removeChatMember(memberId: string): Promise<void> {
    if (!this.chatId || !memberId) {
      console.error('ChatId or userId is missing');
      return;
    }
      this.chatService.removeChatMember(this.chatId, memberId).subscribe({
        next: () => {
          console.log('User removed from chat');
          this.loadChatMembers();
        },
        error: (error) => {
          console.error('Error removing user from chat:', error);
        }
      });
  }

  openAddMemberDialog(): void {
    const dialogRef = this.dialog.open(AddChatMemberDialogComponent, {
      height : '400px',
      data: { chatId: this.chatId }
    });
    console.log("Passing chatId to dialog: ", this.chatId);
      dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.loadChatMembers();
      }
    });
  }

  goBack(): void {
    this.location.back();
  }

  openChat(chat: { chatId: string; chatName: string; chatType: string }): void {
    this.router.navigate(['/chat', chat.chatId]).then(() => (console.log('Chat opened')));
  }

  getMemberImage(fotoPerfil: string) {
    return fotoPerfil || 'assets/profile-placeholder.jpeg';
  }

}
