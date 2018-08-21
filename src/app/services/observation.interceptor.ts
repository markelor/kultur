import { Injectable,Injector } from '@angular/core';
import { LocalizeRouterService } from 'localize-router';
import {AuthService} from './auth.service';
import {ObservationService} from './observation.service';
import {HttpRequest,HttpHandler,HttpEvent,HttpInterceptor} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ObservationInterceptor implements HttpInterceptor {
  private authService;
  private serviceService;
  private localizeService;
  private domain;
  constructor(private injector: Injector) {}


  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
	this.authService = this.injector.get(AuthService);
	this.serviceService = this.injector.get(ObservationService);
	this.localizeService=this.injector.get(LocalizeRouterService);
	this.domain = this.authService.domain;
	if(request.url===this.domain+"observation/newObservation"){
	request = request.clone({
	  setHeaders: {
	    'Content-Type': 'application/json',
	    'Authorization': 'Bearer '+this.authService.authToken, // Attach token
	    'language':this.localizeService.parser.currentLang
	  }
	});
	}else if(request.url===this.domain+"observation/getObservations/"+this.localizeService.parser.currentLang){
	request = request.clone({
	  setHeaders: {
	    'Content-Type': 'application/json',
	    'Authorization': 'Bearer '+this.authService.authToken, // Attach token
	    'language':this.localizeService.parser.currentLang
	  }
	});             
    }
    else if(request.url===this.domain+"observation/getObservation/"+this.serviceService.route+this.localizeService.parser.currentLang){
        request = request.clone({
          setHeaders: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+this.authService.authToken, // Attach token
            'language':this.localizeService.parser.currentLang
          }
        }); 
     }else if(request.url===this.domain+"observation/userObservations/"+this.serviceService.route+this.localizeService.parser.currentLang){
        request = request.clone({
          setHeaders: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+this.authService.authToken, // Attach token
            'language':this.localizeService.parser.currentLang
          }
        });  
     }else if(request.url===this.domain+"observation/editObservation"){
	request = request.clone({
	  setHeaders: {
	    'Content-Type': 'application/json',
	    'Authorization': 'Bearer '+this.authService.authToken, // Attach token
	    'language':this.localizeService.parser.currentLang
	  }
	});  
	}else if(request.url===this.domain+"observation/deleteObservation/"+this.serviceService.route+this.localizeService.parser.currentLang){
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