import {Component, OnInit} from '@angular/core';
import {UserService} from "../../services/user/user.service";
import {ActivatedRoute, Router} from "@angular/router";
import {UserDTO} from "../../dto/UserDTO";
import {NgClass, NgIf} from "@angular/common";
import {UserPreviewsComponent} from "../chat-previews/user-previews.component";
import {Location} from "@angular/common";
import {SharedService} from "../../services/shared.service";
import {ErrorHandlingService} from "../../services/errorHandling/error-handling.service";
import {UserConfigService} from "../../services/userConfig/user-config.service";

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
    private sharedService: SharedService,
    private errorService: ErrorHandlingService,
    private userConfigService: UserConfigService
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
        this.loadUserProfileImage(this.userId);
      },
      error: (error) => {
        console.error('Failed to load user info:', error);
        this.errorService.openErrorDialog(error);
      }
    });
  }

  loadUserProfileImage(userId: string): void {
    this.userConfigService.getImage(userId).subscribe({
      next: (imageBlob) => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.user.fotoPerfil = e.target.result;
        };
        reader.readAsDataURL(imageBlob);
      },
      error: (error) => {
        console.error('Error loading user profile image:', error);
        this.user.fotoPerfil = 'assets/icons/user.png';
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
    return fotoPerfil || 'assets/icons/user.png';
  }
}
