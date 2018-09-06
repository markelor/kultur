import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../services/auth.service';
import { ObservationService } from '../../../../services/observation.service';
import { TranslateService } from '@ngx-translate/core';
import { LocalizeRouterService } from 'localize-router';
import { AuthGuard} from '../../../guards/auth.guard';
import { Router,ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-observation',
  templateUrl: './edit-observation.component.html',
  styleUrls: ['./edit-observation.component.css']
})
export class EditObservationComponent implements OnInit {
  public observation;
  constructor(
  	private observationService:ObservationService,
  	private authService:AuthService,
    private localizeService:LocalizeRouterService,
    private translate:TranslateService,
    private router:Router,
    private activatedRoute: ActivatedRoute,
    private authGuard:AuthGuard
  ) { }
  private getObservation(active){
    // Get observation
    this.observationService.getObservation(this.activatedRoute.snapshot.params['id'],this.authService.user.id,this.localizeService.parser.currentLang).subscribe(data => {
      if(data.success){
        this.observation=data.observation;
         if(active){
          setTimeout(() => {
            $(".nav-"+this.localizeService.parser.currentLang).addClass('active');
            $( ".nav-"+this.localizeService.parser.currentLang).click ();
          }, 0);  
         }
      }
    }); 
  }
  private refreshObservation($event){
    this.observation=undefined;
    this.getObservation(false);
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
    this.getObservation(true);
  }
}
