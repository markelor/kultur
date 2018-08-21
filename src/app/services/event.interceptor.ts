import { Injectable,Injector } from '@angular/core';
import { LocalizeRouterService } from 'localize-router';
import {AuthService} from './auth.service';
import {EventService} from './event.service';
import {HttpRequest,HttpHandler,HttpEvent,HttpInterceptor} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class EventInterceptor implements HttpInterceptor {
  private authService;
  private eventService;
  private localizeService;
  private domain;
  constructor(private injector: Injector) {}


   intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
     this.authService = this.injector.get(AuthService);
     this.eventService = this.injector.get(EventService);
     this.localizeService=this.injector.get(LocalizeRouterService);
     this.domain = this.authService.domain;
     if(request.url==="assets/i18n/lang.json"){

     }else if(request.url===this.domain+"event/newEvent"){
        request = request.clone({
          setHeaders: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+this.authService.authToken, // Attach token
            'language':this.localizeService.parser.currentLang
          }
        }); 
     }else if(request.url===this.domain+"event/userEvents/"+this.eventService.route+this.localizeService.parser.currentLang){
        request = request.clone({
          setHeaders: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+this.authService.authToken, // Attach token
            'language':this.localizeService.parser.currentLang
          }
        });  
     }
     else if(request.url===this.domain+"event/getEvents/"+this.localizeService.parser.currentLang){
        request = request.clone({
          setHeaders: {
            'Content-Type': 'application/json', // Format set to JSON
            'language':this.localizeService.parser.currentLang
          }
        }); 
     }
     else if(request.url===this.domain+"event/getEvent/"+this.eventService.route+this.localizeService.parser.currentLang){
        request = request.clone({
          setHeaders: {
            'Content-Type': 'application/json', // Format set to JSON
            'language':this.localizeService.parser.currentLang,
            'route':this.eventService.route
          }
        }); 
     }else if(request.url===this.domain+"event/editEvent"){
        request = request.clone({
          setHeaders: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+this.authService.authToken, // Attach token
            'language':this.localizeService.parser.currentLang
          }
        }); 
     }else if(request.url===this.domain+"event/eventsSearch/"+this.eventService.route+this.localizeService.parser.currentLang){
        request = request.clone({
          setHeaders: {
            'Content-Type': 'application/json', // Format set to JSON
            'language':this.localizeService.parser.currentLang,
            'route':this.eventService.route
          }
        });             
     }else if(request.url===this.domain+"event/deleteEvent/"+this.eventService.route+this.localizeService.parser.currentLang){
        request = request.clone({
          setHeaders: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+this.authService.authToken, // Attach token
            'language':this.localizeService.parser.currentLang
          }
        });    
     }else if(request.url===this.domain+"event/newReactionEvent"){
        request = request.clone({
          setHeaders: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+this.authService.authToken, // Attach token
            'language':this.localizeService.parser.currentLang
          }
        });
     
     }else if(request.url===this.domain+"event/deleteReactionEvent"){
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
