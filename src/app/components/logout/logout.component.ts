import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.css'
})
export class LogoutComponent implements OnInit{

  constructor(private router: Router) {}

  ngOnInit(): void {
    localStorage.clear();
    this.router.navigate(['/landing']).then(() => console.log('Navigated to Landing'));
  }
}

