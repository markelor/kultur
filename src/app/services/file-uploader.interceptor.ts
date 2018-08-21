import { Injectable,Injector } from '@angular/core';
import { LocalizeRouterService } from 'localize-router';
import {AuthService} from './auth.service';
import {FileUploaderService} from './file-uploader.service'
import {HttpRequest,HttpHandler,HttpEvent,HttpInterceptor} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class FileUploaderInterceptor implements HttpInterceptor {
  private authService;
  private fileUploaderService;
  private localizeService;
  private domain;
  constructor(private injector: Injector) {}


   intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
     this.authService = this.injector.get(AuthService);
     this.fileUploaderService=this.injector.get(FileUploaderService)
     this.localizeService=this.injector.get(LocalizeRouterService);
     this.domain = this.authService.domain;
     if(request.url===this.domain+"fileUploader/getSignatureFroala/"+this.fileUploaderService.route+this.localizeService.parser.currentLang){
        request = request.clone({
          setHeaders: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+this.authService.authToken, // Attach token
            'language':this.localizeService.parser.currentLang
          }
        });
        
     }else if(request.url===this.domain+"fileUploader/deleteImages/"+this.fileUploaderService.route+this.localizeService.parser.currentLang){
        request = request.clone({
          setHeaders: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+this.authService.authToken, // Attach token
            'language':this.localizeService.parser.currentLang
          }
        });
        
     }else if(request.url===this.domain+"fileUploader/uploadImagesBase64"){
        request = request.clone({
          setHeaders: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+this.authService.authToken, // Attach token
            'language':this.localizeService.parser.currentLang
          }
        });
     }else if(request.url===this.domain+"fileUploader/deleteProfileImage/"+this.fileUploaderService.route+this.localizeService.parser.currentLang){
        request = request.clone({
          setHeaders: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+this.authService.authToken, // Attach token
            'language':this.localizeService.parser.currentLang
          }
        });
     }else{
       
        /*request = request.clone({
          setHeaders: {
            'Content-Type': 'application/json', // Format set to JSON
            'authorization': this.authService.authToken, // Attach token
            'language':this.localizeService.parser.currentLang
          }
        });
        */
     }
   

    return next.handle(request);
  } 
}
