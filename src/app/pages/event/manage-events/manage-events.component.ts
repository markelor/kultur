import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { EventService } from '../../../services/event.service';
import { ObservableService } from '../../../services/observable.service';
import { TranslateService } from '@ngx-translate/core';
import { LocalizeRouterService } from 'localize-router';
import { AuthGuard} from '../../guards/auth.guard';
import { Router } from '@angular/router';
import * as moment from 'moment-timezone';
@Component({
  selector: 'app-manage-events',
  templateUrl: './manage-events.component.html',
  styleUrls: ['./manage-events.component.css']
})
export class ManageEventsComponent implements OnInit {
  public events;
  private page :number = 1;
  private range=5;
  public maxSize=4;
  public minSize=0;
  public collectionSize;
  private subscription:Subscription;
  constructor(
  	private eventService:EventService,
    private observableService:ObservableService,
  	private authService:AuthService,
    private localizeService:LocalizeRouterService,
    private translate:TranslateService,
    private router:Router,
    private authGuard:AuthGuard
  ) {
  }
  // Function to get all user events from the database
  private getAllUserEvents() {
    this.observableService.eventsEvent="event-events";
    this.subscription=this.observableService.notifyObservable.subscribe(res => {
      if (res.hasOwnProperty('option') && res.option === "edit-events") {
        this.events=res.value;
        this.collectionSize= Math.ceil(this.events.length/this.range);         
      }
    });
    /*this.eventService.getUserEvents(this.authService.user.id,this.localizeService.parser.currentLang).subscribe(data => {
      if(data.success){
        this.events = data.events; // Assign array to use in HTML
        this.collectionSize= Math.ceil(this.events.length/this.range);
      }
    });*/
  }
  private getDatePoster(datetime){
    var date=new Date(datetime);
    var monthName=moment(date).tz("Europe/Madrid").format('MMM');
    var dayName=moment(date).tz("Europe/Madrid").format('dddd');
    var result=
      {
        "month":monthName[0].toUpperCase() + monthName.substring(1),
        "day":dayName[0].toUpperCase() + dayName.substring(1),
        "dayNumber":moment(date).tz("Europe/Madrid").format('DD'),
        "hour":moment(date).tz("Europe/Madrid").format('HH:mm'),
      };
    return result;
  }
  public onPageChange(event){
    this.minSize=(event*this.range)-this.range;
    this.maxSize=(event*this.range)-1;
  }
  ngOnInit() {
  	// Get authentication on page load
    moment.locale(this.localizeService.parser.currentLang);
    this.authService.getAuthentication(this.localizeService.parser.currentLang).subscribe(authentication => {
      if(!authentication.success){
        this.authService.logout();
        this.authGuard.redirectUrl=this.router.url;
        this.router.navigate([this.localizeService.translateRoute('/sign-in-route')]); // Return error and route to login page
      }
    });  
  	this.getAllUserEvents();
  }
}
