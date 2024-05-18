import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from "./components/login/login.component";
import {ChatComponent} from "./components/chat/chat.component";
import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {AngularFireMessagingModule} from "@angular/fire/compat/messaging";
import {AngularFireModule} from "@angular/fire/compat";
import {firebaseConfig} from "../environments/firebase-config";
import {RegisterComponent} from "./components/register/register.component";
import {LandingComponent} from "./components/landing/landing.component";
import {ForgotPasswordComponent} from "./components/forgot-password/forgot-password.component";
import {ChangePasswordComponent} from "./components/change-password/change-password.component";
import {UserInfoComponent} from "./components/user-info/user-info.component";
import {ChatDetailsComponent} from "./components/chat-details/chat-details.component";
import {LogoutComponent} from "./components/logout/logout.component";

export const routes: Routes = [
  { path: 'landing', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'change-password', component: ChangePasswordComponent },
  { path: 'chat', component: ChatComponent },
  { path: 'chat/:chatId', component: ChatComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'chat-details/:chatId', component: ChatDetailsComponent },
  { path: 'user-info/:userId', component: UserInfoComponent },
  { path: 'logout', component: LogoutComponent },
  { path: '', redirectTo: '/landing', pathMatch: 'full' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireMessagingModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
