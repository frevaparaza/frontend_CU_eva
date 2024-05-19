import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from "@angular/router";
import {Injectable} from "@angular/core";
import {ErrorHandlingService} from "../services/errorHandling/error-handling.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private errorHandlingService: ErrorHandlingService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
      return true;
    } else {
      // Handle the error through the service and navigate
      this.handleAuthenticationError();
      return false;
    }
  }

  private handleAuthenticationError(): void {
    this.errorHandlingService.openErrorDialog('You are not authenticated. Please login to access this page.');
    this.router.navigate(['/login']);
  }
}
