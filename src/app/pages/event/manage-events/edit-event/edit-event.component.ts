import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../services/auth.service';
import { EventService } from '../../../../services/event.service';
import { TranslateService } from '@ngx-translate/core';
import { LocalizeRouterService } from 'localize-router';
import { AuthGuard} from '../../../guards/auth.guard';
import { Router,ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.css']
})
export class EditEventComponent implements OnInit {
  public event;
  private categories;
  constructor(
  	private eventService:EventService,
  	private authService:AuthService,
    private localizeService:LocalizeRouterService,
    private translate:TranslateService,
    private router:Router,
    private activatedRoute: ActivatedRoute,
    private authGuard:AuthGuard
  ) { }
  private getEvent(){
     // Get event
    this.eventService.getEvent(this.activatedRoute.snapshot.params['id'],this.localizeService.parser.currentLang).subscribe(data => {
      if(data.success){
        this.event=data.event;
        this.categories=data.categories;
        setTimeout(() => {
          $(".nav-"+this.localizeService.parser.currentLang).addClass('active');
          $( ".nav-"+this.localizeService.parser.currentLang).click ();
        }, 0);  
      }
    }); 
  }
  private refreshEvent($event){
    this.event=undefined;
    this.getEvent();
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
    this.getEvent();
  }
}
