import { Component,OnDestroy,Injectable,PLATFORM_ID, APP_ID, Inject } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder,Validators } from '@angular/forms';
import { NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import { EventService } from '../../../services/event.service';
import { CategoryService } from '../../../services/category.service';
import { LocalizeRouterService } from 'localize-router';
import { TranslateService } from '@ngx-translate/core';
import { BindContentPipe } from '../../../shared/pipes/bind-content.pipe';
import { GroupByPipe } from '../../../shared/pipes/group-by.pipe';
import { ActivatedRoute,Router,NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import * as moment from 'moment-timezone';
import { isPlatformBrowser, CommonModule } from '@angular/common';
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
  public form:FormGroup;
  public category:AbstractControl;
  public title: string = 'Titulua';
  public categories;
  private startTimestamp;
  private endTimestamp;
  public lat: number = 42.88305555555556;
  public lng: number = -1.9355555555555555;
  public zoom: number = 9;
  public markers: marker[]=[];
  public timeStart = {hour: 0, minute: 0};
  public timeEnd = {hour: 0, minute: 0};
  private events;
  public start:AbstractControl;
  public end:AbstractControl;
  public price:AbstractControl;
  private subscription:Subscription;
  private selectedCategory;
   public browser=false;
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private fb: FormBuilder,
    private localizeService:LocalizeRouterService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private eventService:EventService,
    private categoryService:CategoryService,
    private translate:TranslateService,
    private bindPipe: BindContentPipe,
    private groupByPipe: GroupByPipe) { 
    this.createNewFilterForm();
    
  }
  // Function to create new event form
  private createNewFilterForm() {
    this.form = this.fb.group({
      category: ['', Validators.compose([
        Validators.required
      ])],
      start: ['', Validators.compose([
        Validators.required/*,DateValidator.validate*/
      ])],
      end: ['', Validators.compose([
        Validators.required/*,DateValidator.validate*/
      ])],
      price: ['']
    })
    this.category = this.form.controls['category'];
    this.start = this.form.controls['start'];
    this.end = this.form.controls['end'];
    this.price = this.form.controls['price'];
    this.price.setValue(0);
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
    m.icon=icon;
  }
  private addMarker(data){
    this.lat=Number(data.place.coordinates.lat);
    this.lng=Number(data.place.coordinates.lng);
    //this.map._mapsWrapper.setCenter({lat: this.lat, lng: this.lng}));
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
  public onSelectedCategory(value){
    this.selectedCategory=value;
  
  }
  private getEvents() {
    this.eventService.getEvents(this.localizeService.parser.currentLang).subscribe(data => {
      if(data.success){
        this.events = data.events; // Assign array to use in HTML
        this.markers=[];
        for (var i = 0; i < this.events.length; ++i) {    
          this.addMarker(this.events[i]);
        }
      }
    });
  }
  private getCategories(){
    //Get categories
    this.categoryService.getCategories(this.localizeService.parser.currentLang).subscribe(data=>{
      if(data.success){
        this.categories=this.groupByPipe.transform(data.categories,'firstParentId');
      }   
    });
  }
  public onEventSubmit(){
    this.markers=[];
    this.startTimestamp=new Date(this.form.get('start').value.year,this.form.get('start').value.month-1,this.form.get('start').value.day,0,0);
    this.endTimestamp=new Date(this.form.get('end').value.year,this.form.get('end').value.month-1,this.form.get('end').value.day,0,0);
    for (var i = 0; i < this.events.length; ++i) {
      for (var j = 0; j < this.events[i].categories.length; ++j) {
        if(this.events[i].categories[j].title===this.selectedCategory.split(' ')[1] && 
          new Date(this.events[i].start)>=this.startTimestamp &&
          new Date(this.events[i].end)<=this.endTimestamp &&
          this.events[i].price<=this.price.value
          ){
          this.markers.push({      
            lat: Number(this.events[i].place.coordinates.lat),
            lng: Number(this.events[i].place.coordinates.lng),
            customInfo: {
              icon:this.events[i].categories[j].icons[0].url,
              title:this.events[i].title,
              cretedBy:this.events[i].createdBy,
              images:this.events[i].images.poster[0].url,
              description:this.events[i].description
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
      }
    }  
  }
  ngOnInit() {
    this.getEvents();
    this.getCategories();
     if (isPlatformBrowser(this.platformId)) {
      this.browser=true;
    }
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

