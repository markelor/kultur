import { Injectable,Injector } from '@angular/core';
import { LocalizeRouterService } from 'localize-router';
import {AuthService} from './auth.service';
import {ServiceService} from './service.service';
import {HttpRequest,HttpHandler,HttpEvent,HttpInterceptor} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ServiceInterceptor implements HttpInterceptor {
  private authService;
  private serviceService;
  private localizeService;
  private domain;
  constructor(private injector: Injector) {}


  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
	this.authService = this.injector.get(AuthService);
	this.serviceService = this.injector.get(ServiceService);
	this.localizeService=this.injector.get(LocalizeRouterService);
	this.domain = this.authService.domain;
	if(request.url===this.domain+"service/newService"){
	request = request.clone({
	  setHeaders: {
	    'Content-Type': 'application/json',
	    'Authorization': 'Bearer '+this.authService.authToken, // Attach token
	    'language':this.localizeService.parser.currentLang
	  }
	});
	}else if(request.url===this.domain+"service/getServices/"+this.localizeService.parser.currentLang){
	request = request.clone({
	  setHeaders: {
	    'Content-Type': 'application/json',
	    'Authorization': 'Bearer '+this.authService.authToken, // Attach token
	    'language':this.localizeService.parser.currentLang
	  }
	});             
    }
    else if(request.url===this.domain+"service/getService/"+this.serviceService.route+this.localizeService.parser.currentLang){
        request = request.clone({
          setHeaders: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+this.authService.authToken, // Attach token
            'language':this.localizeService.parser.currentLang
          }
        }); 
     }else if(request.url===this.domain+"service/userServices/"+this.serviceService.route+this.localizeService.parser.currentLang){
        request = request.clone({
          setHeaders: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+this.authService.authToken, // Attach token
            'language':this.localizeService.parser.currentLang
          }
        });  
     }else if(request.url===this.domain+"service/editService"){
	request = request.clone({
	  setHeaders: {
	    'Content-Type': 'application/json',
	    'Authorization': 'Bearer '+this.authService.authToken, // Attach token
	    'language':this.localizeService.parser.currentLang
	  }
	});  
	}else if(request.url===this.domain+"service/deleteService/"+this.serviceService.route+this.localizeService.parser.currentLang){
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