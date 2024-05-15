import { Component } from '@angular/core';
import {FormsModule} from "@angular/forms";
import {AuthService} from "../../services/auth/auth.service";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [
    FormsModule,
    NgIf
  ],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent {
  token: string = '';
  newPassword: string = '';
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService) {}

  changePassword(): void {
    this.authService.changePassword(this.token, this.newPassword).subscribe({
      next: response => {
        this.successMessage = 'Password changed successfully!';
        this.errorMessage = '';
      },
      error: error => {
        console.error('Error changing password', error);
        this.errorMessage = error.error ? error.error : 'Failed to change password. Please try again.';
        this.successMessage = '';
      }
    });
  }
}
