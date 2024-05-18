import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    NgOptimizedImage
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
