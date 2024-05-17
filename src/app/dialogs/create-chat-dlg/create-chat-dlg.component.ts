import {Component, OnInit} from '@angular/core';
import { MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { FormsModule } from "@angular/forms";
import { NgForOf, NgIf } from "@angular/common";
import { RouterOutlet } from "@angular/router";
import {Subject} from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { UserDTO } from "../../dto/UserDTO";
import { ChatService } from "../../services/chat/chat.service";
import { UserService } from "../../services/user/user.service";

@Component({
  selector: 'app-create-chat-dlg',
  standalone: true,
  imports: [
    FormsModule,
    MatDialogModule,
    NgForOf,
    RouterOutlet,
    NgIf
  ],
  templateUrl: './create-chat-dlg.component.html',
  styleUrls: ['./create-chat-dlg.component.css']
})
export class CreateChatDlgComponent implements OnInit {
  selectedUsers: UserDTO[] = [];
  searchedUsers: UserDTO[] = [];
  chatName: string = "";
  searchInput$: Subject<string> = new Subject<string>();

  constructor(
    public dialogRef: MatDialogRef<CreateChatDlgComponent>,
    private chatService: ChatService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
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

  addUser(user: UserDTO, event: any): void {
    event.stopPropagation();
    if (!this.selectedUsers.includes(user)) {
      console.log("User added:", user);
      this.selectedUsers.push(user);
      console.log("Selected users:", this.selectedUsers);
    }
  }

  removeUser(user: UserDTO): void {
    this.selectedUsers = this.selectedUsers.filter(u => u.id !== user.id);
  }

  clearSearchInput(): void {
    this.searchInput$.next('');
    this.searchedUsers = [];
  }

  createChat(): void {
    const currentUserId = localStorage.getItem('userId');
    if (!currentUserId) {
      console.error("Current user ID is missing.");
      return;
    }

    const members = Array.from(this.selectedUsers).map(u => u.id);
    if (!members.includes(currentUserId)) {
      members.push(currentUserId);
    }

    if (this.selectedUsers.length < 1) {
      console.error("Chat must have at least 1 other member.");
      return;
    }

    const chatType = this.selectedUsers.length === 1 ? 'private' : 'group';
    const chatName = chatType === 'private' ? this.selectedUsers[0].username : this.chatName;
    const creationRequest = {
      chatName: this.chatName || this.selectedUsers.values().next().value.username,
      members: members,
      chatType: chatType
    };

    this.chatService.createChat(creationRequest).subscribe({
      next: (response) => {
        console.log("Chat created successfully:", response);
        this.dialogRef.close(response);
      },
      error: (error) => {
        console.error('Error creating chat:', error);
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
