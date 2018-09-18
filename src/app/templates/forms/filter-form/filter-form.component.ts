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
import { NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
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
    private groupByPipe:GroupByPipe
  ) { 
    this.createNewFilterForm();
    
  }
    private createItem(value) {
    return this.fb.group({
      category: [value],
    });
  }
  // Function to create new event form
  private createNewFilterForm() {
    this.form = this.fb.group({
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
  }   
   // Function on seleccted event Continent
  public onSelectedProvince(index){
    if (index===-1){
      this.form.get('municipality').disable(); // Disable municipality field
    }else{
      this.form.get('municipality').enable(); // Enable municipality field
      this.placeService.getGeonamesJson('municipality',this.localizeService.parser.currentLang,this.provincesEvent[index].toponymName.toLowerCase()).subscribe(municipalitiesEvent => {
        this.geonameIdProvince=this.provincesEvent[index].geonameId;
        this.municipalitiesEvent=municipalitiesEvent.geonames;
      });
    }
    this.form.controls['municipality'].setValue("");
  }
  // Function on seleccted event municipality
  public onSelectedMunicipality(index){
    if(index!==-1){  
      this.geonameIdMunicipality=this.municipalitiesEvent[index].geonameId;
    }
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
  private getEvents() {
    var filtersEvent={
      start:{
        $gte:new Date(this.form.get('start').value.year,this.form.get('start').value.month-1,this.form.get('start').value.day,this.timeStart.hour,this.timeStart.minute)
      },
      end:{
        $lte:new Date(this.form.get('end').value.year,this.form.get('end').value.month-1,this.form.get('end').value.day,this.timeEnd.hour,this.timeEnd.minute)
      }
    }
    var filtersPlace={}
    this.categoriesTree=[];
    if(this.categoryId[this.categoryId.length-1]){
      this.categoriesTree.push(this.categoryId[this.categoryId.length-1]);
      this.findCategory(this.categoryId[this.categoryId.length-1]);
      filtersEvent["categoryId"]= { $in:this.categoriesTree };
    }
    if(this.form.get('province').value){
      filtersPlace["province.geonameId"]=this.geonameIdProvince;
    }
    if(this.form.get('municipality').value){
      filtersPlace["municipality.geonameId"]=this.geonameIdMunicipality;
    }
     //
    if(this.form.get('price').value){
      filtersEvent["price"]={ $lte:this.form.get('price').value };
    }
    this.placeService.getPlacesGeonameId(filtersPlace,this.localizeService.parser.currentLang).subscribe(dataPlaces => {
      if(dataPlaces.success){
        var placesId=[];
        for (var i = 0; i < dataPlaces.places.length; ++i) {
          placesId.push(dataPlaces.places[i]._id);
        }
        filtersEvent["placeId"]= { $in:placesId };
      }
      if(this.inputType==="editEvents"){
        this.eventService.getUserEvents(this.authService.user.id,filtersEvent,this.localizeService.parser.currentLang).subscribe(dataEvents => {
          if(dataEvents.success){
            this.events = dataEvents.events;
            if(this.inputType==="editEvents"){
              this.observableService.eventsEvent="edit-events";
              this.observableService.notifyOther({option: this.observableService.eventsEvent,value: this.events});
            }  
          }
        });
      }else{
        this.eventService.getEvents(filtersEvent,this.localizeService.parser.currentLang).subscribe(dataEvents => {
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
    });
  }
  public onEventSubmit(){
    this.getEvents();
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

