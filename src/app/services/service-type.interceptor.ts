import { Injectable,Injector } from '@angular/core';
import { LocalizeRouterService } from 'localize-router';
import {AuthService} from './auth.service';
import {ServiceTypeService} from './service-type.service';
import {HttpRequest,HttpHandler,HttpEvent,HttpInterceptor} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ServiceTypeInterceptor implements HttpInterceptor {
  private authService;
  private serviceTypeService;
  private localizeService;
  private domain;
  constructor(private injector: Injector) {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
	this.authService = this.injector.get(AuthService);
	this.serviceTypeService = this.injector.get(ServiceTypeService);
	this.localizeService=this.injector.get(LocalizeRouterService);
	this.domain = this.authService.domain;
	if(request.url===this.domain+"serviceType/newServiceType"){
		request = request.clone({
		  setHeaders: {
		    'Content-Type': 'application/json',
		    'Authorization': 'Bearer '+this.authService.authToken, // Attach token
		    'language':this.localizeService.parser.currentLang
		  }
		});
	}else if(request.url===this.domain+"serviceType/getServiceTypes/"+this.serviceTypeService.language){
		request = request.clone({
		  setHeaders: {
		    'Content-Type': 'application/json',
		    'Authorization': 'Bearer '+this.authService.authToken, // Attach token
		    'language':this.serviceTypeService.language
		  }
		});              
    }else if(request.url===this.domain+"serviceType/editServiceType"){
		request = request.clone({
		  setHeaders: {
		    'Content-Type': 'application/json',
		    'Authorization': 'Bearer '+this.authService.authToken, // Attach token
		    'language':this.localizeService.parser.currentLang
		  }
		});       
    }
    else if(request.url===this.domain+"serviceType/deleteServiceType/"+this.serviceTypeService.route+this.localizeService.parser.currentLang){
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