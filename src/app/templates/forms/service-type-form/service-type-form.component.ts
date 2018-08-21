import { Component, OnInit, ViewChild, Input} from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { LocalizeRouterService } from 'localize-router';
import { AuthService } from '../../../services/auth.service';
import { ServiceTypeService } from '../../../services/service-type.service';
import { ObservableService } from '../../../services/observable.service';
import { TranslateService,LangChangeEvent } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { FileUploaderService} from '../../../services/file-uploader.service';
import { FileUploader,FileUploaderOptions,FileItem } from 'ng2-file-upload';
import { TitleValidator } from '../../../validators';
import { ServiceType } from '../../../class/service-type';
import { GroupByPipe } from '../../../shared/pipes/group-by.pipe';
import { Subscription } from 'rxjs/Subscription';
import { AuthGuard} from '../../../pages/guards/auth.guard';
const URL = 'http://localhost:8080/fileUploader/uploadImages/service-type-icon';
@Component({
  selector: 'app-service-type-form',
  templateUrl: './service-type-form.component.html',
  styleUrls: ['./service-type-form.component.css']
})
export class ServiceTypeFormComponent implements OnInit {
  public message;
  public messageClass;
  public submitted:boolean = false;
  public form:FormGroup;
  @Input() inputOperation:string;
  @Input() inputServiceType;
  @Input() inputLanguage;
  public title:AbstractControl;
  private serviceType:ServiceType=new ServiceType();
  private iconsServiceType=[];
  private subscriptionObservable: Subscription;
  public uploader:FileUploader = new FileUploader({
    url: URL,itemAlias: 'service-type-icon',
    isHTML5: true,
    allowedMimeType: ['image/png', 'image/jpg', 'image/jpeg', 'image/gif','image/svg+xml'],
    maxFileSize: 10*1024*1024 // 10 MB
  });
  private uploadAllSuccess:Boolean=true;
  private uploadOptions;
  private hasBaseDropZoneOver:boolean = false;
  private hasAnotherDropZoneOver:boolean = false;
  constructor(
    private fb: FormBuilder,
    private localizeService:LocalizeRouterService,
    private serviceTypeService:ServiceTypeService,
    private observableService:ObservableService,
    private authService:AuthService,
    private groupByPipe:GroupByPipe,
    private router:Router,
    private fileUploaderService:FileUploaderService,
    private authGuard: AuthGuard,
    private translate: TranslateService
    ){
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
      ])]
    })
    this.title = this.form.controls['title'];
  }
   // Function to disable the registration form
  private disableForm(){
    this.form.disable(); // Disable form
  }
   // Function to enable the registration form
   private enableForm(){
    this.form.enable(); // Enable form
  }
  public initializeForm(){  
    if(this.inputServiceType){
      var hasTranslation=false;
      for (var i = 0; i < this.inputServiceType.translation.length; ++i) {
        if(this.inputServiceType.translation[i].language===this.inputLanguage){
          hasTranslation=true;
          this.form.controls['title'].setValue(this.inputServiceType.translation[i].title); 
        }
      }
      if(!hasTranslation){
        if(this.inputServiceType.language===this.inputLanguage){ 
          this.form.controls['title'].setValue(this.inputServiceType.title);    
        }
      }  
      this.iconsServiceType=this.inputServiceType.icons;
      for (var z = 0; z < this.iconsServiceType.length; ++z) {
        let file = new File([],decodeURIComponent(this.inputServiceType.icons[z].url).split('https://s3.eu-west-1.amazonaws.com/culture-bucket/service-type-icon/')[1]);
        let fileItem = new FileItem(this.uploader, file, {});
        fileItem.file.size=this.inputServiceType.icons[z].size;
        fileItem.progress = 100;
        fileItem.isUploaded = true;
        fileItem.isSuccess = true;
        this.uploader.queue.push(fileItem);   
      } 
    }     
  }
  private deleteEditImages(deleteImage){
     //see delete images
    var deleteImages=[];
    for (var i = 0; i < this.iconsServiceType.length; ++i) {
      let file = new File([],decodeURIComponent(this.iconsServiceType[i].url).split('https://s3.eu-west-1.amazonaws.com/culture-bucket/service-type-icon/')[1]);
      let fileItem = new FileItem(this.uploader, file, {});
      if(this.uploader.queue.some(e => e.file.name !== fileItem.file.name)){
        deleteImages.push(this.iconsServiceType[i]);
        this.iconsServiceType.splice(i,1);            
      }
    }
    if(deleteImages.length>0 && deleteImage){
      this.deleteUploadImages('icon',deleteImages);
    }
  }
  private editServiceType(){
    var hasTranslation=false;
    this.deleteEditImages(true);
    for (var i = 0; i < this.inputServiceType.translation.length; ++i) {
      if(this.inputServiceType.translation[i].language===this.inputLanguage){
        hasTranslation=true;
        this.inputServiceType.translation[i].language=this.inputLanguage;
        this.inputServiceType.translation[i].title=this.form.get('title').value;
      }
    }
    if(!hasTranslation){
      if(this.inputServiceType.language===this.inputLanguage){
        this.inputServiceType.language=this.inputLanguage,        
        this.inputServiceType.title=this.form.get('title').value;
      }else{
        var translationObj={
          language:this.inputLanguage,
          title:this.form.get('title').value
        }
        this.inputServiceType.translation.push(translationObj);             
      }
    }
    this.serviceTypeService.editServiceType(this.inputServiceType).subscribe(data=>{
      if(data.success){
        this.observableService.modalType="modal-edit-service-type-success";
        this.observableService.notifyOther({option: this.observableService.modalType,serviceType:this.inputServiceType});
        this.messageClass = 'alert alert-success ks-solid '; // Set bootstrap success class
        this.message =data.message; // Set success message            
      }else{
        this.messageClass = 'alert alert-danger ks-solid'; // Set bootstrap error class
        this.message =data.message; // Set error message
      } 
    });
  }
  private observableEdit(){
    this.subscriptionObservable=this.observableService.notifyObservable.subscribe(res => {
      this.subscriptionObservable.unsubscribe();
      if (res.hasOwnProperty('option') && res.option === 'modal-edit-service-type') {
        if(this.inputServiceType && res.language===this.inputLanguage){
          if(this.uploader.queue.length>0){
            this.uploader.uploadAll();
            if(this.uploader.queue[0].isUploaded){
              this.editServiceType();
            }
          }
        }     
      }
    });
  }
  private fileOverBase(e:any):void {
    this.hasBaseDropZoneOver = e;
  }
   // File upload controll
  private fileOverAnother(e:any):void {
    this.hasAnotherDropZoneOver = e;
  }
  private createServiceType(){
    this.serviceTypeService.newServiceType(this.serviceType).subscribe(data=>{
      if(!data.success){
        this.deleteUploadImages('icon',this.iconsServiceType);
        this.messageClass='alert alert-danger ks-solid';
        this.message=data.message
        this.enableForm();
      }else{
        this.uploader.clearQueue();
        this.iconsServiceType=[];
        this.observableService.modalType="modal-edit-service-type-success";
        this.observableService.notifyOther({option: this.observableService.modalType});
        this.submitted = false;
        this.serviceType=new ServiceType();
        this.createForm(); // Reset all form fields
        this.messageClass='alert alert-success ks-solid'
        this.message=data.message
      }
    });
  }
  private deleteUploadImages(type,images){
    if(type==='icon'){
      for (var i = 0; i < images.length; ++i) {
        var currentUrlSplit = images[i].url.split("/");
        let imageName = currentUrlSplit[currentUrlSplit.length - 1];
        var urlSplit = imageName.split("%2F");
        this.fileUploaderService.deleteImages(urlSplit[0],"service-type-icon",this.localizeService.parser.currentLang).subscribe(data=>{
        });
      }
    }
  }
  public onSubmit(){
    if (this.form.valid) {
      this.submitted = true;
      //this.disableForm();
      this.serviceType.setLanguage=this.localizeService.parser.currentLang,
      this.serviceType.setTitle=this.form.get('title').value;
      if(this.uploader.queue.length>0){
        this.uploader.uploadAll();
      }else{
        this.createServiceType();     
      }
    }                
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
        this.iconsServiceType.push(file);
        if(this.uploader.progress===100 && this.uploadAllSuccess){
          this.serviceType.setIcons=this.iconsServiceType; 
          //Image preview update
          for (var j = 0; j < this.iconsServiceType.length; ++j) {
            let file = new File([],decodeURIComponent(this.iconsServiceType[j].url).split('https://s3.eu-west-1.amazonaws.com/culture-bucket/service-type-icon/')[1]);
            let fileItem = new FileItem(this.uploader, file, {});
            fileItem.file.size=this.iconsServiceType[j].size;
            fileItem.progress = 100;
            fileItem.isUploaded = true;
            fileItem.isSuccess = true;
            this.uploader.queue.splice(0,1);
            this.uploader.queue.push(fileItem);
          }       
            if(this.inputOperation==='create'){
              this.createServiceType();
            }else if(this.inputOperation==='edit'){
              this.editServiceType();
          }
        }
      } 
    };
    this.uploader.onWhenAddingFileFailed = (fileItem) => {
      if(fileItem.size>10*1024*1024){
        console.log("fitzategi haundiegia");
      }else if(!(fileItem.type === "image/png" ||fileItem.type === "image/jpg" ||fileItem.type === "image/jpeg" || fileItem.type === "image/gif" || fileItem.type === "image/svg+xml")){
        console.log("formatu okerra");
      }
      console.log("fail", fileItem);
    }

  }
  private handleSVG(svg: SVGElement, parent: Element | null): SVGElement {
    svg.setAttribute('width', '80');
    svg.setAttribute('height', '80');
    return svg;
  }
  ngOnInit() {
    /*$('textarea').each(function () {
      this.setAttribute('style', 'height:' + (this.scrollHeight) + 'px;overflow-y:hidden;');
    }).on('input', function () {
      this.style.height = (this.scrollHeight) + 'px';
    });*/
    this.initializeForm();
    this.observableEdit();  
     //File uploader options
    this.setUploaderOptions();  	  
  }
}
