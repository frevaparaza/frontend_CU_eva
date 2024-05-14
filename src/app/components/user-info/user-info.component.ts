import { Component } from '@angular/core';
import {UserService} from "../../services/user/user.service";
import {ActivatedRoute} from "@angular/router";
import {UserDTO} from "../../dto/UserDTO";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-user-info',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './user-info.component.html',
  styleUrl: './user-info.component.css'
})
export class UserInfoComponent {
  user: UserDTO = {} as UserDTO;
  userId: string = '';

  constructor(
    private userService: UserService,
    private route: ActivatedRoute
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
}
