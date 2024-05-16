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
        next: (response: any) => {
          console.log(response);
          if (response === 'User registered successfully') {
            localStorage.setItem('email', this.email);
            this.router.navigate(['/login']).then(() => console.log('Navigated to Login'));
          } else {
            console.error('Unexpected response:', response);
            alert('Registration failed: ' + response);
          }
        },
        error: (error) => {
          console.error('Register error:', error);
          alert('Registration failed: ' + (error.error || 'Unknown error'));
        }
      });
  }
}
