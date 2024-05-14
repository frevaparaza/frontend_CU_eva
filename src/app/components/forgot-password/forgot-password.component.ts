import {AuthService} from "../../services/auth/auth.service";
import {FormsModule} from "@angular/forms";
import {Component} from "@angular/core";

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  email: string = '';

  constructor(private authService: AuthService) {}

  submitEmail(): void {
    this.authService.forgotPassword(this.email).subscribe({
      next: response => alert('Password reset link sent! Check your email.'),
      error: error => console.error('Error sending reset link', error)
    });
  }
}
