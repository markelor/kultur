import { Component, OnInit } from '@angular/core';
import { EventService } from '../../services/event.service';
import { ObservableService } from '../../services/observable.service';
import { TranslateService} from '@ngx-translate/core';
import { LocalizeRouterService } from 'localize-router';
import { AuthGuard} from '../guards/auth.guard';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import * as moment from 'moment-timezone';
import { Meta,Title } from '@angular/platform-browser';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public events;
  private page :number = 1;
  private range=5;
  public maxSize=4;
  public minSize=0;
  public collectionSize;
  private subscription:Subscription;
  public showFilter;
  constructor(
    private meta: Meta,
    private metaTitle: Title,
  	private eventService:EventService,
    private observableService:ObservableService,
    private localizeService:LocalizeRouterService,
    private translate:TranslateService,
    private router:Router,
    private authGuard:AuthGuard
  ) {
    this.translate.get('metatag.home-title').subscribe(
      data => {       
      this.metaTitle.setTitle(data);
    });
    this.translate.get('metatag.home-description').subscribe(
      data => {         
      this.meta.addTag({ name: 'description', content: data });
    });
    this.translate.get('metatag.home-keywords').subscribe(
      data => {         
      this.meta.addTag({ name: 'keywords', content: data });
    });
  }
  // Function to get all user events from the database
  private getEvents() {
    this.observableService.eventsEvent="event-events";
    this.subscription=this.observableService.notifyObservable.subscribe(res => {
      if (res.hasOwnProperty('option') && res.option === "see-events") {
        this.events=res.value;
        this.collectionSize= Math.ceil(this.events.length/this.range);         
      }
    }); 
  }
  public onPageChange(event){
    this.minSize=(event*this.range)-this.range;
    this.maxSize=(event*this.range)-1;
  }
  ngOnInit() {
    moment.locale(this.localizeService.parser.currentLang);
  	this.getEvents();
  }
  ngOnDestroy(){
    this.subscription.unsubscribe();
  } 
}

