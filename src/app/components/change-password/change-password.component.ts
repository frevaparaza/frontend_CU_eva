import { Component } from '@angular/core';
import {FormsModule} from "@angular/forms";
import {AuthService} from "../../services/auth/auth.service";

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent {
  token: string = '';
  newPassword: string = '';

  constructor(private authService: AuthService) {}

  changePassword(): void {
    this.authService.changePassword(this.token, this.newPassword).subscribe({
      next: response => alert('Password changed successfully!'),
      error: error => console.error('Error changing password', error)
    });
  }
}
