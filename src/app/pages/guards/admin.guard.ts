import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LocalizeRouterService } from 'localize-router';

@Injectable()
export class AdminGuard implements CanActivate {

  public redirectUrl;

  constructor(
    private authService: AuthService,
    private router: Router,
    private localizeService: LocalizeRouterService

  ) { }

  // Function to check if admin is authorized to view route
  public canActivate(
    router: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {
    this.authService.loadToken();
    // Get permission
    return this.authService.getPermission(this.localizeService.parser.currentLang).map(data => {
      // Check if response was a success or error
      if (data.success && data.permission==='admin') {
        return true         
      }else{
        this.authService.logout();
      	this.redirectUrl = state.url; // Grab previous urul
      	this.router.navigate([this.localizeService.translateRoute('/sign-in-route')]); // Return error and route to login page
      	return false; // Return false: admin not authorized to view page
                          
      }
             
    });
  }
}


