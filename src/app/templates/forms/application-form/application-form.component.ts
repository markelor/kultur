import { Component, OnInit,Injectable,Input } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import { LocalizeRouterService } from 'localize-router';
import { AuthService } from '../../../services/auth.service';
import { ApplicationService } from '../../../services/application.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
//import { ApplicationModalComponent } from './application-modal/application-modal.component';
import { ModalComponent } from '../../../templates/modal/modal.component';
import { ObservableService } from '../../../services/observable.service';
import { TitleValidator } from '../../../validators';
import { Application } from '../../../class/application';
import { Subject } from 'rxjs/Subject';
import { FileUploaderService} from '../../../services/file-uploader.service';
import { FileUploader,FileUploaderOptions,FileItem } from 'ng2-file-upload';
import { AuthGuard} from '../../../pages/guards/auth.guard';
import * as moment from 'moment-timezone';
const URL = 'http://localhost:8080/fileUploader/uploadImages/application';
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
  selector: 'app-application-form',
  templateUrl: './application-form.component.html',
  styleUrls: ['./application-form.component.css'],
  providers: [{provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n}] // define custom NgbDatepickerI18n provider
})
export class ApplicationFormComponent implements OnInit {
  public message;
  private messageClass;
  public submitted:boolean = false;
  private parentCategories;
  public form:FormGroup;
  @Input() inputOperation:string;
  @Input() inputApplication;
  @Input() inputLanguage;
  public title:AbstractControl;
  public entityName:AbstractControl;
  public user:AbstractControl;
  public license:AbstractControl;
  public condition:AbstractControl;
  public price:AbstractControl;
  public expiredAt:AbstractControl;
  public timeExpiredAt = {hour: 13, minute: 30};
  private categories;
  private application:Application=new Application();
  private imagesApplication=[];
  public search:boolean=true;
  public usersSearch;
  public selectedUsers=[];
  public conditions=[];
  public searchTerm = new Subject<string>();
  public uploader:FileUploader = new FileUploader({
    url: URL,itemAlias: 'application',
    isHTML5: true,
    allowedMimeType: ['image/png', 'image/jpg', 'image/jpeg', 'image/gif'],
    maxFileSize: 10*1024*1024 // 10 MB
  });
  private uploadAllSuccess:Boolean=true;
  private uploadOptions;
  private hasBaseDropZoneOver:boolean = false;
  private hasAnotherDropZoneOver:boolean = false;
  constructor(
    private fb: FormBuilder,
    private localizeService:LocalizeRouterService,
    private applicationService:ApplicationService,
    private authService:AuthService,
    private fileUploaderService:FileUploaderService,
    private observableService:ObservableService,
    private router:Router,
    private authGuard: AuthGuard,
    private translate: TranslateService){
    this.createForm(); // Create new theme form on start up
    }
    // Function to create new theme form
  private createForm() {
    this.form = this.fb.group({
      title: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(30),
        Validators.minLength(5),
        TitleValidator.validate
      ])],
      entityName: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(35),
        Validators.minLength(5),
        TitleValidator.validate
      ])],
      user: [''],
      license: ['', Validators.compose([
        Validators.required/*,DateValidator.validate*/
      ])],
      condition: [''],
      price: ['', Validators.compose([
        Validators.required,
      ])],
      expiredAt: ['', Validators.compose([
        Validators.required/*,DateValidator.validate*/
      ])],
    })
    this.title = this.form.controls['title'];
    this.entityName = this.form.controls['entityName'];
    this.user = this.form.controls['user'];
    this.license= this.form.controls['license'];
    this.condition= this.form.controls['condition'];
    this.price = this.form.controls['price'];
    this.expiredAt=this.form.controls['expiredAt'];
  }

  private initializeForm(){
    if(this.inputApplication){
      if(this.inputApplication.language===this.inputLanguage){
        this.title.setValue(this.inputApplication.title);
        this.entityName.setValue(this.inputApplication.entityName);
        this.license.setValue(this.inputApplication.licenseName);
        this.conditions=this.inputApplication.conditions;
      }else{
        for (var i = 0; i < this.inputApplication.translation.length; ++i) {
          if(this.inputApplication.translation[i].language===this.inputLanguage){
            this.title.setValue(this.inputApplication.translation[i].title);
            this.entityName.setValue(this.inputApplication.translation[i].entityName);
            this.license.setValue(this.inputApplication.translation[i].licenseName);
            this.conditions=this.inputApplication.translation[i].conditions;
          }
        }               
      }
      this.selectedUsers=this.inputApplication.users;     
      this.price.setValue(this.inputApplication.price);
      this.inputApplication.expiredAt=moment(this.inputApplication.expiredAt).tz("Europe/Madrid").format('YYYY-MM-DD HH:mm');
      var year=Number(this.inputApplication.expiredAt.split("-")[0]);
      var month=Number(this.inputApplication.expiredAt.split("-")[1]);
      var day=Number(this.inputApplication.expiredAt.split('-').pop().split(' ').shift());
      var hour=Number(this.inputApplication.expiredAt.split(' ').pop().split(':').shift());
      var minute=Number(this.inputApplication.expiredAt.split(':')[1]);
      var calendar= {year:year , month: month,day: day};
      this.expiredAt.setValue(calendar);
      this.timeExpiredAt.hour=hour;
      this.timeExpiredAt.minute=minute; 

      this.imagesApplication=this.inputApplication.images;
      for (var z = 0; z < this.imagesApplication.length; ++z) {
        let file = new File([],decodeURIComponent(this.inputApplication.images[z].url).split('https://s3.eu-west-1.amazonaws.com/culture-bucket/application/')[1]);
        let fileItem = new FileItem(this.uploader, file, {});
        fileItem.file.size=this.inputApplication.images[z].size;
        fileItem.progress = 100;
        fileItem.isUploaded = true;
        fileItem.isSuccess = true;
        this.uploader.queue.push(fileItem);   
      } 
    }   
  }
  // Function to disable the registration form
  private disableForm(){
    this.form.disable(); // Disable form
  }
   // Function to enable the registration form
   private enableForm(){
    this.form.enable(); // Enable form
  }
  private deleteUploadImages(type,images){
    if(type==='application'){
      for (var i = 0; i < images.length; ++i) {
        var currentUrlSplit = images[i].url.split("/");
        let imageName = currentUrlSplit[currentUrlSplit.length - 1];
        console.log(imageName);
        var urlSplit = imageName.split("%2F");
        this.fileUploaderService.deleteImages(urlSplit[0],"application",this.localizeService.parser.currentLang).subscribe(data=>{
        });
      }
    }
  }
  public onSubmit(){
    if (this.form.valid) {
      this.submitted = true;
      this.application.setLanguage=this.localizeService.parser.currentLang;
      this.application.setUsers=this.selectedUsers;
      this.application.setTitle=this.form.get('title').value;
      this.application.setEntityName=this.form.get('entityName').value;
      this.application.setConditions=this.conditions;
      this.application.setLicenseName=this.form.get('license').value;
      this.application.setPrice=Number(this.form.get('price').value);
      this.application.setExpiredAt=new Date(this.form.get('expiredAt').value.year,this.form.get('expiredAt').value.month-1,this.form.get('expiredAt').value.day,this.timeExpiredAt.hour,this.timeExpiredAt.minute);
      if(this.uploader.queue.length>0){
        this.uploader.uploadAll();
        if(this.uploader.queue[0].isUploaded){
          this.editApplication();
        }
      }else{
        if(this.inputOperation==='create'){
          this.createApplication();
        }else if(this.inputOperation==='edit'){
          this.editApplication();
        }      
      }
    }   
  }
  private createApplication() {
    // Function to save application into database
    this.applicationService.newApplication(this.application).subscribe(data=>{
      if(!data.success){
        this.deleteUploadImages('application',this.imagesApplication);
        this.submitted = false;
        this.messageClass='alert alert-danger ks-solid';
        this.message=data.message
        this.enableForm();
      }else{
        this.submitted = false;
        this.uploader.clearQueue()//Reset uploader
        this.conditions=[];
        this.createForm(); // Reset all form fields
        this.usersSearch=[];
        this.conditions=[];
        this.messageClass='alert alert-success ks-solid'
        this.message=data.message
      }
    });
  }
  private deleteEditImages(){
     //see delete images
    var deleteImages=[];
    for (var i = 0; i < this.imagesApplication.length; ++i) {
      let file = new File([],decodeURIComponent(this.imagesApplication[i].url).split('https://s3.eu-west-1.amazonaws.com/culture-bucket/application/')[1]);
      let fileItem = new FileItem(this.uploader, file, {});
      if(this.uploader.queue.some(e => e.file.name !== fileItem.file.name)){
        deleteImages.push(this.imagesApplication[i]);
        this.imagesApplication.splice(i,1);            
      }
    }
    if(deleteImages.length>0){
      this.deleteUploadImages('application',deleteImages);
    }
  }
  private editApplication() {
    if(this.inputApplication){
      var hasTranslationApplication=false;
      this.inputApplication.users=this.selectedUsers; // Users field   
      this.inputApplication.price=this.form.get('price').value; // Price field
      this.inputApplication.expiredAt=new Date(this.form.get('expiredAt').value.year,this.form.get('expiredAt').value.month-1,this.form.get('expiredAt').value.day,this.timeExpiredAt.hour,this.timeExpiredAt.minute);
      this.deleteEditImages();   
      //application translation
      for (var i = 0; i < this.inputApplication.translation.length; ++i) {
        if(this.inputApplication.translation[i].language===this.inputLanguage){
          hasTranslationApplication=true;
          this.inputApplication.translation[i].language=this.inputLanguage;// Language field        
          this.inputApplication.translation[i].title=this.form.get('title').value; // Title field
          this.inputApplication.translation[i].entityName= this.form.get('entityName').value; // Entity Name field
          this.inputApplication.translation[i].licenseName=this.form.get('license').value; // License Name field
          this.inputApplication.translation[i].conditions=this.conditions;// Conditions field
        }
      }

      if(!hasTranslationApplication){
        //if application has original language and not has translation
        if(this.inputApplication.language===this.inputLanguage){
          this.inputApplication.language=this.inputLanguage;// Language field        
          this.inputApplication.title=this.form.get('title').value; // Title field
          this.inputApplication.entityName= this.form.get('entityName').value; // Entity Name field
          this.inputApplication.licenseName=this.form.get('license').value; // License Name field
          this.inputApplication.conditions=this.conditions;// Conditions field  
        }else{
          //application push new translation
          var applicationTranslationObj={
            language:this.inputLanguage,
            title:this.form.get('title').value,
            entityName:this.form.get('entityName').value,
            licenseName:this.form.get('license').value,
            conditions:this.conditions
          }
          this.inputApplication.translation.push(applicationTranslationObj);        
        }
      }
    }
    console.log(this.inputApplication);
    // Function to save event into database
    this.applicationService.editApplication(this.inputApplication).subscribe(data => {
      // Check if event was saved to database or not
      if (!data.success) {
        this.deleteUploadImages('application',this.imagesApplication);
        this.messageClass = 'alert alert-danger ks-solid'; // Return error class
        this.message = data.message; // Return error message
        this.submitted = true; // Enable submit button
      } else {
        this.messageClass = 'alert alert-success ks-solid'; // Return success class
        this.message = data.message; // Return success message
        // Clear form data after two seconds
        setTimeout(() => {
          //this.newPost = false; // Hide form
          this.submitted = false; // Enable submit button
          this.message = false; // Erase error/success message
        }, 2000);
      }
    });   
  }
  public addUser(){
    if(this.user.value && !this.selectedUsers.includes(this.user.value) && this.usersSearch.filter(user => user.username === this.user.value).length > 0){
      this.selectedUsers.push(this.user.value);
      this.user.setValue("");
    }
  }
  public addCondition(){
    if(this.condition.value && !this.conditions.includes(this.condition.value)){
      this.conditions.push(this.condition.value);
      this.condition.setValue("");
    }
  }
  private selectUser(index) {
    this.search=false;
    this.user.setValue(this.usersSearch[index].username);
  }
  private onClickOutside() {
    if(this.search){
      this.search=false;
    }
  }
  private deleteUser(index){
    this.selectedUsers.splice(index,1);
  }
  private deleteCondition(index){
    this.conditions.splice(index,1);
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
        this.enableForm();
      }else{
        var file={
          size:responseJson.file[0].size,
          url:responseJson.file[0].location
        }
        this.imagesApplication.push(file);
        if(this.uploader.progress===100 && this.uploadAllSuccess){
          this.application.setImagesApplication=this.imagesApplication; 
          //Image preview update
          for (var j = 0; j < this.imagesApplication.length; ++j) {
            let file = new File([],decodeURIComponent(this.imagesApplication[j].url).split('https://s3.eu-west-1.amazonaws.com/culture-bucket/application/')[1]);
            let fileItem = new FileItem(this.uploader, file, {});
            fileItem.file.size=this.imagesApplication[j].size;
            fileItem.progress = 100;
            fileItem.isUploaded = true;
            fileItem.isSuccess = true;
            this.uploader.queue.splice(0,1);
            this.uploader.queue.push(fileItem);
          }       
            if(this.inputOperation==='create'){
              this.createApplication();
            }else if(this.inputOperation==='edit'){
              this.editApplication();
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
  ngOnInit() {
    this.initializeForm();
    $('textarea').each(function () {
      this.setAttribute('style', 'height:' + (this.scrollHeight) + 'px;overflow-y:hidden;');
    }).on('input', function () {
      this.style.height = (this.scrollHeight) + 'px';
    });
    this.authService.userSearch(this.searchTerm,this.localizeService.parser.currentLang).subscribe(data=>{
      if(data.success){
        this.usersSearch=data.users;
        this.search=true; 
      }     
    });
    //File uploader options
    this.setUploaderOptions();    	  
  }
}