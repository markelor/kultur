import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../services/auth.service';
import { ApplicationService } from '../../../../services/application.service';
import { TranslateService } from '@ngx-translate/core';
import { LocalizeRouterService } from 'localize-router';
import { AuthGuard} from '../../../guards/auth.guard';
import { Router,ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-application',
  templateUrl: './edit-application.component.html',
  styleUrls: ['./edit-application.component.css']
})
export class EditApplicationComponent implements OnInit {
  public application;
  constructor(
  	private applicationService:ApplicationService,
  	private authService:AuthService,
    private localizeService:LocalizeRouterService,
    private translate:TranslateService,
    private router:Router,
    private activatedRoute: ActivatedRoute,
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
    // Get application events
    this.applicationService.getApplicationEvents(this.activatedRoute.snapshot.params['id'],this.localizeService.parser.currentLang).subscribe(data => {
      if(data.success){
      	this.application=data.application;
      	console.log(this.application);
        setTimeout(() => {
          $(".nav-"+this.localizeService.parser.currentLang).addClass('active');
          $( ".nav-"+this.localizeService.parser.currentLang).click ();
        }, 0);  
      }
    }); 
  }
}
