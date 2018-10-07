import { Component, OnInit,ElementRef,Injectable,Input,Output,EventEmitter } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import { LocalizeRouterService } from 'localize-router';
import { AuthService } from '../../../services/auth.service';
import { ObservationService } from '../../../services/observation.service';
import { ObservableService } from '../../../services/observable.service';
import { TranslateService,LangChangeEvent } from '@ngx-translate/core';
import { FileUploaderService} from '../../../services/file-uploader.service';
import { LatitudeValidator,LongitudeValidator } from '../../../validators';
import { Observation } from '../../../class/observation';
import { Subscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';
import { AuthGuard} from '../../../pages/guards/auth.guard';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateModalComponent } from '../../../templates/modals/create-modal/create-modal.component';
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
  @Output() RefreshObservation = new EventEmitter();
  constructor(
    private fb: FormBuilder,
    private localizeService:LocalizeRouterService,
    private observationService:ObservationService,
    private observableService:ObservableService,
    private fileUploaderService:FileUploaderService,
    private authService:AuthService,
    private translate: TranslateService,
    private router:Router,
    private authGuard: AuthGuard,
    private modalService: NgbModal){
    this.createForm(); // Create new theme form on start up
    }
    // Function to create new theme form
  private createForm() {
    this.form = this.fb.group({
      title: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(35),
        Validators.minLength(3)
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
  private staticModalShow(success,operation,id) {
    const activeModal = this.modalService.open(CreateModalComponent, {backdrop: 'static',keyboard: false, centered: true});
    this.translate.get('modal.'+operation+'-observation-header').subscribe(
      data => {   
      activeModal.componentInstance.modalHeader = data;
    });
    activeModal.componentInstance.operation = operation;
    activeModal.componentInstance.modalContent = this.message; 
    if(operation==="create"){
      activeModal.componentInstance.route=this.localizeService.translateRoute('/observation-route')+"/"+this.localizeService.translateRoute('manage-route')+"/"+this.localizeService.translateRoute('edit-route')+"/"+id;
    }else if(operation==="edit"){
      activeModal.componentInstance.route=this.localizeService.translateRoute('/observation-route')+"/"+this.localizeService.translateRoute('manage-route');
    }
    if(success){
      activeModal.componentInstance.modalImage="assets/img/defaults/create-modal/success.svg";
    }else{
      activeModal.componentInstance.modalImage="assets/img/defaults/create-modal/error.svg";
    }       
  } 
  public froalaOptions= {
     // Set max image size to 10MB.
    imageMaxSize: 10 * 1024 * 1024,
    // Allow to upload PNG and JPG.
    imageAllowedTypes: ['jpeg', 'jpg', 'png','gif'],
    charCounterMax: 20000,
    imageUploadToS3: undefined,
    videoUpload: false,
    imageInsertButtons:['imageUpload','imageByURL'],
    toolbarButtons: ['fullscreen', 'bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', '|', 'fontFamily', 'fontSize', 'color', 'inlineStyle', 'paragraphStyle', '|', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', 'quote', '-', 'insertLink', 'insertImage', 'insertVideo', 'insertTable', '|', 'emoticons', 'specialCharacters', 'insertHR', 'selectAll', 'clearFormatting', '|', 'print', 'help', 'html', '|', 'undo', 'redo']
  }
  public initializeFroala(initControls) {
    this.froalaEvent=initControls;
    var context=this;
    this.fileUploaderService.getSignatureFroala("observation-description",this.localizeService.parser.currentLang).subscribe(data=>{
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
        this.inputObservation.translation[i].createdBy=this.authService.user.id;// Language field  
        this.inputObservation.translation[i].title=this.form.get('title').value;
        this.inputObservation.translation[i].description=this.form.get('description').value;
        this.inputObservation.translation[i].images.description=this.imagesDescription;
      }
    }
    if(!hasTranslationObservation){
      if(this.inputObservation.language===this.inputLanguage){
        this.inputObservation.language=this.inputLanguage, 
        this.inputObservation.createdBy=this.authService.user.id;       
        this.inputObservation.title=this.form.get('title').value;
        this.inputObservation.description=this.form.get('description').value;
        this.inputObservation.images.description=this.imagesDescription;
      }else{
        var translationObj={
          language:this.inputLanguage,
          createdBy:this.authService.user.id,
          title:this.form.get('title').value,
          description:this.form.get('description').value,
          images:this.imagesDescription
        }
        this.inputObservation.translation.push(translationObj);             
      }
    }
    this.observationService.editObservation(this.inputObservation).subscribe(data=>{
      if(data.success){
        this.messageClass = 'alert alert-success ks-solid '; // Set bootstrap success class
        this.message =data.message; // Set success message    
        this.staticModalShow(true,'edit',this.inputObservation._id);
        this.RefreshObservation.emit({service: this.inputObservation }); 
        this.submitted = false;         
      }else{
        this.deleteUploadImages('descriptionAll',this.imagesDescription);
        this.enableFormNewObservationForm();
        this.messageClass = 'alert alert-danger ks-solid'; // Set bootstrap error class
        this.message =data.message; // Set error message
        this.staticModalShow(false,'edit',this.inputObservation._id);
      } 
    }); 
  }
   
  public onSubmit(){
    if (this.form.valid) {
      if(this.inputOperation==="create"){
        this.submitted = true;
        //this.disableForm();
        this.observation.setLanguage=this.localizeService.parser.currentLang,
        this.observation.createdBy=this.authService.user.id; // CreatedBy field 
        this.observation.setTitle=this.form.get('title').value;
        this.observation.setDescription=this.form.get('description').value;
        this.observation.setExpiredAt=new Date(this.form.get('expiredAt').value.year,this.form.get('expiredAt').value.month-1,this.form.get('expiredAt').value.day,this.timeExpiredAt.hour,this.timeExpiredAt.minute);
        this.observationService.newObservation(this.observation).subscribe(data=>{
          if(!data.success){
            this.messageClass='alert alert-danger ks-solid';
            this.message=data.message
            this.enableFormNewObservationForm();
            this.staticModalShow(false,'create',data.observation._id);
          }else{
            this.submitted = false;
            this.observation=new Observation();
            this.createForm(); // Reset all form fields
            this.messageClass='alert alert-success ks-solid'
            this.message=data.message
            this.staticModalShow(true,'create',data.observation._id);
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
    this.subscriptionLanguage =this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.localizeService.parser.currentLang=event.lang;
    }); 	  
  }
}
