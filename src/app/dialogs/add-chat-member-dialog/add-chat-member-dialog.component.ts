import {Component, Inject, OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {RouterOutlet} from "@angular/router";
import { UserDTO } from "../../dto/UserDTO";
import {Subject} from "rxjs";
import {UserService} from "../../services/user/user.service";
import { ChatService } from "../../services/chat/chat.service";
import {debounceTime, distinctUntilChanged} from "rxjs/operators";

@Component({
  selector: 'app-add-chat-member-dialog',
  standalone: true,
  imports: [
    FormsModule,
    MatDialogModule,
    NgForOf,
    RouterOutlet,
    NgIf,
    NgOptimizedImage
  ],
  templateUrl: './add-chat-member-dialog.component.html',
  styleUrls: ['./add-chat-member-dialog.component.css']
})
export class AddChatMemberDialogComponent implements OnInit {
  searchedUsers: UserDTO[] = [];
  selectedUser: UserDTO | undefined;
  newMemberId: string = '';
  chatId: string = '';
  searchInput$: Subject<string> = new Subject<string>();

  constructor(
    private userService: UserService,
    private chatService: ChatService,
    public dialogRef: MatDialogRef<AddChatMemberDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any )
    {
    if (data && data.chatId) {
    this.chatId = data.chatId;
    }
  }

  ngOnInit() {
    this.searchInput$.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(query => {
      if (query) {
        this.userService.searchUsers(query).subscribe({
          next: (users) => {
            this.searchedUsers = users;
            console.log("Searched users:", users);
          },
          error: (error) => {
            console.error('Error searching users:', error);
          }
        });
      }
    });
  }

  addNewUserToChat(): void {
    if (!this.chatId || !this.newMemberId) {
      console.error('ChatId or memberId is missing')
      return;
    }
      this.chatService.addChatMember(this.chatId, this.newMemberId).subscribe({
        next: () => {
          console.log('User added to chat');
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error('Error adding user to chat:', error);
          alert('Failed to add user to chat');
        }
      });
  }

  selectNewUser(user: UserDTO, event: any): void {
    event.stopPropagation();
    this.newMemberId = user.id;
    this.selectedUser = user;
  }

  removeUser(user: UserDTO): void {
    this.searchedUsers = this.searchedUsers.filter(u => u.id !== user.id);
  }

  clearSearchInput(): void {
    this.searchInput$.next('');
    this.searchedUsers = [];
    this.selectedUser = undefined;
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
