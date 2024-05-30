import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { UserConfigService } from '../../services/userConfig/user-config.service';
import { AuthService } from '../../services/auth/auth.service';
import { UserService } from '../../services/user/user.service';
import { UserDTO } from '../../dto/UserDTO';
import { CommonModule } from '@angular/common';
import { UserPreviewsComponent } from "../chat-previews/user-previews.component";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, UserPreviewsComponent]
})
export class SettingsComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;
  profileForm: FormGroup;
  userId: string;
  profileImage: File | null = null;
  profileImageUrl: string | null = null;
  user: UserDTO = {} as UserDTO;

  constructor(
    private fb: FormBuilder,
    private userConfigService: UserConfigService,
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {
    this.userId = localStorage.getItem('userId') || '';
    this.profileForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadUserInfo();
  }

  loadUserInfo(): void {
    if (this.userId) {
      this.userService.getUser(this.userId).subscribe({
        next: (data) => {
          this.user = data;
          this.profileForm.patchValue({
            username: this.user.username,
            email: this.user.email
          });
          if (this.user.fotoPerfil) {
            this.loadProfileImage(this.userId); // Ensure this uses userId
          } else {
            this.profileImageUrl = 'assets/icons/user.png';
          }
        },
        error: (error) => {
          console.error('Failed to load user info:', error);
        }
      });
    }
  }

  loadProfileImage(userId: string): void {
    console.log('Loading profile image with user ID:', userId);
    this.userConfigService.getImage(userId).subscribe({
      next: (imageBlob) => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.profileImageUrl = e.target.result;
          console.log('Profile image loaded successfully');
        };
        reader.readAsDataURL(imageBlob);
      },
      error: (error) => {
        if (error.status === 404) {
          console.error('Profile image not found:', error);
          this.profileImageUrl = 'assets/icons/user.png';
        } else {
          console.error('Failed to load profile image:', error);
        }
      }
    });
  }

  onFileChange(event: any): void {
    if (event.target.files.length > 0) {
      this.profileImage = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => this.profileImageUrl = e.target.result;
      reader.readAsDataURL(this.profileImage as Blob);
    }
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  saveProfile(): void {
    if (this.profileForm.valid && this.userId) {
      const updateUserDTO = this.profileForm.value;
      this.userConfigService.updateUser(this.userId, updateUserDTO).subscribe({
        next: () => {
          if (this.profileImage) {
            this.uploadImage();
          } else {
            console.log('No image to upload');
          }
          console.log('Profile updated successfully');
        },
        error: (err) => {
          console.error('Failed to update profile', err);
        }
      });
    }
  }

  uploadImage(): void {
    if (this.profileImage && this.userId) {
      console.log('Uploading image:', this.profileImage);
      this.userConfigService.uploadImage(this.userId, this.profileImage).subscribe({
        next: (response: any) => {
          console.log('Profile image uploaded successfully');
          this.loadProfileImage(this.userId); // Ensure this uses userId
        },
        error: (err) => {
          console.error('Failed to upload profile image', err);
          console.error('Error details:', err.error);
        }
      });
    }
  }

  deleteUser(): void {
    if (confirm('Are you sure you want to delete your account?')) {
      this.userConfigService.deleteUser(this.userId).subscribe({
        next: () => {
          console.log('User deleted successfully');
          this.logout();
        },
        error: (err) => {
          console.error('Failed to delete user', err);
        }
      });
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  goBack(): void {
    this.router.navigate(['/chat']);
  }

  openChat(chat: { chatId: string; chatName: string; chatType: string }): void {
    console.log('Opening chat:', chat);
    this.router.navigate(['/chat', chat.chatId]).then(() => console.log('Chat opened with:', chat));
  }
}
