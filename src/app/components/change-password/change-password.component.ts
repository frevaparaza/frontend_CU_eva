import {Component, OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {AuthService} from "../../services/auth/auth.service";
import {NgIf} from "@angular/common";
import {ActivatedRoute, RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    RouterOutlet
  ],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent implements OnInit {
  token: string = '';
  newPassword: string = '';
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'] || '';
    });
  }

  changePassword(): void {
    if (this.token && this.newPassword) {
      this.authService.changePassword(this.token, this.newPassword).subscribe({
        next: () => {
          this.successMessage = 'Password changed successfully!';
          this.errorMessage = '';
        },
        error: error => {
          console.error('Error changing password', error);
          this.errorMessage = error.error ? error.error : 'Failed to change password. Please try again.';
          this.successMessage = '';
        }
      });
    } else {
      this.errorMessage = 'Token and new password are required.';
    }
  }
}
