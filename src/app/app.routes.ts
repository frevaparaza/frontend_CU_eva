import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from "./components/login/login.component";
import {ChatComponent} from "./components/chat/chat.component";
import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {RegisterComponent} from "./components/register/register.component";
import {LandingComponent} from "./components/landing/landing.component";
import {ForgotPasswordComponent} from "./components/forgot-password/forgot-password.component";
import {ChangePasswordComponent} from "./components/change-password/change-password.component";
import {UserInfoComponent} from "./components/user-info/user-info.component";
import {ChatDetailsComponent} from "./components/chat-details/chat-details.component";
import {LogoutComponent} from "./components/logout/logout.component";
import {AuthGuard} from "./guard/authGuard";
import {SettingsComponent} from "./components/settings/settings.component";

export const routes: Routes = [
  { path: 'landing', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'change-password', component: ChangePasswordComponent },
  { path: 'chat', component: ChatComponent, canActivate: [AuthGuard]},
  { path: 'chat/:chatId', component: ChatComponent, canActivate: [AuthGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [AuthGuard] },
  { path: 'chat-details/:chatId', component: ChatDetailsComponent, canActivate: [AuthGuard] },
  { path: 'user-info/:userId', component: UserInfoComponent, canActivate: [AuthGuard]},
  { path: 'settings', component: SettingsComponent , canActivate: [AuthGuard] },
  { path: 'logout', component: LogoutComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/landing', pathMatch: 'full' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
