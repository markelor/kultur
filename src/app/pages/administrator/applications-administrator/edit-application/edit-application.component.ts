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
  public moderators;
  public contributors;
  constructor(
  	private applicationService:ApplicationService,
  	private authService:AuthService,
    private localizeService:LocalizeRouterService,
    private translate:TranslateService,
    private router:Router,
    private activatedRoute: ActivatedRoute,
    private authGuard:AuthGuard) { }

  private getApplication(active){
    // Get application events
    this.applicationService.getApplicationEvents(this.activatedRoute.snapshot.params['id'],this.authService.user.id,this.localizeService.parser.currentLang).subscribe(data => {
      if(data.success){
        this.application=data.application;
        this.moderators=data.moderatorsArray;
        this.contributors=data.contributorsArray;
        if(active){
          setTimeout(() => {
            $(".nav-"+this.localizeService.parser.currentLang).addClass('active');
            $( ".nav-"+this.localizeService.parser.currentLang).click ();
          }, 0); 
        }
      }
    });
  }  
  private refreshApplication($event){
    this.application=undefined;
    this.moderators=undefined;
    this.contributors=undefined;
    this.getApplication(false);
  }
  ngOnInit() {
  	// Get authentication on page load
    this.authService.getAuthentication(this.localizeService.parser.currentLang).subscribe(authentication => {
      if(!authentication.success){
        this.authService.logout();
        this.authGuard.redirectUrl=this.router.url;
        this.router.navigate([this.localizeService.translateRoute('/sign-in-route')]); // Return error and route to login page
      }
    }); 
    this.getApplication(true);
  }
}
