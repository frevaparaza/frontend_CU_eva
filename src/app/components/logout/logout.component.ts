import { Component } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.css'
})
export class LogoutComponent {

  constructor(private router: Router) {}

  ngOnInit(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}

