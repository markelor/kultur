import { Component, OnInit,ViewChild } from '@angular/core';
import { ImageCropperComponent, CropperSettings } from "ngx-img-cropper";
import { FileUploaderService} from '../../../services/file-uploader.service';
import { FileUploader,FileUploaderOptions } from 'ng2-file-upload';
import { AuthService } from '../../../services/auth.service';
import { ObservableService } from '../../../services/observable.service';
import { AuthGuard} from '../../guards/auth.guard';
import { LocalizeRouterService } from 'localize-router';
import { Router } from '@angular/router';
const URL = 'http://localhost:8080/fileUploader/uploadImages/user-profile';
@Component({
   selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit {
   	private image: any;
    public data: any;
    public profileCropperSettings: CropperSettings;
    private images=[];
	private uploadOptions;
    private hasBaseDropZoneOver: boolean = false;
    private hasAnotherDropZoneOver: boolean = false;
    private uploadAllSuccess:Boolean=true;
    public avatars=[];
    public selectedAvatar=false;
    public uploader:FileUploader = new FileUploader({
    url: URL,itemAlias: 'user-profile',
    isHTML5: true,
    allowedMimeType: ['image/png', 'image/jpg', 'image/jpeg', 'image/gif','image/svg+xml'],
    maxFileSize: 10*1024*1024 // 10 MB
  	});
    @ViewChild('profileCropper', undefined)
    profileCropper: ImageCropperComponent;

    @ViewChild('profileEditorModal') profileEditorModal;

    constructor(
    	private authService:AuthService,
    	private observableService:ObservableService,
    	private localizeService:LocalizeRouterService,
    	private fileUploaderService: FileUploaderService,
    	private router:Router,
    	private authGuard: AuthGuard,
    ) {
    	this.profileCropperSettings = new CropperSettings();
    	this.profileCropperSettings.noFileInput = true;
	    this.profileCropperSettings.width = 200;
	    this.profileCropperSettings.height = 200;

	    this.profileCropperSettings.croppedWidth = 200;
	    this.profileCropperSettings.croppedHeight = 200;

	    this.profileCropperSettings.canvasWidth = 500;
	    this.profileCropperSettings.canvasHeight = 300;

	    this.profileCropperSettings.minWidth = 10;
	    this.profileCropperSettings.minHeight = 10;

	    this.profileCropperSettings.rounded = true;
	    this.profileCropperSettings.keepAspect = false;

	    this.profileCropperSettings.cropperDrawSettings.strokeColor ="rgba(255,255,255,1)";
	    this.profileCropperSettings.cropperDrawSettings.strokeWidth = 2;
	    this.data = {};
    }
    public uploadBase64(){
      const uploadData = {
       username:this.authService.user.username,
       language:this.localizeService.parser.currentLang,
       image: this.data.image,
       name:this.uploader.queue[0].file.name,
       bucket:'user-profile'
      };
      this.fileUploaderService.uploadImagesBase64(uploadData).subscribe(data=>{
      	if(data.success){
      		this.avatars.push(data.url);
      		this.chooseImage(this.avatars.length-1);
      	}
      }); 
    }
    public fileChangeListener($event){
	  this.image = new Image();
	  var file:File = $event.target.files[0];
	  var fileReader: FileReader = new FileReader();
	  var that = this;
	  fileReader.onloadend = function (loadEvent: any) {
       that.image.src = loadEvent.target.result;
       that.profileCropper.setImage(that.image);
	  };

	  fileReader.readAsDataURL(file);
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
	this.uploader.onAfterAddingFile = (f)=> { 
		if (this.uploader.queue.length > 1) {
			this.uploader.removeFromQueue(this.uploader.queue[0]);
		}
		f.withCredentials = false;  
	};

	//override onBuildItemForm to pass parameter language to server
	this.uploader.onBuildItemForm = (item, form) => {
	  form.append('language', this.localizeService.parser.currentLang);
	};
	 //overide the onCompleteItem property of the uploader so we are 
	//able to deal with the server response.
	this.uploader.onCompleteItem = (item:any, response:any, status:any, headers:any) => {
	  //console.log("ImageUpload:uploaded:", item, status, response);
	  const responseJson=JSON.parse(response);
	  this.images.push(responseJson.file[0]);
	  if(!responseJson.success){
	    this.uploadAllSuccess=false;
	  }    
	  if(this.uploader.progress===100 && this.uploadAllSuccess){
	    //this.saveImageUrl(this.image);
	    

	  }

	};
	this.uploader.onWhenAddingFileFailed = (fileItem) => {
	  if(fileItem.size>10*1024*1024){
	    console.log("fitzategi haundiegia");
	  }else if(!(fileItem.type === "image/png" ||fileItem.type === "image/jpg" ||fileItem.type === "image/jpeg" || fileItem.type === "image/gif" || fileItem.type === "image/svg+xml")){
	    console.log("formatu okerra");
	  }
	  console.log("fail", fileItem);
	  //this.failFlag = true;
	}
	//call the angular http method
	/*this.fileUploaderService.uploadFiles(JSON.stringify(this.uploader.queue)).subscribe(data=>{
	  console.log(data);
	});*/

	}
	private deleteAvatar(index){
		this.fileUploaderService.deleteProfileImage(this.authService.user.username,this.avatars[index].split("https://s3-eu-west-1.amazonaws.com/culture-bucket/user-profile/")[1],'user-profile',this.localizeService.parser.currentLang).subscribe(data=>{		
			if(data.success){
				this.avatars.splice(index,1);
				this.observableService.notifyOther({option: this.observableService.avatarType,data:"assets/img/avatars/default-avatar.jpg"})
			}
		})
		
	}
	private chooseImage(index){
		var user={
			language:this.localizeService.parser.currentLang,
			currentAvatar:this.avatars[index],
			username:this.authService.user.username
		}
		this.authService.editUser(user).subscribe(data=>{
			if(data.success){
				this.authService.user.currentAvatar=this.avatars[index];
				this.observableService.notifyOther({option: this.observableService.avatarType,data:this.avatars[index]})
			}
		});
	}


    ngOnInit() {
    // Get authentication on page load
    this.authService.getAuthentication(this.localizeService.parser.currentLang).subscribe(authentication => {
      if(!authentication.success){
        this.authService.logout();
        this.authGuard.redirectUrl=this.router.url;
        this.router.navigate([this.localizeService.translateRoute('/sign-in-route')]); // Return error and route to login page
      }
    });
    this.authService.getProfile(this.authService.user.username,this.localizeService.parser.currentLang).subscribe(profile => {
      if(profile.success){
        this.avatars=profile.user.avatars;
      }
    });
       //File uploader options
      this.setUploaderOptions();
   }

}
