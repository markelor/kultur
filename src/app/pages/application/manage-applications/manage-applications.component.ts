import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { ApplicationService } from '../../../services/application.service';
import { TranslateService,LangChangeEvent } from '@ngx-translate/core';
import { LocalizeRouterService } from 'localize-router';
import { AuthGuard} from '../../guards/auth.guard';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
@Component({
  selector: 'app-manage-applications',
  templateUrl: './manage-applications.component.html',
  styleUrls: ['./manage-applications.component.css']
})
export class ManageApplicationsComponent implements OnInit {
  private subscriptionLanguage: Subscription;
  public applications;
  constructor(
  	private applicationService:ApplicationService,
  	private authService:AuthService,
    private localizeService:LocalizeRouterService,
    private translate:TranslateService,
    private router:Router,
    private authGuard:AuthGuard
    ) { }

  // Function to get all user applications from the database
  private getUserApplications() {
    this.applicationService.getUserApplications(this.authService.user.username,this.localizeService.parser.currentLang).subscribe(data => {
      if(data.success){
        this.applications = data.applications; // Assign array to use in HTML
      }
    });
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
  	this.getUserApplications();
    this.subscriptionLanguage =this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.localizeService.parser.currentLang=event.lang;
      this.getUserApplications();
    });
  }
  ngOnDestroy(){
      this.subscriptionLanguage.unsubscribe();
  } 

}
