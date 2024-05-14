import { Component } from '@angular/core';
import {FormsModule} from "@angular/forms";
import {AuthService} from "../../services/auth/auth.service";
import {Router, RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    RouterOutlet
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {
    this.email = localStorage.getItem('email') || '';
  }

  login(): void {
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.jwt);
        if (response.userId) {
          localStorage.setItem('userId', response.userId);
        }
        localStorage.setItem('email', this.email);
        this.router.navigate(['/chat']).then(r => console.log('Navigated to Chat'));
      },
      error: (error) => {
        console.error('Login error:', error);
      }
    });
  }

  goToForgotPassword(): void {
    console.log('Navigating to forgot password');
    this.router.navigate(['/forgot-password']).then(
      success => console.log('Navigation to forgot password successful', success),
      error => console.error('Navigation to forgot password failed', error)
    );
  }
}
