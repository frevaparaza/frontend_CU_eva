import {Component, OnInit} from '@angular/core';
import {Route, Router, RouterOutlet} from '@angular/router';
import {HttpClientModule} from "@angular/common/http";
import {AppRoutingModule} from "./app.routes";
import {AuthService} from "./services/auth/auth.service";
import {NgIf} from "@angular/common";
import {UserPreviewsComponent} from "./components/chat-previews/user-previews.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HttpClientModule,
    NgIf,
    UserPreviewsComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'ChatUp_frontend';

  isAuthenticated: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router) {}

  ngOnInit() {
    this.router.navigate(['/logout']);
    this.authService.isLoggedIn().subscribe(authStatus => {
      this.isAuthenticated = authStatus;
    });
  }

  onChatSelected(event: { chatId: string, chatName: string, chatType: string }) {
    this.router.navigate(['/chat', event.chatId]);
  }
}
