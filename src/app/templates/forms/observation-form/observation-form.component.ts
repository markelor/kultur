import { Component, OnInit,ElementRef,Injectable,Input } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import { LocalizeRouterService } from 'localize-router';
import { AuthService } from '../../../services/auth.service';
import { ObservationService } from '../../../services/observation.service';
import { ObservableService } from '../../../services/observable.service';
import { TranslateService,LangChangeEvent } from '@ngx-translate/core';
import { FileUploaderService} from '../../../services/file-uploader.service';
import { TitleValidator,LatitudeValidator,LongitudeValidator } from '../../../validators';
import { Observation } from '../../../class/observation';
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
  selector: 'app-observation-form',
  templateUrl: './observation-form.component.html',
  styleUrls: ['./observation-form.component.css'],
  providers: [{provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n}] // define custom NgbDatepickerI18n provider
})
export class ObservationFormComponent implements OnInit {
  public message;
  public messageClass;
  public submitted:boolean = false;
  public form:FormGroup;
  @Input() inputOperation:string;
  @Input() inputObservation;
  @Input() inputLanguage;
  private imagesDescription=[];
  public title:AbstractControl;
  public description:AbstractControl;
  public expiredAt:AbstractControl;
  public timeExpiredAt = {hour: 13, minute: 30};
  public observation:Observation=new Observation();
  private froalaSignature;
  private froalaEvent;
  private subscriptionLanguage: Subscription;
  constructor(
    private fb: FormBuilder,
    private localizeObservation:LocalizeRouterService,
    private observationObservation:ObservationService,
    private observableObservation:ObservableService,
    private fileUploaderObservation:FileUploaderService,
    private authObservation:AuthService,
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
      expiredAt: [''],

    })
    this.title = this.form.controls['title'];
    this.description= this.form.controls['description'];
    this.expiredAt=this.form.controls['expiredAt'];
  }
    // Enable new categories form
  private enableFormNewObservationForm() {
    this.form.enable(); // Enable form
    $('#textareaDescription').froalaEditor('edit.on');
    this.froalaEvent.getEditor()('html.set', '');
  }

  // Disable new categories form
  private disableFormNewObservationForm() {
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
          this.observation.setImagesDescription=this.imagesDescription;
        }
      }
      this.fileUploaderObservation.deleteImages(urlSplit[1],urlSplit[0],this.localizeObservation.parser.currentLang).subscribe(data=>{
      });
    }else if (type==='descriptionAll'){
      for (var i = 0; i < this.imagesDescription.length; i++) {
        var currentUrlSplit = this.imagesDescription[i].split("/");
        let imageName = currentUrlSplit[currentUrlSplit.length - 1];
        var urlSplit = imageName.split("%2F");
        this.fileUploaderObservation.deleteImages(urlSplit[1],urlSplit[0],this.localizeObservation.parser.currentLang).subscribe(data=>{
        });
      }
    }
  }
  private initializeForm(){  
    if(this.inputObservation){
      if(this.inputObservation.expiredAt){
        //Get expiredAt on page load
        this.inputObservation.expiredAt=moment(this.inputObservation.expiredAt).tz("Europe/Madrid").format('YYYY-MM-DD HH:mm');
        var year=Number(this.inputObservation.expiredAt.split("-")[0]);
        var month=Number(this.inputObservation.expiredAt.split("-")[1]);
        var day=Number(this.inputObservation.expiredAt.split('-').pop().split(' ').shift());
        var hour=Number(this.inputObservation.expiredAt.split(' ').pop().split(':').shift());
        var minute=Number(this.inputObservation.expiredAt.split(':')[1]);
        var calendar= {year:year , month: month,day: day};
        this.expiredAt.setValue(calendar); 
        this.timeExpiredAt.hour=hour;
        this.timeExpiredAt.minute=minute;
      }else{
          this.expiredAt.setValue(undefined);
      }     
      //Get title and description
      var hasTranslation=false;
      for (var i = 0; i < this.inputObservation.translation.length; ++i) {
        if(this.inputObservation.translation[i].language===this.inputLanguage){
          hasTranslation=true;
          this.form.controls['title'].setValue(this.inputObservation.translation[i].title);
          this.form.controls['description'].setValue(this.inputObservation.translation[i].description);  
          this.imagesDescription=this.inputObservation.translation[i].images;
        }
      }
      if(!hasTranslation){
        if(this.inputObservation.language===this.inputLanguage){ 
          this.form.controls['title'].setValue(this.inputObservation.title);
          this.form.controls['description'].setValue(this.inputObservation.description);      
          this.imagesDescription=this.inputObservation.images;
        }
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
    this.fileUploaderObservation.getSignatureFroala("observation-description",this.localizeObservation.parser.currentLang).subscribe(data=>{
      if(data.success){
        this.froalaOptions.imageUploadToS3=data.options
        initControls.initialize();
      }
    });
    setTimeout(() => {
      $('#textareaDescription'+this.inputLanguage).on('froalaEditor.image.inserted', function (e, editor, $img, response) {
        // Do something here.
        context.imagesDescription.push($img[0].currentSrc);
        context.observation.setImagesDescription=context.imagesDescription;
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
  private editObservation(){
    var hasTranslationObservation=false;
    var hasTranslationPlace=false; 
    this.inputObservation.expiredAt=new Date(this.form.get('expiredAt').value.year,this.form.get('expiredAt').value.month-1,this.form.get('expiredAt').value.day,this.timeExpiredAt.hour,this.timeExpiredAt.minute);
    //observation translation
    for (var i = 0; i < this.inputObservation.translation.length; ++i) {
      if(this.inputObservation.translation[i].language===this.inputLanguage){
        hasTranslationObservation=true;
        this.inputObservation.translation[i].language=this.inputLanguage;
        this.inputObservation.translation[i].createdBy=this.authObservation.user.username;// Language field  
        this.inputObservation.translation[i].title=this.form.get('title').value;
        this.inputObservation.translation[i].description=this.form.get('description').value;
        this.inputObservation.translation[i].images.description=this.imagesDescription;
      }
    }
    if(!hasTranslationObservation){
      if(this.inputObservation.language===this.inputLanguage){
        this.inputObservation.language=this.inputLanguage, 
        this.inputObservation.createdBy=this.authObservation.user.username;       
        this.inputObservation.title=this.form.get('title').value;
        this.inputObservation.description=this.form.get('description').value;
        this.inputObservation.images.description=this.imagesDescription;
      }else{
        var translationObj={
          language:this.inputLanguage,
          createdBy:this.authObservation.user.username,
          title:this.form.get('title').value,
          description:this.form.get('description').value,
          images:this.imagesDescription
        }
        this.inputObservation.translation.push(translationObj);             
      }
    }
    this.observationObservation.editObservation(this.inputObservation).subscribe(data=>{
      if(data.success){
        this.messageClass = 'alert alert-success ks-solid '; // Set bootstrap success class
        this.message =data.message; // Set success message            
      }else{
        this.deleteUploadImages('descriptionAll',this.imagesDescription);
        this.enableFormNewObservationForm();
        this.messageClass = 'alert alert-danger ks-solid'; // Set bootstrap error class
        this.message =data.message; // Set error message
      } 
    }); 
  }
   
  public onSubmit(){
    if (this.form.valid) {
      if(this.inputOperation==="create"){
        this.submitted = true;
        //this.disableForm();
        this.observation.setLanguage=this.localizeObservation.parser.currentLang,
        this.observation.createdBy=this.authObservation.user.username; // CreatedBy field 
        this.observation.setTitle=this.form.get('title').value;
        this.observation.setDescription=this.form.get('description').value;
        this.observation.setExpiredAt=new Date(this.form.get('expiredAt').value.year,this.form.get('expiredAt').value.month-1,this.form.get('expiredAt').value.day,this.timeExpiredAt.hour,this.timeExpiredAt.minute);
        this.observationObservation.newObservation(this.observation).subscribe(data=>{
          if(!data.success){
            this.messageClass='alert alert-danger ks-solid';
            this.message=data.message
            this.enableFormNewObservationForm();
          }else{
            this.submitted = false;
            this.observation=new Observation();
            this.createForm(); // Reset all form fields
            this.messageClass='alert alert-success ks-solid'
            this.message=data.message
          }
        });
      }else{
        this.editObservation();
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
    // Get profile username on page load
    this.authObservation.getAuthentication(this.localizeObservation.parser.currentLang).subscribe(authentication => {
      if(!authentication.success){
        this.authObservation.logout();
        this.authGuard.redirectUrl=this.router.url;
        this.router.navigate([this.localizeObservation.translateRoute('/sign-in-route')]); // Return error and route to login page
      }
    });
    this.subscriptionLanguage =this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.localizeObservation.parser.currentLang=event.lang;
    }); 	  
  }
}
