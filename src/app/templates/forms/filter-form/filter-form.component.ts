import { Component, OnInit, ViewChild, Input,Injectable} from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder,Validators, FormArray } from '@angular/forms';
import { LocalizeRouterService } from 'localize-router';
import { AuthService } from '../../../services/auth.service';
import { CategoryService } from '../../../services/category.service';
import { EventService } from '../../../services/event.service';
import { PlaceService } from '../../../services/place.service';
import { ObservableService } from '../../../services/observable.service';
import { TranslateService,LangChangeEvent } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { Category } from '../../../class/category';
import { Subscription } from 'rxjs/Subscription';
import { AuthGuard} from '../../../pages/guards/auth.guard';
import { GroupByPipe } from '../../../shared/pipes/group-by.pipe';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap/datepicker/ngb-date'
import { NgbDatepickerI18n, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs/Subject';
const URL = 'http://localhost:8080/fileUploader/uploadImages/category-icon';
//const URL = 'fileUploader/uploadImages/category-icon';
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
  selector: 'app-filter-form',
  templateUrl: './filter-form.component.html',
  styleUrls: ['./filter-form.component.css'],
   providers: [{provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n}] // define custom NgbDatepickerI18n provider
})


export class FilterFormComponent  {  
  @Input() inputType:string;
  public form:FormGroup;
  public title:AbstractControl;
  public category:AbstractControl;
  private events;
  private startTimestamp;
  private endTimestamp;
  public timeStart = {hour: 0, minute: 0};
  public timeEnd = {hour: 0, minute: 0};
  public province:AbstractControl;
  public municipality:AbstractControl;
  public start:AbstractControl;
  public end:AbstractControl;
  public price:AbstractControl;
  private subscriptionLanguage: Subscription;
  public provincesEvent;
  public municipalitiesEvent;
  private categoryId=[];
  private levelCategories=[];
  private categories=[];
  private categoriesTree=[];
  private geonameIdProvince;
  private geonameIdMunicipality;
  private filtersEvent;
  private filtersPlace={};
  public searchTitle = new Subject<string>();
  public searchPrice = new Subject<string>();
  private hoveredDate: NgbDate;

