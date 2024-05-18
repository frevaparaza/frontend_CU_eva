import {Component, OnInit} from '@angular/core';
import {UserService} from "../../services/user/user.service";
import {ActivatedRoute, Router} from "@angular/router";
import {UserDTO} from "../../dto/UserDTO";
import {NgClass, NgIf} from "@angular/common";
import {UserPreviewsComponent} from "../chat-previews/user-previews.component";
import {Location} from "@angular/common";
import {SharedService} from "../../services/shared.service";

@Component({
  selector: 'app-user-info',
  standalone: true,
  imports: [
    NgIf,
    UserPreviewsComponent,
    NgClass
  ],
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css'],
})
export class UserInfoComponent implements OnInit{
  user: UserDTO = {} as UserDTO;
  userId: string = '';

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.userId = params['userId'];
      if (this.userId) {
        this.loadUserInfo(this.userId);
      }
    });
  }

  loadUserInfo(userId: string): void {
    this.userService.getUser(userId).subscribe({
      next: (data) => {
        this.user = data;
      },
      error: (error) => {
        console.error('Failed to load user info:', error);
      }
    });
  }

  goBack(): void {
    this.location.back();
  }

  openChat(chat: { chatId: string; chatName: string; chatType: string }): void {
    console.log('Opening chat:', chat);
    this.sharedService.setData(chat);
    this.router.navigate(['/chat', chat.chatId]).then(() => console.log('Chat opened with:', chat));
  }

  getMemberImage(fotoPerfil: string) {
    return fotoPerfil || 'assets/profile-placeholder.jpeg';
  }
}
