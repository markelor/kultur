import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { LocalizeRouterService } from 'localize-router';
import { AuthGuard} from '../../guards/auth.guard';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.css']
})
export class CreateEventComponent implements OnInit {
  constructor(
    private authService:AuthService,
    public localizeService:LocalizeRouterService,
    private translate:TranslateService,
    private router:Router,
    private authGuard:AuthGuard) { }


  ngOnInit() {
    // Get authentication on page load
    this.authService.getAuthentication(this.localizeService.parser.currentLang).subscribe(authentication => {
      if(!authentication.success){
        this.authService.logout();
        this.authGuard.redirectUrl=this.router.url;
        this.router.navigate([this.localizeService.translateRoute('/sign-in-route')]); // Return error and route to login page
      }
    });
  }
}