  private fromDate: NgbDate;
  private toDate: NgbDate;
  constructor(
    private fb: FormBuilder,
    private localizeService:LocalizeRouterService,
    private router: Router,
    private authService:AuthService,
    private eventService:EventService,
    private categoryService:CategoryService,
    private placeService:PlaceService,
    private translate:TranslateService,
    private observableService: ObservableService,
    private groupByPipe:GroupByPipe,
    private calendar: NgbCalendar
  ) { 
    this.createNewFilterForm();
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);
    
    
  }
    private createItem(value) {
    return this.fb.group({
      category: [value],
    });
  }
  // Function to create new event form
  private createNewFilterForm() {
    this.form = this.fb.group({
      title: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(30),
        Validators.minLength(5)
      ])],
      categories: this.fb.array([ this.createItem('') ]),
      province: [''],
      municipality: [''],
      start: ['', Validators.compose([
        Validators.required/*,DateValidator.validate*/
      ])],
      end: ['', Validators.compose([
        Validators.required/*,DateValidator.validate*/
      ])],
      price: ['']
    })
    this.title = this.form.controls['title'];
    this.province = this.form.controls['province'];
    this.municipality = this.form.controls['municipality'];
    this.start = this.form.controls['start'];
    this.end = this.form.controls['end'];
    this.price = this.form.controls['price'];
    }
  
     // Function on seleccted categories
  public onSelectedCategory(value,level){
    var index;
    for (var i = 0; i < this.levelCategories[level].value.length; ++i) {
      if(this.levelCategories[level].value[i].language===this.localizeService.parser.currentLang && this.levelCategories[level].value[i].title===value.split(' ')[1]){
        index=i;
      }else{
        for (var j = 0; j < this.levelCategories[level].value[i].translation.length; ++j) {
          if(this.levelCategories[level].value[i].translation[j].language===this.localizeService.parser.currentLang){
            index=j;
          }
        } 
      }
    }
    if (!value){
      // remove
        for (var i = this.form.controls['categories'].value.length - 1; i >= level; i--) {
          this.categoryId.splice(i+1,1);
        } 
        for (var i = this.form.controls['categories'].value.length - 1; i >= level+1; i--) {
          (this.form.controls['categories'] as FormArray).removeAt(i);
        }       
    }else{
      //hide categories
      this.categoryId[level+1] = this.levelCategories[level].value[index]._id;
      var newFormArray=false;
      if(this.levelCategories[level+1]){
         for (var i = 0; i < this.levelCategories[level+1].value.length; ++i) {
          if(this.levelCategories[level+1].value[i].parentId===this.levelCategories[level].value[index]._id){
            newFormArray=true;
          }
        }
      }     
      if((this.form.controls['categories'].value.length-1 <= level) && newFormArray===true){
        (this.form.controls['categories'] as FormArray).push(this.createItem(''));
      }else {
        // remove
        for (var i = this.form.controls['categories'].value.length - 1; i >= level+1; i--) {
          (this.form.controls['categories'] as FormArray).removeAt(i);
          this.categoryId.splice(i+1,1);
        }
        if(newFormArray){
         (this.form.controls['categories'] as FormArray).push(this.createItem('')); 
        }       
      }    
    }
    this.getEvents();
  }   
   // Function on seleccted event Continent
  public onSelectedProvince(index){
    if (index===-1){
      this.form.get('municipality').disable(); // Disable municipality field
      this.filtersPlace={};
      this.getEvents();
    }else{
      this.form.get('municipality').enable(); // Enable municipality field
      this.placeService.getGeonamesJson('municipality',this.localizeService.parser.currentLang,this.provincesEvent[index].toponymName.toLowerCase()).subscribe(municipalitiesEvent => {
        this.geonameIdProvince=this.provincesEvent[index].geonameId;
        this.municipalitiesEvent=municipalitiesEvent.geonames;
        if(this.form.get('province').value){
          this.filtersPlace["province.geonameId"]=this.geonameIdProvince;
        }
        this.getEvents();
      });
    }
    this.form.controls['municipality'].setValue("");
  }
  // Function on seleccted event municipality
  public onSelectedMunicipality(index){
    if(index!==-1){  
      this.geonameIdMunicipality=this.municipalitiesEvent[index].geonameId;
      if(this.form.get('municipality').value){
        this.filtersPlace["municipality.geonameId"]=this.geonameIdMunicipality;
      }
    }
    this.getEvents();
  }
  private getProvinces(){
    //Get provinces on page load
    this.placeService.getGeonamesJson('province',this.localizeService.parser.currentLang,'euskal-herria').subscribe(provincesEvent => {
      this.provincesEvent=provincesEvent.geonames;
    });
  }
  private getCategories(){
    this.categoryId.splice(0, 0, null);
    //Get categories
    this.categoryService.getCategories(this.localizeService.parser.currentLang).subscribe(data=>{
      if(data.success){
        this.categories=data.categories;
        this.levelCategories=this.groupByPipe.transform(data.categories,'level');
      }   
    });
  }
  private findCategory(childId){
    for (var i in this.categories) {
      if (this.categories[i].parentId && !this.categoriesTree.includes(this.categories[i]._id)) {
        if (this.categories[i].parentId.toString() === childId.toString()) {
          this.categoriesTree.push(this.categories[i]._id);
          this.findCategory(childId);
          this.findCategory(this.categories[i]._id);
          //return this.categories[i];
        }
      }    
    }
  }

  public filterValues(dataPlaces){
    this.categoriesTree=[];
    if(this.categoryId[this.categoryId.length-1]){
      this.categoriesTree.push(this.categoryId[this.categoryId.length-1]);
      this.findCategory(this.categoryId[this.categoryId.length-1]);
      this.filtersEvent["categoryId"]= { $in:this.categoriesTree };
    }
    this.filtersEvent["title"]={$regex: this.form.get('title').value};
    //this.filtersEvent["price"]=null;
    if(this.form.get('price').value){
      this.filtersEvent["price"]={$lte: this.form.get('price').value};
    }else{
      delete this.filtersEvent["price"];
    }
    if(dataPlaces.success){
      var placesId=[];
      for (var i = 0; i < dataPlaces.places.length; ++i) {
        placesId.push(dataPlaces.places[i]._id);
      }
      this.filtersEvent["placeId"]= { $in:placesId };
    }
    if(this.inputType==="editEvents"){
      this.eventService.getUserEvents(this.authService.user.id,this.filtersEvent,this.localizeService.parser.currentLang).subscribe(dataEvents => {
        if(dataEvents.success){
          this.events = dataEvents.events;
          this.observableService.eventsEvent="edit-events";
          this.observableService.notifyOther({option: this.observableService.eventsEvent,value: this.events});
        }
      });
    }else{
      this.eventService.getEvents(this.filtersEvent,this.localizeService.parser.currentLang).subscribe(dataEvents => {
        if(dataEvents.success){
          this.events = dataEvents.events;
          var count=0;
          var exists=false; 
          if(this.inputType==="seeEvents"){
            this.observableService.eventsEvent="see-events";
            this.observableService.notifyOther({option: this.observableService.eventsEvent,value: this.events});
          }else if(this.inputType==="map"){
            for (var i = 0; i < this.events.length; ++i) {
              exists=true;
              this.events[i].selectedCategory=this.categoryId[this.categoryId.length-1];
              this.observableService.notifyOther({option: this.observableService.mapEvents, value: this.events[i],count:count,exists:exists});     
              count=count+1;
            }
            if(!exists){
              this.observableService.notifyOther({option: this.observableService.mapEvents, value: [],count:count,exists:exists});
            }
          } 
        } 
      });
    }
  }
  private getEvents() {
    this.filtersEvent={     
      $and: [
        {
          $or : [
            {
              start:{
                $gte:new Date(this.form.get('start').value.year,this.form.get('start').value.month-1,this.form.get('start').value.day,this.timeStart.hour,this.timeStart.minute)
              }
            },
            {
              end:{
                $gte:new Date(this.form.get('start').value.year,this.form.get('start').value.month-1,this.form.get('start').value.day,this.timeEnd.hour,this.timeEnd.minute)
              }
            }
          ]
        },
        {
          $or : [
            {
              end:{
                $lte:new Date(this.form.get('end').value.year,this.form.get('end').value.month-1,this.form.get('end').value.day,this.timeEnd.hour,this.timeEnd.minute)
              }
            },
            {
              start:{
                $lte:new Date(this.form.get('end').value.year,this.form.get('end').value.month-1,this.form.get('end').value.day+1,this.timeEnd.hour,this.timeEnd.minute)
              }
            }
          ]
        }
      ] 
      // start:{$lte:new Date(this.form.get('end').value.year,this.form.get('end').value.month-1,this.form.get('end').value.day,this.timeEnd.hour,this.timeEnd.minute)}      
    }
    this.placeService.getPlacesGeonameId(this.filtersPlace,this.localizeService.parser.currentLang).subscribe(dataPlaces => {
      this.filterValues(dataPlaces);
    });
  }

  /*onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return true;//date.equals(this.fromDate) || date.equals(this.toDate) || this.isInside(date) || this.isHovered(date);
  }*/
  public onDateSelect(event){
    this.getEvents();
  }
  private eventFilterSearchTitle(){
    this.placeService.placesGeonameIdFilterSearchTitle(this.searchTitle,this.filtersPlace,this.localizeService.parser.currentLang).subscribe(dataPlaces=>{
      this.filterValues(dataPlaces);
    });
  }
  private eventFilterSearchPrice(){
    this.placeService.placesGeonameIdFilterSearchPrice(this.searchPrice,this.filtersPlace,this.localizeService.parser.currentLang).subscribe(dataPlaces=>{
      this.filterValues(dataPlaces);     
    });
  }
  ngOnInit() {
    var defaultStart=new Date();
    var defaultEnd=new Date();
    defaultEnd.setDate(defaultStart.getDate()+14);
    this.form.get('start').setValue({year: defaultStart.getFullYear(), month: defaultStart.getMonth()+1, day: defaultStart.getDate()});
    this.form.get('end').setValue({year: defaultEnd.getFullYear(), month: defaultEnd.getMonth()+1, day: defaultEnd.getDate()});  
    this.getProvinces();
    this.getCategories();
    this.getEvents();
    this.eventFilterSearchTitle();
    this.eventFilterSearchPrice();
    this.subscriptionLanguage =this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.localizeService.parser.currentLang=event.lang;
        this.categoryId=[];
        this.categoriesTree=[];
        this.createNewFilterForm();
        this.getProvinces();
        this.getCategories();
    }); 
  }
  ngOnDestroy(){
    this.subscriptionLanguage.unsubscribe();
  } 
}

