import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LocalizeRouterService } from 'localize-router';

@Injectable()
export class AuthGuard implements CanActivate {

  public redirectUrl;

  constructor(
    private authSrvice: AuthService,
    private router: Router,
    private localize: LocalizeRouterService
  ) { }

  // Function to check if user is authorized to view route
  public canActivate(
    router: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {
    // Check if user is logged in
    if (this.authSrvice.loggedIn()) {
      return true; // Return true: User is allowed to view route
    } else {
      this.authSrvice.logout();
      this.redirectUrl = state.url; // Grab previous urul
      this.router.navigate([this.localize.translateRoute('/sign-in-route')]); // Return error and route to login page
      return false; // Return false: user not authorized to view page
    }
  }
}

