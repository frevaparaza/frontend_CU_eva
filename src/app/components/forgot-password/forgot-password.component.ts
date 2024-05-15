import {AuthService} from "../../services/auth/auth.service";
import {FormsModule} from "@angular/forms";
import {Component} from "@angular/core";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    FormsModule,
    NgIf
  ],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  email: string = '';
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService) {}

  submitEmail(): void {
    this.authService.forgotPassword(this.email).subscribe({
      next: response => {
        this.successMessage = response;
        this.errorMessage = '';
      },
      error: error => {
        console.error('Error sending reset link', error);
        this.errorMessage = error.error ? error.error : 'Failed to send reset link. Please try again.';
        this.successMessage = '';
      }
    });
  }
}
