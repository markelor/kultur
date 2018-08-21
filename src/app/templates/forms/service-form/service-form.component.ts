import { Component, OnInit,ElementRef,Injectable,Input } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import { LocalizeRouterService } from 'localize-router';
import { AuthService } from '../../../services/auth.service';
import { ServiceTypeService } from '../../../services/service-type.service';
import { ServiceService } from '../../../services/service.service';
import { PlaceService } from '../../../services/place.service';
import { ObservableService } from '../../../services/observable.service';
import { TranslateService,LangChangeEvent } from '@ngx-translate/core';
import { FileUploaderService} from '../../../services/file-uploader.service';
import { TitleValidator,LatitudeValidator,LongitudeValidator } from '../../../validators';
import { Service } from '../../../class/service';
import { Place } from '../../../class/place';
import { Subscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';
import { AuthGuard} from '../../../pages/guards/auth.guard';
import * as moment from 'moment-timezone';
declare let $: any;
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
  selector: 'app-service-form',
  templateUrl: './service-form.component.html',
  styleUrls: ['./service-form.component.css'],
  providers: [{provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n}] // define custom NgbDatepickerI18n provider
})
export class ServiceFormComponent implements OnInit {
  public message;
  public messageClass;
  public submitted:boolean = false;
  public form:FormGroup;
  @Input() inputOperation:string;
  @Input() inputService;
  @Input() inputLanguage;
  private imagesDescription=[];
  public title:AbstractControl;
  public description:AbstractControl;
  public serviceType:AbstractControl;
  public province:AbstractControl;
  public municipality:AbstractControl;
  public locationsExists:AbstractControl;
  public location:AbstractControl;
  public lat:AbstractControl;
  public lng:AbstractControl;
  public expiredAt:AbstractControl;
  public timeExpiredAt = {hour: 13, minute: 30};
  public serviceTypes;
  private service:Service=new Service();
  private place:Place=new Place();
  private selectedPlace;
  public locationsExistsService=[];
  public provincesService;
  public municipalitiesService;
  private serviceTypeIcon;
  private froalaSignature;
  private froalaEvent;
  private subscriptionLanguage: Subscription;
  private subscriptionObservableMapClick: Subscription;
  constructor(
    private fb: FormBuilder,
    private localizeService:LocalizeRouterService,
    private serviceService:ServiceService,
    private serviceTypeService: ServiceTypeService,
    private placeService: PlaceService,
    private observableService:ObservableService,
    private fileUploaderService:FileUploaderService,
    private authService:AuthService,
    private translate: TranslateService,
    private router:Router,
    private authGuard: AuthGuard,){
    this.createForm(); // Create new theme form on start up
    }
    // Function to create new theme form
  private createForm() {
    this.form = this.fb.group({
      title: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(35),
        Validators.minLength(3),
        TitleValidator.validate
      ])],
      description: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(20000),
        Validators.minLength(50)
      ])],
      serviceType: ['', Validators.compose([
        Validators.required
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
      lat: ['', Validators.compose([
        Validators.required,LatitudeValidator.validate
      ])],
      lng: ['', Validators.compose([
        Validators.required,LongitudeValidator.validate
      ])],
        expiredAt: [''],

    })
    this.title = this.form.controls['title'];
    this.description= this.form.controls['description'];
    this.serviceType = this.form.controls['serviceType'];
    this.province = this.form.controls['province'];
    this.municipality = this.form.controls['municipality'];
    this.locationsExists = this.form.controls['locationsExists'];
    this.location = this.form.controls['location'];
    this.lat = this.form.controls['lat'];
    this.lng = this.form.controls['lng'];
    this.expiredAt=this.form.controls['expiredAt'];
  }
  private initializeForm(){  
    if(this.inputService){
      if(this.inputService.expiredAt){
        //Get expiredAt on page load
        this.inputService.expiredAt=moment(this.inputService.expiredAt).tz("Europe/Madrid").format('YYYY-MM-DD HH:mm');
        var year=Number(this.inputService.expiredAt.split("-")[0]);
        var month=Number(this.inputService.expiredAt.split("-")[1]);
        var day=Number(this.inputService.expiredAt.split('-').pop().split(' ').shift());
        var hour=Number(this.inputService.expiredAt.split(' ').pop().split(':').shift());
        var minute=Number(this.inputService.expiredAt.split(':')[1]);
        var calendar= {year:year , month: month,day: day};
        this.expiredAt.setValue(calendar); 
        this.timeExpiredAt.hour=hour;
        this.timeExpiredAt.minute=minute;
      }else{
        this.expiredAt.setValue(undefined);
      }
      //Get lat on page load
      this.lat.setValue(this.inputService.place.coordinates.lat);
      //Get lng on page load
      this.lng.setValue(this.inputService.place.coordinates.lng);    
     
      //Get title and description
      var hasTranslation=false;
      for (var i = 0; i < this.inputService.translation.length; ++i) {
        if(this.inputService.translation[i].language===this.inputLanguage){
          hasTranslation=true;
          this.form.controls['title'].setValue(this.inputService.translation[i].title);
          this.form.controls['description'].setValue(this.inputService.translation[i].description);  
          this.imagesDescription=this.inputService.translation[i].images;
        }
      }
      if(!hasTranslation){
        if(this.inputService.language===this.inputLanguage){ 
          this.form.controls['title'].setValue(this.inputService.title);
          this.form.controls['description'].setValue(this.inputService.description);      
          this.imagesDescription=this.inputService.images;
        }
      }  
      //general place translation
      if(this.inputService.place.language===this.inputLanguage){
        this.locationsExists.setValue(this.inputService.place.location);  
      }else{
        for (var i = 0; i < this.inputService.place.translation.length; ++i) {
          if(this.inputService.place.translation[i].language===this.inputLanguage){
            this.locationsExists.setValue(this.inputService.place.translation[i].location);      
          }
        }    
      } 
      //Get serviceType
      this.form.controls['serviceType'].setValue(this.inputService.serviceType._id);   
      this.serviceTypeIcon=this.inputService.serviceType.icons[0].url;
      //Get provinces on page load
      this.placeService.getGeonamesJson('province',this.inputLanguage,'euskal-herria').subscribe(provincesService => {
        this.provincesService=provincesService.geonames;
        if(this.inputService.place.language===this.inputLanguage){
          this.province.setValue(this.inputService.place.province.name);    
        }else{
          var traductionProvince=false;
          for (var i = 0; i < this.inputService.place.translation.length; ++i) {
            if(this.inputService.place.translation[i].language===this.inputLanguage){
              traductionProvince=true
              this.province.setValue(this.inputService.place.translation[i].province.name);
            }
          } 
          if(!traductionProvince){         
            for (var i = 0; i < this.provincesService.length; ++i) { 
              if(this.provincesService[i].geonameId===this.inputService.place.province.geonameId){ 
                this.province.setValue(this.provincesService[i].name);          
              } 
            }   
          }
        }                        
      });  
      //Get municipality on page load      
      if(this.inputService.place.municipality){
        this.placeService.getGeonamesJson('municipality',this.inputLanguage,this.inputService.place.province.name.toLowerCase()).subscribe(municipalitiesService => {
          this.municipalitiesService=municipalitiesService.geonames;
          this.form.get('municipality').enable(); // Enable municipality field
          if(this.inputService.place.language===this.inputLanguage){
            //Location validation
            this.placeService.getPlacesCoordinates(this.inputService.place.province.name,this.inputService.place.municipality.name,this.inputLanguage).subscribe(data=>{
              if(data.success && data.places.length>0){
                this.locationsExistsService=data.places;
                this.location.setValidators([Validators.compose([Validators.maxLength(1000)])]);
                this.location.updateValueAndValidity(); //Need to call this to trigger a update
              }else{
                this.locationsExistsService=[];
                this.locationsExists.setValue("");
              }
            });
            this.municipality.setValue(this.inputService.place.municipality.name);  
          }else{
            var traductionProvince=false;
            for (var i = 0; i < this.inputService.place.translation.length; ++i) {
              if(this.inputService.place.translation[i].language===this.inputLanguage){
                traductionProvince=true
                this.municipality.setValue(this.inputService.place.translation[i].municipality.name);
                //Location validation
                this.placeService.getPlacesCoordinates(this.inputService.place.translation[i].province.name,this.inputService.place.translation[i].municipality.name,this.inputLanguage).subscribe(data=>{
                  if(data.success && data.places.length>0){
                    this.locationsExistsService=data.places;
                    this.location.setValidators([Validators.compose([Validators.maxLength(1000)])]);
                    this.location.updateValueAndValidity(); //Need to call this to trigger a update
                  }else{
                    this.locationsExistsService=[];
                    this.locationsExists.setValue("");
                  }
                }); 
              }
            } 
            if(!traductionProvince){
              for (var i = 0; i < this.municipalitiesService.length; ++i) { 
                if(this.municipalitiesService[i].geonameId===this.inputService.place.municipality.geonameId){ 
                  this.municipality.setValue(this.municipalitiesService[i].name);      
                }
              }                  
            } 
          }                  
        });        
      } 
      if(this.title.value && this.serviceType.value && this.inputService.place.coordinates.lat && this.inputService.place.coordinates.lng){
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
  private enableFormNewServiceForm() {
    this.form.enable(); // Enable form
    $('#textareaDescription').froalaEditor('edit.on');
    this.froalaEvent.getEditor()('html.set', '');
  }

  // Disable new categories form
  private disableFormNewServiceForm() {
    this.form.disable(); // Disable form
    $('#textareaDescription').froalaEditor('edit.off');
  }
  private deleteUploadImages(type,images){
    if(type==='descriptionOne'){
      var currentUrlSplit = images[0].currentSrc.split("/");
      let imageName = currentUrlSplit[currentUrlSplit.length - 1];
      var urlSplit = imageName.split("%2F");
      for (var i = 0; i < this.imagesDescription.length; i++) {
        if(this.imagesDescription[i]===images[0].currentSrc){
          this.imagesDescription.splice(i,1);
          this.service.setImagesDescription=this.imagesDescription;
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
    this.fileUploaderService.getSignatureFroala("service-description",this.localizeService.parser.currentLang).subscribe(data=>{
      if(data.success){
        this.froalaOptions.imageUploadToS3=data.options
        initControls.initialize();
      }
    });
    setTimeout(() => {
      $('#textareaDescription'+this.inputLanguage).on('froalaEditor.image.inserted', function (e, editor, $img, response) {
        // Do something here.
        context.imagesDescription.push($img[0].currentSrc);
        context.service.setImagesDescription=context.imagesDescription;
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
  private editService(){
    var hasTranslationService=false;
    var hasTranslationPlace=false; 
    this.inputService.serviceTypeId=this.form.get('serviceType').value;
    this.inputService.expiredAt=new Date(this.form.get('expiredAt').value.year,this.form.get('expiredAt').value.month-1,this.form.get('expiredAt').value.day,this.timeExpiredAt.hour,this.timeExpiredAt.minute);
    if(this.selectedPlace){
      this.inputService.place=this.selectedPlace;
    }else if(this.inputService.place.province.name!==this.province || this.inputService.place.municipality.name!==this.municipality|| this.inputService.place.location!==this.location){
      this.inputService.place.translation=[];
    }
    this.inputService.place.coordinates.lat=Number(this.form.get('lat').value); // Lat field
    this.inputService.place.coordinates.lng=Number(this.form.get('lng').value); // Lng field
    //service translation
    for (var i = 0; i < this.inputService.translation.length; ++i) {
      if(this.inputService.translation[i].language===this.inputLanguage){
        hasTranslationService=true;
        this.inputService.translation[i].language=this.inputLanguage;
        this.inputService.translation[i].createdBy=this.authService.user.username;// Language field  
        this.inputService.translation[i].title=this.form.get('title').value;
        this.inputService.translation[i].description=this.form.get('description').value;
        this.inputService.translation[i].images.description=this.imagesDescription;
      }
    }
    //place translation
    for (var i = 0; i < this.inputService.place.translation.length; ++i) {
      if(this.inputService.place.translation[i].language===this.inputLanguage){
        hasTranslationPlace=true;
        this.inputService.place.translation[i].province.name=this.form.get('province').value; // Province field
        this.inputService.place.translation[i].municipality.name=this.form.get('municipality').value; // Municipality field
        if(this.form.get('location').value){
          this.inputService.place.translation[i].location=this.form.get('location').value; //Location field,
        }else if(this.form.get('locationsExists').value){
          this.inputService.place.translation[i].location=this.form.get('locationsExists').value; //Location exists field,
        }
      }
    }
    if(!hasTranslationService){
      if(this.inputService.language===this.inputLanguage){
        this.inputService.language=this.inputLanguage, 
        this.inputService.createdBy=this.authService.user.username;       
        this.inputService.title=this.form.get('title').value;
        this.inputService.description=this.form.get('description').value;
        this.inputService.images.description=this.imagesDescription;
      }else{
        var translationObj={
          language:this.inputLanguage,
          createdBy:this.authService.user.username,
          title:this.form.get('title').value,
          description:this.form.get('description').value,
          images:this.imagesDescription
        }
        this.inputService.translation.push(translationObj);             
      }
    }
    if(!hasTranslationPlace){
      //if place has original language and not has translation
      if(this.inputService.place.language===this.inputLanguage){
        this.inputService.place.province.name=this.form.get('province').value; // Province field
        this.inputService.place.municipality.name=this.form.get('municipality').value; // Municipality field
        if(this.place.geonameIdProvince){
          this.inputService.place.province.geonameId=this.place.geonameIdProvince;
        }
        if(this.place.geonameIdMunicipality){
          this.inputService.place.municipality.geonameId=this.place.geonameIdMunicipality;
        }
        if(this.form.get('location').value){
          this.inputService.place.location=this.form.get('location').value; //Location field,
        }else if(this.form.get('locationsExists').value){
          this.inputService.place.location=this.form.get('locationsExists').value; //Location exists field,
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
          location:this.form.get('location').value
        }
        this.inputService.place.translation.push(placeTranslationObj);           
      }
    }
    this.serviceService.editService(this.inputService).subscribe(data=>{
      if(data.success){
        this.messageClass = 'alert alert-success ks-solid '; // Set bootstrap success class
        this.message =data.message; // Set success message            
      }else{
        this.deleteUploadImages('descriptionAll',this.imagesDescription);
        this.enableFormNewServiceForm();
        this.messageClass = 'alert alert-danger ks-solid'; // Set bootstrap error class
        this.message =data.message; // Set error message
      } 
    }); 
  }
  public onSelectedServiceType(index){
    if(index===-1){
      this.form.controls['serviceType'].setValue("");
    }else{
      //set icon map
      this.serviceTypeIcon=this.serviceTypes[index].icons[0].url;
    }
  }
  // Function on seleccted service province
  public onSelectedProvince(index){
    if (index===-1){
      this.form.get('municipality').disable(); // Disable municipality field
    }else{
      this.form.get('municipality').enable(); // Enable municipality field
      this.placeService.getGeonamesJson('municipality',this.localizeService.parser.currentLang,this.provincesService[index].toponymName.toLowerCase()).subscribe(municipalitiesService => {
        this.place.setGeonameIdProvince=this.provincesService[index].geonameId;
        this.municipalitiesService=municipalitiesService.geonames;
      });
    }
    this.form.controls['municipality'].setValue("");
  }
  // Function on seleccted service municipality
  public onSelectedMunicipality(index){
    if(index!==-1){
      var coordinates={
        lat:this.municipalitiesService[index].lat,
        lng:this.municipalitiesService[index].lng
      }
      this.placeService.getPlacesCoordinates(this.form.get('province').value,this.form.get('municipality').value,this.localizeService.parser.currentLang).subscribe(data=>{
        if(data.success && data.places.length>0){
          this.locationsExistsService=data.places;
        }else{
          this.locationsExistsService=[];
        }
      });
      this.form.controls['locationsExists'].setValue("");
      this.passCoordinates(coordinates);
      this.place.setGeonameIdMunicipality=this.municipalitiesService[index].geonameId;
    }
  }
     // Function on seleccted locations exists
  private onSelectedLocationsExists(index){
     if (index===-1){
      this.locationsExists.setValidators([Validators.compose([Validators.maxLength(1000)])]);
      this.locationsExists.updateValueAndValidity(); //Need to call this to trigger a update
    }else{
      var coordinates={
        lat:this.locationsExistsService[index].coordinates.lat,
        lng:this.locationsExistsService[index].coordinates.lng
      }
      this.passCoordinates(coordinates);
      this.location.setValidators([Validators.compose([Validators.maxLength(1000)])]);
      this.location.updateValueAndValidity(); //Need to call this to trigger a update
      this.selectedPlace=this.locationsExistsService[index];
    }
  }
  private chargeAll(){
   
    //Get provinces on page load
    if(this.inputOperation==='create'){
      //Get service types
      this.serviceTypeService.getServiceTypes(this.localizeService.parser.currentLang).subscribe(data=>{
        if(data.success){
          this.serviceTypes=data.serviceTypes;
        }   
      });
      this.placeService.getGeonamesJson('province',this.localizeService.parser.currentLang,'euskal-herria').subscribe(provincesService => {
        this.provincesService=provincesService.geonames;
      });
    }else if(this.inputOperation==="edit"){
       //Get service types
      this.serviceTypeService.getServiceTypes(this.inputLanguage).subscribe(data=>{
        if(data.success){
          this.serviceTypes=data.serviceTypes;
        }   
      });
    }
  }
  public passCoordinates(defaultCoordinates){
    if (defaultCoordinates){
      var market_info={
        title:this.form.get('title').value,
        icon:this.serviceTypeIcon, // Icon field
        lat:defaultCoordinates.lat, // Lat field
        lng:defaultCoordinates.lng, // Lng field
      }
      this.lat.setValue(defaultCoordinates.lat);
      this.lng.setValue(defaultCoordinates.lng);
    }else{
      var market_info={
        title:this.form.get('title').value,
        icon:this.serviceTypeIcon, // Icon field
        lat:this.form.get('lat').value, // Lat field
        lng:this.form.get('lng').value, // Lng field
      }
    }  
    this.observableService.mapType="create-categories-coordinates";
    this.observableService.notifyOther({option: this.observableService.mapType, value: market_info});
  }
 
  public onSubmit(){
    if (this.form.valid) {
      if(this.inputOperation==="create"){
        this.submitted = true;
        //this.disableForm();
        this.service.setLanguage=this.localizeService.parser.currentLang,
        this.service.createdBy=this.authService.user.username; // CreatedBy field 
        this.service.setServiceTypeId=this.form.get('serviceType').value;
        this.service.setTitle=this.form.get('title').value;
        this.service.setDescription=this.form.get('description').value;
        this.service.setExpiredAt=new Date(this.form.get('expiredAt').value.year,this.form.get('expiredAt').value.month-1,this.form.get('expiredAt').value.day,this.timeExpiredAt.hour,this.timeExpiredAt.minute);
        this.place.setProvince=this.form.get('province').value; // Province field
        this.place.setMunicipality=this.form.get('municipality').value; // Municipality field
        if(this.form.get('location').value){
          this.place.setLocation=this.form.get('location').value; //Location field,
        }else if(this.form.get('locationsExists').value){
          this.place.setLocation=this.form.get('locationsExists').value; //Location exists field,
        }
        this.place.setLat=Number(this.form.get('lat').value); // Lat field
        this.place.setLng=Number(this.form.get('lng').value); // Lng field
        this.serviceService.newService(this.service,this.place).subscribe(data=>{
          if(!data.success){
            this.messageClass='alert alert-danger ks-solid';
            this.message=data.message
            this.enableFormNewServiceForm();
          }else{
            this.submitted = false;
            this.service=new Service();
            this.createForm(); // Reset all form fields
            this.messageClass='alert alert-success ks-solid'
            this.message=data.message
          }
        });
      }else{
        this.editService();
      }
      
    }                
  }
  ngOnInit() {
    /*$('textarea').each(function () {
      this.setAttribute('style', 'height:' + (this.scrollHeight) + 'px;overflow-y:hidden;');
    }).on('input', function () {
      this.style.height = (this.scrollHeight) + 'px';
    });*/
    this.initializeForm();
    this.mapClickPlace();
    // Get profile username on page load
    this.authService.getAuthentication(this.localizeService.parser.currentLang).subscribe(authentication => {
      if(!authentication.success){
        this.authService.logout();
        this.authGuard.redirectUrl=this.router.url;
        this.router.navigate([this.localizeService.translateRoute('/sign-in-route')]); // Return error and route to login page
      }
    });
    this.location.valueChanges.subscribe(data=>{
      if(data===''){
        this.locationsExists.setValidators([Validators.compose([Validators.required,Validators.maxLength(1000)])]);
        this.locationsExists.updateValueAndValidity(); //Need to call this to trigger a update
      }else{
        this.locationsExists.setValidators([Validators.compose([Validators.maxLength(1000)])]);
        this.locationsExists.updateValueAndValidity(); //Need to call this to trigger a update
      }
    });
    this.form.get('municipality').disable(); // Disable municipality field
    this.chargeAll();
    this.subscriptionLanguage =this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.localizeService.parser.currentLang=event.lang;
        this.chargeAll();
    }); 	  
  }
}
