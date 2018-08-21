import { Component, OnInit,ElementRef,Injectable,Input,Output,EventEmitter } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder,FormArray, Validators } from '@angular/forms';
import { NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import { TitleValidator,LatitudeValidator,LongitudeValidator,DateValidator } from '../../../validators';
import { AuthService } from '../../../services/auth.service';
import { CategoryService } from '../../../services/category.service';
import { EventService } from '../../../services/event.service';
import { PlaceService } from '../../../services/place.service';
import { FileUploaderService} from '../../../services/file-uploader.service';
import { TranslateService,LangChangeEvent } from '@ngx-translate/core';
import { FileUploader,FileUploaderOptions,FileItem } from 'ng2-file-upload';
import { Router } from '@angular/router';
import { Event } from '../../../class/event';
import { Place } from '../../../class/place';
import { LocalizeRouterService } from 'localize-router';
import { ObservableService } from '../../../services/observable.service';
import { GroupByPipe } from '../../../shared/pipes/group-by.pipe';
import { AuthGuard} from '../../../pages/guards/auth.guard';
import { Subscription } from 'rxjs/Subscription';
import * as moment from 'moment-timezone';
declare let $: any;
const URL = 'http://localhost:8080/fileUploader/uploadImages/event-poster';
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
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.css'],
  providers: [{provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n}] // define custom NgbDatepickerI18n provider
})
export class EventFormComponent implements OnInit {
  private event:Event=new Event();
  private place:Place=new Place();
  private selectedPlace;
  private messageClass;
  public message;
  //private newPost = false;
  private loadingEvents = false;
  public form:FormGroup;
  public submitted:boolean = false;
  private imagesPoster=[];
  @Input() inputLanguage;
  @Input() inputOperation:string;
  @Input() inputEvent;
  private inputEventCopy;
  @Input() inputCategories;
  private imagesDescription=[];
  public title:AbstractControl;
  private categories: any[] = [];
  public participant:AbstractControl;
  public province:AbstractControl;
  public municipality:AbstractControl;
  public locationsExists:AbstractControl;
  public location:AbstractControl;
  public start:AbstractControl;
  public end:AbstractControl;
  public price:AbstractControl;
  public lat:AbstractControl;
  public lng:AbstractControl;
  public description:AbstractControl;
  public observations:AbstractControl;
  public timeStart = {hour: 13, minute: 30};
  public timeEnd = {hour: 13, minute: 30};
  private categoryId=[];
  private levelCategories=[];
  public participants=[];
  private categoryIcon;
  public provincesEvent;
  public municipalitiesEvent;
  public locationsExistsEvent=[];
  private uploadAllSuccess:Boolean=true;
  private froalaSignature;
  private froalaEvent;
  public uploader:FileUploader = new FileUploader({
    url: URL,itemAlias: 'event-poster',
    isHTML5: true,
    allowedMimeType: ['image/png', 'image/jpg', 'image/jpeg', 'image/gif'],
    maxFileSize: 10*1024*1024 // 10 MB
  });
  private uploadOptions;
  private hasBaseDropZoneOver:boolean = false;
  private hasAnotherDropZoneOver:boolean = false;
  private subscriptionLanguage: Subscription;
  private subscriptionObservableMapClick: Subscription;
  public disableCategories=false;
  public disableUploader=false;
  @Output() RefreshEvent = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private categoryService: CategoryService,
    private eventService: EventService,
    private placeService: PlaceService,
    private fileUploaderService:FileUploaderService,
    private translate: TranslateService,
    private observableService: ObservableService,
    private router:Router,
    private elementRef: ElementRef,
    private localizeService: LocalizeRouterService,
    private authGuard: AuthGuard,
    private groupByPipe:GroupByPipe
  ) {
    this.createNewEventForm(); // Create new event form on start up
  }
  private createItem(value) {
    return this.fb.group({
      category: [value, Validators.compose([
        Validators.required
      ])],
    });
  }

  // Function to create new event form
  private createNewEventForm() {
    this.form = this.fb.group({
      title: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(30),
        Validators.minLength(5),
        TitleValidator.validate
      ])],
      categories: this.fb.array([ this.createItem('') ]),
      participant: ['', Validators.compose([
        /*Validators.maxLength(30),
        Validators.minLength(5),
        TitleValidator.validate*/
      ])],
      province: ['', Validators.compose([
        Validators.required
      ])],
      municipality: ['', Validators.compose([
        Validators.required
      ])],
      locationsExists: ['', Validators.compose([
        Validators.required,Validators.maxLength(1000)
      ])],
      location: ['', Validators.compose([
        Validators.required,Validators.maxLength(1000)
      ])],
      start: ['', Validators.compose([
        Validators.required/*,DateValidator.validate*/
      ])],
      end: ['', Validators.compose([
        Validators.required/*,DateValidator.validate*/
      ])],
      price: [''],
       lat: ['', Validators.compose([
        Validators.required,LatitudeValidator.validate
      ])],
      lng: ['', Validators.compose([
        Validators.required,LongitudeValidator.validate
      ])],
      description: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(20000),
        Validators.minLength(50)
      ])],
      observations: ['', Validators.compose([
        Validators.maxLength(1000)
      ])]

    })
    this.title = this.form.controls['title'];
    this.participant = this.form.controls['participant'];
    this.province = this.form.controls['province'];
    this.municipality = this.form.controls['municipality'];
    this.start = this.form.controls['start'];
    this.end = this.form.controls['end'];
    this.price = this.form.controls['price'];
    this.locationsExists = this.form.controls['locationsExists'];
    this.location = this.form.controls['location'];
    this.lat = this.form.controls['lat'];
    this.lng = this.form.controls['lng'];
    this.description= this.form.controls['description'];
    this.observations = this.form.controls['observations'];
  }
  private initializeForm(){
    if(this.inputEvent){
      this.inputEventCopy=JSON.parse(JSON.stringify(this.inputEvent));
      //general event translation
      if(this.inputEvent.language===this.inputLanguage){
        if(this.inputEvent.createdBy!==this.authService.user.username && this.authService.user.permission!=="admin"){     
          this.disableForm();
        }
        this.title.setValue(this.inputEvent.title);
        this.description.setValue(this.inputEvent.description);
        this.observations.setValue(this.inputEvent.observations);
        this.imagesDescription=this.inputEvent.images.description;     
      }else{
        this.disableCategories=true;
        this.province.disable();
        this.municipality.disable();
        this.price.disable();
        this.lat.disable();
        this.lng.disable();
        for (var i = 0; i < this.inputEvent.translation.length; ++i) {
          if(this.inputEvent.translation[i].language===this.inputLanguage){
            if(this.inputEvent.translation[i].createdBy!==this.authService.user.username && this.authService.user.permission!=="admin"){     
              this.disableForm();
            }
            this.title.setValue(this.inputEvent.translation[i].title);
            this.description.setValue(this.inputEvent.translation[i].description);
            this.observations.setValue(this.inputEvent.translation[i].observations);
            this.imagesDescription=this.inputEvent.translation[i].images.description;
          }
        }    
      } 
      //general place translation
      if(this.inputEvent.place.language===this.inputLanguage){
        this.locationsExists.setValue(this.inputEvent.place.location);  
      }else{
        for (var i = 0; i < this.inputEvent.place.translation.length; ++i) {
          if(this.inputEvent.place.translation[i].language===this.inputLanguage){
            this.locationsExists.setValue(this.inputEvent.place.translation[i].location);      
          }
        }    
      } 
      //Get categories on page load    
      (this.form.controls['categories'] as FormArray).removeAt(0);
      for (var j in this.inputCategories) {
        this.categoryId.push(this.inputCategories[j]._id);
        //set icon map
        this.categoryIcon=this.inputCategories[this.inputCategories.length-1].icons[0].url;
        if(this.inputCategories[j].language===this.inputLanguage){
          (this.form.controls['categories'] as FormArray).push(this.createItem(this.inputCategories[j].title));
        }
        for (var k = 0; k < this.inputCategories[j].translation.length; ++k) {
          if(this.inputCategories[j].translation[k].language===this.inputLanguage){
            (this.form.controls['categories'] as FormArray).push(this.createItem(this.inputCategories[j].translation[k].title));
          }
        } 
      } 
      //Get provinces on page load
      this.placeService.getGeonamesJson('province',this.inputLanguage,'euskal-herria').subscribe(provincesEvent => {
        this.provincesEvent=provincesEvent.geonames;
        if(this.inputEvent.place.language===this.inputLanguage){
          if(this.inputEvent.createdBy===this.authService.user.username || this.authService.user.permission==="admin"){     
            this.form.get('municipality').enable(); // Enable municipality field
          }
          this.province.setValue(this.inputEvent.place.province.name);    
        }else{
          var traductionProvince=false;
          for (var i = 0; i < this.inputEvent.place.translation.length; ++i) {
            if(this.inputEvent.place.translation[i].language===this.inputLanguage){
              traductionProvince=true
              this.province.setValue(this.inputEvent.place.translation[i].province.name);
            }
          } 
          if(!traductionProvince){         
            for (var i = 0; i < this.provincesEvent.length; ++i) { 
              if(this.provincesEvent[i].geonameId===this.inputEvent.place.province.geonameId){ 
                this.province.setValue(this.provincesEvent[i].name);          
              } 
            }   
          }
        }                        
      });  
      //Get municipality on page load      
      if(this.inputEvent.place.municipality){
        this.placeService.getGeonamesJson('municipality',this.inputLanguage,this.inputEvent.place.province.name.toLowerCase()).subscribe(municipalitiesEvent => {
          this.municipalitiesEvent=municipalitiesEvent.geonames;
          if(this.inputEvent.place.language===this.inputLanguage){
            //Location validation
            this.placeService.getPlacesCoordinates(this.inputEvent.place.province.name,this.inputEvent.place.municipality.name,this.inputLanguage).subscribe(data=>{
              if(data.success && data.places.length>0){
                this.locationsExistsEvent=data.places;
                this.location.setValidators([Validators.compose([Validators.maxLength(1000)])]);
                this.location.updateValueAndValidity(); //Need to call this to trigger a update
              }else{
                this.locationsExistsEvent=[];
                this.locationsExists.setValue("");
              }
            });
            this.municipality.setValue(this.inputEvent.place.municipality.name);  
          }else{
            var traductionProvince=false;
            for (var i = 0; i < this.inputEvent.place.translation.length; ++i) {
              if(this.inputEvent.place.translation[i].language===this.inputLanguage){
                traductionProvince=true
                this.municipality.setValue(this.inputEvent.place.translation[i].municipality.name);
                //Location validation
                this.placeService.getPlacesCoordinates(this.inputEvent.place.translation[i].province.name,this.inputEvent.place.translation[i].municipality.name,this.inputLanguage).subscribe(data=>{
                  if(data.success && data.places.length>0){
                    this.locationsExistsEvent=data.places;
                    this.location.setValidators([Validators.compose([Validators.maxLength(1000)])]);
                    this.location.updateValueAndValidity(); //Need to call this to trigger a update
                  }else{
                    this.locationsExistsEvent=[];
                    this.locationsExists.setValue("");
                  }
                }); 
              }
            }

            if(!traductionProvince){
              for (var i = 0; i < this.municipalitiesEvent.length; ++i) { 
                if(this.municipalitiesEvent[i].geonameId===this.inputEvent.place.municipality.geonameId){ 
                  this.municipality.setValue(this.municipalitiesEvent[i].name);      
                }
              }                  
            } 
          }                  
        });        
      } 
      //Get participants on page load
      this.participants=this.inputEvent.participants;
      //Get start on page load
      this.inputEvent.start=moment(this.inputEvent.start).tz("Europe/Madrid").format('YYYY-MM-DD HH:mm');
      var year=Number(this.inputEvent.start.split("-")[0]);
      var month=Number(this.inputEvent.start.split("-")[1]);
      var day=Number(this.inputEvent.start.split('-').pop().split(' ').shift());
      var hour=Number(this.inputEvent.start.split(' ').pop().split(':').shift());
      var minute=Number(this.inputEvent.start.split(':')[1]);
      var calendar= {year:year , month: month,day: day};
      this.start.setValue(calendar);
      this.timeStart.hour=hour;
      this.timeStart.minute=minute; 
        
      //Get end on page load
      this.inputEvent.end=moment(this.inputEvent.end).tz("Europe/Madrid").format('YYYY-MM-DD HH:mm');
      var year=Number(this.inputEvent.end.split("-")[0]);
      var month=Number(this.inputEvent.end.split("-")[1]);
      var day=Number(this.inputEvent.end.split('-').pop().split(' ').shift());
      var hour=Number(this.inputEvent.end.split(' ').pop().split(':').shift());
      var minute=Number(this.inputEvent.end.split(':')[1]);
      var calendar= {year:year , month: month,day: day};
      this.end.setValue(calendar); 
      this.timeEnd.hour=hour;
      this.timeEnd.minute=minute; 
      //Get price on page load
      this.price.setValue(this.inputEvent.price);
      //Get lat on page load
      this.lat.setValue(this.inputEvent.place.coordinates.lat);
      //Get lng on page load
      this.lng.setValue(this.inputEvent.place.coordinates.lng);    
      //Get event-poster on page load   
      var hasTranslation=false;
      for (var i = 0; i < this.inputEvent.translation.length; ++i) {
        if(this.inputEvent.translation[i].language===this.inputLanguage){
          hasTranslation=true;
          this.imagesPoster=this.inputEvent.translation[i].images.poster;
          for (var z = 0; z < this.imagesPoster.length; ++z) {
            let file = new File([],decodeURIComponent(this.inputEvent.translation[i].images.poster[z].url).split('https://s3.eu-west-1.amazonaws.com/culture-bucket/event-poster/')[1]);
            let fileItem = new FileItem(this.uploader, file, {});
            fileItem.file.size=this.inputEvent.translation[i].images.poster[z].size;
            fileItem.progress = 100;
            fileItem.isUploaded = true;
            fileItem.isSuccess = true;
            this.uploader.queue.push(fileItem);
          }
        }       
      } 
      if(!hasTranslation){
        this.imagesPoster=this.inputEvent.images.poster;
        for (var z = 0; z < this.imagesPoster.length; ++z) {
          let file = new File([],decodeURIComponent(this.inputEvent.images.poster[z].url).split('https://s3.eu-west-1.amazonaws.com/culture-bucket/event-poster/')[1]);
          let fileItem = new FileItem(this.uploader, file, {});
          fileItem.file.size=this.inputEvent.images.poster[z].size;
          fileItem.progress = 100;
          fileItem.isUploaded = true;
          fileItem.isSuccess = true;
          this.uploader.queue.push(fileItem);
        }
      }                
      if(this.title.value && this.categoryId.length>0 && this.inputEvent.place.coordinates.lat && this.inputEvent.place.coordinates.lng){
        // After 2 seconds, redirect to dashboard page
        setTimeout(() => {
          this.passCoordinates(undefined);
        });   
      } 
    }   
  }
  private mapClickPlace(){
    this.subscriptionObservableMapClick=this.observableService.notifyObservable.subscribe(res => {
      if (res.hasOwnProperty('option') && res.option === this.observableService.mapClickType) {
        var coordinates={
          lat:res.lat,
          lng:res.lng
        }
      this.passCoordinates(coordinates);
      }
    }); 
  }
  // Enable new categories form
  private enableForm() {
    this.form.enable(); // Enable form
    this.disableCategories=false;  
    this.disableUploader=false;
    this.submitted=false;
    $('#textareaDescription'+this.localizeService.parser.currentLang).froalaEditor('edit.on');
    this.froalaEvent.getEditor()('html.set', '');
  }

  // Disable new categories form
  private disableForm() {
    this.form.disable();
    this.disableCategories=true;
    setTimeout(() => {
      $('#textareaDescription'+this.inputLanguage).froalaEditor('edit.off');
    },1000);     
    this.disableUploader=true;
    this.submitted=true;
  }

  // Function to display new categories form
  /*private newEventForm() {
    this.newPost = true; // Show new categories form
  }*/

  private fileOverBase(e:any):void {
    this.hasBaseDropZoneOver = e;
  }
   // File upload controll
  private fileOverAnother(e:any):void {
    this.hasAnotherDropZoneOver = e;
  }
  public onEventSubmit(){
    this.submitted = true;
    // Create event object from form fields
    this.event.setLanguage=this.localizeService.parser.currentLang;// Language field
    this.event.setCreatedBy=this.authService.user.username; // CreatedBy field
    this.event.setTitle=this.form.get('title').value; // Title field
    this.event.setParticipants=this.participants;
    this.event.setStart=new Date(this.form.get('start').value.year,this.form.get('start').value.month-1,this.form.get('start').value.day,this.timeStart.hour,this.timeStart.minute);
    this.event.setEnd=new Date(this.form.get('end').value.year,this.form.get('end').value.month-1,this.form.get('end').value.day,this.timeEnd.hour,this.timeEnd.minute);
    this.event.setPrice=this.form.get('price').value;
    this.event.setCategoryId=this.categoryId[this.categoryId.length-1];
    this.event.setDescription= this.form.get('description').value; // Description field
    this.event.setObservations=this.form.get('observations').value; // Observations field
    this.place.setProvince=this.form.get('province').value; // Province field
    this.place.setMunicipality=this.form.get('municipality').value; // Municipality field
    if(this.form.get('location').value){
      this.place.setLocation=this.form.get('location').value; //Location field,
    }else if(this.form.get('locationsExists').value){
      this.place.setLocation=this.form.get('locationsExists').value; //Location exists field,
    }
    this.place.setLat=Number(this.form.get('lat').value); // Lat field
    this.place.setLng=Number(this.form.get('lng').value); // Lng field
    if(this.uploader.queue.length>0){
      this.uploader.uploadAll();
      if(this.uploader.queue[0].isUploaded){
        this.editEvent();
      }
    }else{
      if(this.inputOperation==='create'){
        this.createEvent();
      }else if(this.inputOperation==='edit'){
        this.editEvent();
      }      
    }
  }

  private createEvent() {
    // Function to save event into database
    this.eventService.newEvent(this.event,this.place).subscribe(data => {
      // Check if event was saved to database or not
      if (!data.success) {
        this.deleteUploadImages('poster',this.imagesPoster);
        this.deleteUploadImages('descriptionAll',this.imagesDescription);
        this.messageClass = 'alert alert-danger ks-solid'; // Return error class
        this.message = data.message; // Return error message
        this.submitted = false; // Enable submit button
      } else {
        this.createNewEventForm(); // Reset all form fields
        this.uploader.clearQueue();
        this.imagesPoster=[];
        this.imagesDescription=[];
        this.participants=[];
        this.locationsExistsEvent=[];
        this.messageClass = 'alert alert-success ks-solid'; // Return success class
        this.message = data.message; // Return success message
        // Clear form data after two seconds
        setTimeout(() => {
          //this.newPost = false; // Hide form
          this.message = false; // Erase error/success message
          this.enableForm(); // Enable the form fields
          this.participants=[];
        }, 2000);
      }
    });  
  }
  private deleteEditImages(deleteImage){
     //see delete images
    var deleteImages=[];
    for (var i = 0; i < this.imagesPoster.length; ++i) {
      let file = new File([],decodeURIComponent(this.imagesPoster[i].url).split('https://s3.eu-west-1.amazonaws.com/culture-bucket/event-poster/')[1]);
      let fileItem = new FileItem(this.uploader, file, {});
      if(this.uploader.queue.some(e => e.file.name !== fileItem.file.name)){
        deleteImages.push(this.imagesPoster[i]);
        this.imagesPoster.splice(i,1);            
      }
    }
    if(deleteImages.length>0 && deleteImage){
      this.deleteUploadImages('poster',deleteImages);
    }
  }

  private editEvent() {
    if(this.inputEvent){
      var hasTranslationEvent=false;
      var hasTranslationPlace=false; 
      this.inputEvent.participants=this.participants;
      this.inputEvent.start=new Date(this.form.get('start').value.year,this.form.get('start').value.month-1,this.form.get('start').value.day,this.timeStart.hour,this.timeStart.minute);
      this.inputEvent.end=new Date(this.form.get('end').value.year,this.form.get('end').value.month-1,this.form.get('end').value.day,this.timeEnd.hour,this.timeEnd.minute);
      this.inputEvent.price=this.form.get('price').value;
      this.inputEvent.categoryId=this.categoryId[this.categoryId.length-1];
      if(this.selectedPlace){
        this.inputEvent.place=this.selectedPlace;
      }else if(this.inputEvent.place.province.name!==this.province || this.inputEvent.place.municipality.name!==this.municipality|| this.inputEvent.place.location!==this.location){
        this.inputEvent.place.translation=[];
      } 
      this.inputEvent.place.coordinates.lat=Number(this.form.get('lat').value); // Lat field
      this.inputEvent.place.coordinates.lng=Number(this.form.get('lng').value); // Lng field
      //event translation
      for (var i = 0; i < this.inputEvent.translation.length; ++i) {
        if(this.inputEvent.translation[i].language===this.inputLanguage){
          this.deleteEditImages(true);
          hasTranslationEvent=true;
          this.inputEvent.translation[i].language=this.inputLanguage;// Language field  
          this.inputEvent.translation[i].createdBy=this.authService.user.username;// Language field      
          this.inputEvent.translation[i].title=this.form.get('title').value; // Title field
          this.inputEvent.translation[i].description= this.form.get('description').value; // Description field
          this.inputEvent.translation[i].observations=this.form.get('observations').value; // Observations field
          this.inputEvent.translation[i].images.description=this.imagesDescription;
        }
      }
      //place translation
      for (var i = 0; i < this.inputEvent.place.translation.length; ++i) {
        if(this.inputEvent.place.translation[i].language===this.inputLanguage){
          hasTranslationPlace=true;
          this.inputEvent.place.translation[i].province.name=this.form.get('province').value; // Province field
          this.inputEvent.place.translation[i].municipality.name=this.form.get('municipality').value; // Municipality field
          if(this.form.get('location').value){
            this.inputEvent.place.translation[i].location=this.form.get('location').value; //Location field,
          }else if(this.form.get('locationsExists').value){
            this.inputEvent.place.translation[i].location=this.form.get('locationsExists').value; //Location exists field,
          }
        }
      }
      if(!hasTranslationEvent){
        //if event has original language and not has translation
        if(this.inputEvent.language===this.inputLanguage){
          this.deleteEditImages(true);
          this.inputEvent.language=this.inputLanguage;// Language field   
          this.inputEvent.createdBy=this.authService.user.username;// Language field       
          this.inputEvent.title=this.form.get('title').value; // Title field
          this.inputEvent.description= this.form.get('description').value; // Description field
          this.inputEvent.observations=this.form.get('observations').value; // Observations field     
          this.inputEvent.images.description=this.imagesDescription;  
        }else{
          this.deleteEditImages(false);
          this.inputEvent.images.poster=this.inputEventCopy.images.poster;
          this.inputEvent.translate=this.inputEventCopy.images.poster;
          //event push new translation
          var eventTranslationObj={
            language:this.inputLanguage,
            createdBy:this.inputEvent.createdBy=this.authService.user.username,  
            title:this.form.get('title').value,
            description:this.form.get('description').value,
            observations:this.form.get('observations').value,
            images:{
              poster:JSON.parse(JSON.stringify(this.imagesPoster)),
              description:JSON.parse(JSON.stringify(this.imagesDescription))
            }
          }
          this.inputEvent.translation.push(eventTranslationObj);       
        }
      }
      if(!hasTranslationPlace){
        //if place has original language and not has translation
        if(this.inputEvent.place.language===this.inputLanguage){
          this.inputEvent.place.province.name=this.form.get('province').value; // Province field
          this.inputEvent.place.municipality.name=this.form.get('municipality').value; // Municipality field
           if(this.place.geonameIdProvince){
            this.inputEvent.place.province.geonameId=this.place.geonameIdProvince;
          }
          if(this.place.geonameIdMunicipality){
            this.inputEvent.place.municipality.geonameId=this.place.geonameIdMunicipality;
          }
          if(this.form.get('location').value){
            this.inputEvent.place.location=this.form.get('location').value; //Location field,
          }else if(this.form.get('locationsExists').value){
            this.inputEvent.place.location=this.form.get('locationsExists').value; //Location exists field,
          }
        }else{
          //place push new translation
          var location;
          if(this.form.get('location').value){
            location=this.form.get('location').value; //Location field,
          }else if(this.form.get('locationsExists').value){
            location=this.form.get('locationsExists').value; //Location exists field,
          }
          var placeTranslationObj={
            language:this.inputLanguage,
            province:{
              name:this.form.get('province').value
            },
            municipality:{
              name:this.form.get('municipality').value
            },
            location:location
          }
          this.inputEvent.place.translation.push(placeTranslationObj);           
        }
      }
    }
    // Function to save event into database
    this.eventService.editEvent(this.inputEvent).subscribe(data => {
      // Check if event was saved to database or not
      if (!data.success) {
        this.deleteUploadImages('poster',this.imagesPoster);
        this.deleteUploadImages('descriptionAll',this.imagesDescription);
        this.messageClass = 'alert alert-danger ks-solid'; // Return error class
        this.message = data.message; // Return error message
        this.enableForm(); // Enable form
      } else {
        this.messageClass = 'alert alert-success ks-solid'; // Return success class
        this.message = data.message; // Return success message
         this.RefreshEvent.emit({event: this.inputEvent,categories:this.inputCategories});
        this.inputEvent=data.event;
        // Clear form data after two seconds
        setTimeout(() => {
          //this.newPost = false; // Hide form
          this.submitted = false; // Enable submit button
          this.message = false; // Erase error/success message
        }, 2000);
      }
    }); 
  }
  private deleteUploadImages(type,images){
    if(type==='poster'){
      for (var i = 0; i < images.length; ++i) {
        var currentUrlSplit = images[i].url.split("/");
        let imageName = currentUrlSplit[currentUrlSplit.length - 1];
        var urlSplit = imageName.split("%2F");
        this.fileUploaderService.deleteImages(urlSplit[0],"event-poster",this.localizeService.parser.currentLang).subscribe(data=>{
        });
      }
    }else if(type==='descriptionOne'){
      var currentUrlSplit = images[0].currentSrc.split("/");
      let imageName = currentUrlSplit[currentUrlSplit.length - 1];
      var urlSplit = imageName.split("%2F");
      for (var i = 0; i < this.imagesDescription.length; i++) {
        if(this.imagesDescription[i]===images[0].currentSrc){
          this.imagesDescription.splice(i,1);
          this.event.setImagesDescription=this.imagesDescription;
        }
      }
      this.fileUploaderService.deleteImages(urlSplit[1],urlSplit[0],this.localizeService.parser.currentLang).subscribe(data=>{
      });
    }else if (type==='descriptionAll'){
      for (var i = 0; i < this.imagesDescription.length; i++) {
        var currentUrlSplit = this.imagesDescription[i].split("/");
        let imageName = currentUrlSplit[currentUrlSplit.length - 1];
        var urlSplit = imageName.split("%2F");
        this.fileUploaderService.deleteImages(urlSplit[1],urlSplit[0],this.localizeService.parser.currentLang).subscribe(data=>{
        });
      }
    }
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
    if (index===-1){
      // remove
        for (var i = this.form.controls['categories'].value.length - 1; i >= level+1; i--) {
          (this.form.controls['categories'] as FormArray).removeAt(i);
        }
    }else{
      //hide categories
      this.categoryId[level+1] = this.levelCategories[level].value[index]._id;
      var newFormArray=false;
      if(this.levelCategories[level+1]){
         for (var i = 0; i < this.levelCategories[level+1].value.length; ++i) {
          //set icon map
          this.categoryIcon=this.levelCategories[level+1].value[i].icons[0].url;
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
        this.place.setGeonameIdProvince=this.provincesEvent[index].geonameId;
        this.municipalitiesEvent=municipalitiesEvent.geonames;
      });
    }
    this.form.controls['municipality'].setValue("");
  }
  // Function on seleccted event municipality
  public onSelectedMunicipality(index){
    if(index!==-1){
      var coordinates={
        lat:this.municipalitiesEvent[index].lat,
        lng:this.municipalitiesEvent[index].lng
      }
      this.placeService.getPlacesCoordinates(this.form.get('province').value,this.form.get('municipality').value,this.localizeService.parser.currentLang).subscribe(data=>{
        if(data.success && data.places.length>0){
          this.locationsExistsEvent=data.places;
        }else{
          this.locationsExistsEvent=[];
        }
      });
      this.form.controls['locationsExists'].setValue("");
      this.passCoordinates(coordinates);
      this.place.setGeonameIdMunicipality=this.municipalitiesEvent[index].geonameId;
    }
  }
     // Function on seleccted locations exists
  private onSelectedLocationsExists(index){
     if (index===-1){
      this.locationsExists.setValidators([Validators.compose([Validators.maxLength(1000)])]);
      this.locationsExists.updateValueAndValidity(); //Need to call this to trigger a update
    }else{
      var coordinates={
        lat:this.locationsExistsEvent[index].coordinates.lat,
        lng:this.locationsExistsEvent[index].coordinates.lng
      }
      this.passCoordinates(coordinates);
      this.location.setValidators([Validators.compose([Validators.maxLength(1000)])]);
      this.location.updateValueAndValidity(); //Need to call this to trigger a update
      this.selectedPlace=this.locationsExistsEvent[index];
    }
  }
  private deleteParticipant(index){
    this.participants.splice(index,1);
  }
  private chargeAll(){
    //First category parentId null on initialize
    this.categoryId.splice(0, 0, null);
    //Get categories
    this.categoryService.getCategories(this.localizeService.parser.currentLang).subscribe(data=>{
      if(data.success){
        this.levelCategories=this.groupByPipe.transform(data.categories,'level');
      }   
    });
    //Get provinces on page load
    if(this.inputOperation==='create'){
      this.placeService.getGeonamesJson('province',this.localizeService.parser.currentLang,'euskal-herria').subscribe(provincesEvent => {
        this.provincesEvent=provincesEvent.geonames;
      });
    }
  }
  private passCoordinates(defaultCoordinates){
    if (defaultCoordinates){
      var market_info={
        title:this.form.get('title').value,
        icon:this.categoryIcon, // Event field
        lat:defaultCoordinates.lat, // Lat field
        lng:defaultCoordinates.lng, // Lng field
      }
      this.lat.setValue(defaultCoordinates.lat);
      this.lng.setValue(defaultCoordinates.lng);
    }else{
      var market_info={
        title:this.form.get('title').value,
        icon:this.categoryIcon, // Event field
        lat:this.form.get('lat').value, // Lat field
        lng:this.form.get('lng').value, // Lng field
      }
    }
    this.observableService.mapType="event-form-coordinates";
    this.observableService.notifyOther({option: this.observableService.mapType, value: market_info});
  }
  private setUploaderOptions(){
    const authHeader: Array<{
     name: string;
     value: string;
     }> = [];
     authHeader.push({name: 'Authorization' , value: 'Bearer '+this.authService.authToken});
    this.uploadOptions = <FileUploaderOptions>{headers : authHeader};
    this.uploader.setOptions(this.uploadOptions);
    //override the onAfterAddingfile property of the uploader so it doesn't authenticate with //credentials.
    this.uploader.onAfterAddingFile = (file)=> { 
      file.withCredentials = false;
      this.uploader.progress=0;
      if(this.uploader.queue.length>1){
        this.uploader.queue.splice(0,1);
      }
    };
    //override onBuildItemForm to pass parameter language to server
    this.uploader.onBuildItemForm = (item, form) => {
      form.append('language', this.localizeService.parser.currentLang);
    };
     //override onErrorItem 
    this.uploader.onErrorItem = (item, response, status, headers) => {
    };
     //overide the onCompleteItem property of the uploader so we are 
    //able to deal with the server response.
    this.uploader.onCompleteItem = (item:any, response:any, status:any, headers:any) => {
      //console.log("ImageUpload:uploaded:", item, status, response);
      const responseJson=JSON.parse(response);
      if(!responseJson.success){
        if(responseJson.authentication===false){
          this.authService.logout();
          this.authGuard.redirectUrl=this.router.url;
          this.router.navigate([this.localizeService.translateRoute('/sign-in-route')]);
        }
        this.uploadAllSuccess=false;
        this.enableForm(); // Enable form
      }else{
        var file={
          size:responseJson.file[0].size,
          url:responseJson.file[0].location
        }
        this.imagesPoster.push(file);   
        if(this.uploader.progress===100 && this.uploadAllSuccess){
          this.event.setImagesPoster=this.imagesPoster;
          //Image preview update
          for (var j = 0; j < this.imagesPoster.length; ++j) {
            let file = new File([],decodeURIComponent(this.imagesPoster[j].url).split('https://s3.eu-west-1.amazonaws.com/culture-bucket/event-poster/')[1]);
            let fileItem = new FileItem(this.uploader, file, {});
            fileItem.file.size=this.imagesPoster[j].size;
            fileItem.progress = 100;
            fileItem.isUploaded = true;
            fileItem.isSuccess = true;
            this.uploader.queue.splice(0,1);
            this.uploader.queue.push(fileItem);
          }
          if(this.inputOperation==='create'){
            this.createEvent();
          }else if(this.inputOperation==='edit'){
            this.editEvent();
          }
        }
      } 
    };
    this.uploader.onWhenAddingFileFailed = (fileItem) => {
      if(fileItem.size>10*1024*1024){
        console.log("fitzategi haundiegia");
      }else if(!(fileItem.type === "image/png" ||fileItem.type === "image/jpg" ||fileItem.type === "image/jpeg" || fileItem.type === "image/gif")){
        console.log("formatu okerra");
      }
      console.log("fail", fileItem);
    }

  }
  public froalaOptions= {
     // Set max image size to 5MB.
    imageMaxSize: 5 * 1024 * 1024,
    // Allow to upload PNG and JPG.
    imageAllowedTypes: ['jpeg', 'jpg', 'png','gif'],
    charCounterMax: 20000,
    imageUploadToS3: undefined,
  }
  public initializeFroala(initControls) {
    this.froalaEvent=initControls;
    var context=this;
    this.fileUploaderService.getSignatureFroala("event-description",this.localizeService.parser.currentLang).subscribe(data=>{
      if(data.success){
        this.froalaOptions.imageUploadToS3=data.options
        initControls.initialize();
      }
    });
    setTimeout(() => {
      $('#textareaDescription'+this.inputLanguage).on('froalaEditor.image.inserted', function (e, editor, $img, response) {
        // Do something here.
        context.imagesDescription.push($img[0].currentSrc);
        context.event.setImagesDescription=context.imagesDescription;
      });
      $('#textareaDescription'+this.inputLanguage)
        // Catch image remove
        .on('froalaEditor.image.removed', function (e, editor, $img) {
          if(!context.submitted){
            context.deleteUploadImages('descriptionOne',$img);
          }      
        }); 
      });  
  }
  public addParticipant() {
    if(this.participant.value && !this.participants.includes(this.participant.value)){
      this.participants.push(this.participant.value);
      this.participant.setValue("");
    }
  }
  ngOnInit() {console.log(this.authService.user);
    this.initializeForm();
    this.mapClickPlace();
    this.location.valueChanges.subscribe(data=>{
      if(data===''){
        this.locationsExists.setValidators([Validators.compose([Validators.required,Validators.maxLength(1000)])]);
        this.locationsExists.updateValueAndValidity(); //Need to call this to trigger a update
      }else{
        this.locationsExists.setValidators([Validators.compose([Validators.maxLength(1000)])]);
        this.locationsExists.updateValueAndValidity(); //Need to call this to trigger a update
      }
    });
    //File uploader options
    this.setUploaderOptions();
    this.form.get('municipality').disable(); // Disable municipality field
    this.chargeAll();
    this.subscriptionLanguage =this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.localizeService.parser.currentLang=event.lang;
        this.chargeAll();; 
    }); 
  }
}