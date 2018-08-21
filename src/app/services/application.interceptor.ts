import { Injectable,Injector } from '@angular/core';
import { LocalizeRouterService } from 'localize-router';
import {AuthService} from './auth.service';
import {ApplicationService} from './application.service';
import {HttpRequest,HttpHandler,HttpEvent,HttpInterceptor} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ApplicationInterceptor implements HttpInterceptor {
  private authService;
  private applicationService;
  private localizeService;
  private domain;
  constructor(private injector: Injector) {}


   intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
     this.authService = this.injector.get(AuthService);
     this.applicationService = this.injector.get(ApplicationService);
     this.localizeService=this.injector.get(LocalizeRouterService);
     this.domain = this.authService.domain;
    if(request.url===this.domain+"application/newApplication"){
        request = request.clone({
          setHeaders: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+this.authService.authToken, // Attach token
            'language':this.localizeService.parser.currentLang
          }
        });  
      }else if(request.url===this.domain+"application/getApplications/"+this.localizeService.parser.currentLang){
        request = request.clone({
          setHeaders: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+this.authService.authToken, // Attach token
            'language':this.localizeService.parser.currentLang
          }
        });    
      }else if(request.url===this.domain+"application/userApplications/"+this.applicationService.route+this.localizeService.parser.currentLang){
        request = request.clone({
          setHeaders: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+this.authService.authToken, // Attach token
            'language':this.localizeService.parser.currentLang
          }
        });
      }else if(request.url===this.domain+"application/getApplicationEvents/"+this.applicationService.route+this.localizeService.parser.currentLang){
        request = request.clone({
          setHeaders: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+this.authService.authToken, // Attach token
            'language':this.localizeService.parser.currentLang
          }
        });  
      }else if(request.url===this.domain+"application/getApplicationServices/"+this.applicationService.route+this.localizeService.parser.currentLang){
        request = request.clone({
          setHeaders: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+this.authService.authToken, // Attach token
            'language':this.localizeService.parser.currentLang
          }
        });  
      }
      else if(request.url===this.domain+"application/getApplicationObservations/"+this.applicationService.route+this.localizeService.parser.currentLang){
        request = request.clone({
          setHeaders: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+this.authService.authToken, // Attach token
            'language':this.localizeService.parser.currentLang
          }
        });  
      }else if(request.url===this.domain+"application/editApplication"){
        request = request.clone({
          setHeaders: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+this.authService.authToken, // Attach token
            'language':this.localizeService.parser.currentLang
          }
        }); 
      }else if(request.url===this.domain+"application/deleteApplication/"+this.applicationService.route+this.localizeService.parser.currentLang){
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
