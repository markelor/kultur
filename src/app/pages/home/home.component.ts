import { Component, OnInit } from '@angular/core';
import { EventService } from '../../services/event.service';
import { TranslateService,LangChangeEvent } from '@ngx-translate/core';
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
  private subscriptionLanguage: Subscription;
  public events;
  private page :number = 1;
  constructor(
    private meta: Meta,
    private metaTitle: Title,
  	private eventService:EventService,
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
    this.eventService.getEvents(this.localizeService.parser.currentLang).subscribe(data => {
      if(data.success){
        this.events = data.events; // Assign array to use in HTML
      }
    });
  }
  ngOnInit() {
    moment.locale(this.localizeService.parser.currentLang);
  	this.getEvents();
    this.subscriptionLanguage =this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.localizeService.parser.currentLang=event.lang;
      this.getEvents(); 
    });
  }
  ngOnDestroy(){
      this.subscriptionLanguage.unsubscribe();
  } 

}

