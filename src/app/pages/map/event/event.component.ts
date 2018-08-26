import { Component,OnDestroy,Injectable,PLATFORM_ID, APP_ID, Inject } from '@angular/core';
import { NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import { EventService } from '../../../services/event.service';
import { ObservableService } from '../../../services/observable.service';
import { LocalizeRouterService } from 'localize-router';
import { TranslateService } from '@ngx-translate/core';
import { BindContentPipe } from '../../../shared/pipes/bind-content.pipe';
import { GroupByPipe } from '../../../shared/pipes/group-by.pipe';
import { ActivatedRoute,Router,NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import * as moment from 'moment-timezone';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { Meta,Title } from '@angular/platform-browser';
const I18N_VALUES = {
  'eu': {
    weekdays: ['Al', 'As', 'Az', 'Og', 'Or', 'Lr', 'Ig'],
    months: ['Urt','Ots','Mar','Api','Mai','Eka','Uzt','Abu','Ira','Urr','Aza','Abe'],
  },
  'es': {
    weekdays: ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Dom'],
    months: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
  },
  'en': {
    weekdays: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  }
  // other languages you would support
};

// Define a service holding the language. You probably already have one if your app is i18ned. Or you could also
// use the Angular LOCALE_ID value
// Define custom service providing the months and weekdays translations
@Injectable()
export class CustomDatepickerI18n extends NgbDatepickerI18n {

  constructor(
    private localizeService: LocalizeRouterService) {
    super();
  }

  getWeekdayShortName(weekday: number): string {
    return I18N_VALUES[this.localizeService.parser.currentLang].weekdays[weekday - 1];
  }
  getMonthShortName(month: number): string {
    return I18N_VALUES[this.localizeService.parser.currentLang].months[month - 1];
  }
  getMonthFullName(month: number): string {
    return this.getMonthShortName(month);
  }
}
@Component({
  selector: 'map-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css'],
  providers: [{provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n}] // define custom NgbDatepickerI18n provider
})
export class EventComponent  {	
  public title: string = 'Titulua';
  public categories;
  private startTimestamp;
  private endTimestamp;
  public lat: number = 42.88305555555556;
  public lng: number = -1.9355555555555555;
  public zoom: number = 9;
  public markers: marker[]=[];
  private events;
  private selectedCategory;
  private subscription:Subscription;
  public browser=false;
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private meta: Meta,
    private metaTitle: Title,
    private localizeService:LocalizeRouterService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private eventService:EventService,
    private observableService: ObservableService,
    private translate:TranslateService,
    private bindPipe: BindContentPipe,
    private groupByPipe: GroupByPipe) { 
    this.translate.get('metatag.map-title').subscribe(
      data => {        
      this.metaTitle.setTitle(data);
    });
    this.translate.get('metatag.map-description').subscribe(
      data => {         
      this.meta.addTag({ name: 'description', content: data });
    });
     this.translate.get('metatag.map-keywords').subscribe(
      data => {         
      this.meta.addTag({ name: 'keywords', content: data });
    });
    
  }
  private clickedMarker(label: string, index: number) {
    console.log(`clicked the marker: ${label || index}`)
  }
  private handleSVG(svg: SVGElement, parent: Element | null): SVGElement {
    svg.setAttribute('width', '80');
    svg.setAttribute('height', '80');
    return svg;
  }
  private onSvgInserted(event,m){
    var icon={
      url:"data:image/svg+xml;utf-8,"+this.bindPipe.transform(event,undefined,undefined).changingThisBreaksApplicationSecurity.outerHTML,
      scaledSize: {
        height: 40,
        width: 40
      }
    }
    setTimeout(()=>{ 
      m.icon=icon;
    });   
  }
  private addMarker(data){
    this.lat=Number(data.place.coordinates.lat);
    this.lng=Number(data.place.coordinates.lng);
    //this.map._mapsWrapper.setCenter({lat: this.lat, lng: this.lng}));
    if(data.images.poster.length===0){
      data.images.poster.push({url:'assets/img/defaults/event/default-'+this.localizeService.parser.currentLang+'.png'});      
    }
    this.markers.push({      
      lat: Number(data.place.coordinates.lat),
      lng: Number(data.place.coordinates.lng),
      customInfo: {
        icon: data.categories[0].icons[0].url,
        title:data.title,
        cretedBy:data.createdBy,
        images:data.images.poster[0].url,
        description:data.description
      },
      /*labelOptions: {
        color: '#CC0000',
        fontFamily: '',
        fontSize: '14px',
        fontWeight: 'bold',
        text: data.title
       },*/
      draggable: true
    });
  }
  private getEvents() {
    this.eventService.getEvents(this.localizeService.parser.currentLang).subscribe(data => {
      if(data.success){
        this.events = data.events; // Assign array to use in HTML
        this.markers=[];
        var currentDate=new Date();
        for (var i = 0; i < this.events.length; ++i) { 
          if(new Date(this.events[i].end)>=currentDate){
            this.addMarker(this.events[i]);
          }             
        }
      }
    });
  }
  ngOnInit() {
    this.getEvents();
     if (isPlatformBrowser(this.platformId)) {
      this.browser=true;
    }
    this.subscription=this.observableService.notifyObservable.subscribe(res => {
      if (res.hasOwnProperty('option') && res.option === this.observableService.mapEvent) {
        if(res.count===0 || !res.exists){
          this.markers=[];
        }
        if(res.exists ){
          this.addMarker(res.value);
        }       
      }
    }); 
  }
}
// just an interface for type safety.
interface marker {
  lat: number;
  lng: number;
  icon?:object;
  customInfo:object;
  labelOptions?: object;
  draggable: boolean;
}

