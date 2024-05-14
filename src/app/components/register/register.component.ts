import { Component } from '@angular/core';
import {Router, RouterOutlet} from "@angular/router";
import {AuthService} from "../../services/auth/auth.service";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    RouterOutlet
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username: string = "";
  email: string = "";
  password: string = "";

  constructor(private authService: AuthService, private router: Router) {
    this.email = localStorage.getItem('email') || '';
  }

  register(): void {
    this.authService.register(this.username, this.email, this.password)
      .subscribe({
        next: (response) => {
          if (response.userId) {
            localStorage.setItem('userId', response.userId);
          }
          localStorage.setItem('email', this.email);
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Register error:', error);
        }
      })
  }
}
