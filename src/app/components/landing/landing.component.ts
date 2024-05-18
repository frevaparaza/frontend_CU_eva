import { Component } from '@angular/core';
import {Router, RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    RouterOutlet
  ],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {
  constructor(private router: Router) {}

  navigate(path: string): void {
    this.router.navigate([path]).then(r => console.log(r));
  }
}
