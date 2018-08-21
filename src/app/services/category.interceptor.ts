import { Injectable,Injector } from '@angular/core';
import { LocalizeRouterService } from 'localize-router';
import {AuthService} from './auth.service';
import {CategoryService} from './category.service';
import {HttpRequest,HttpHandler,HttpEvent,HttpInterceptor} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class CategoryInterceptor implements HttpInterceptor {
  private authService;
  private categoryService;
  private localizeService;
  private domain;
  constructor(private injector: Injector) {}


  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
	this.authService = this.injector.get(AuthService);
	this.categoryService = this.injector.get(CategoryService);
	this.localizeService=this.injector.get(LocalizeRouterService);
	this.domain = this.authService.domain
	if(request.url===this.domain+"category/newCategory"){
		request = request.clone({
		  setHeaders: {
		    'Content-Type': 'application/json',
		    'Authorization': 'Bearer '+this.authService.authToken, // Attach token
		    'language':this.localizeService.parser.currentLang
		  }
		});
	}else if(request.url===this.domain+"category/getCategories/"+this.localizeService.parser.currentLang){
		request = request.clone({
		  setHeaders: {
		    'Content-Type': 'application/json',
		    'Authorization': 'Bearer '+this.authService.authToken, // Attach token
		    'language':this.localizeService.parser.currentLang
		  }
		});       
    }else if(request.url===this.domain+"category/childCategories/"+this.categoryService.route+this.localizeService.parser.currentLang){
		request = request.clone({
		  setHeaders: {
		    'Content-Type': 'application/json',
		    'Authorization': 'Bearer '+this.authService.authToken, // Attach token
		    'language':this.localizeService.parser.currentLang
		  }
		});       
    }else if(request.url===this.domain+"category/editCategory"){
		request = request.clone({
		  setHeaders: {
		    'Content-Type': 'application/json',
		    'Authorization': 'Bearer '+this.authService.authToken, // Attach token
		    'language':this.localizeService.parser.currentLang
		  }
		}); 
	}else if(request.url===this.domain+"category/deleteCategory/"+this.categoryService.route+this.localizeService.parser.currentLang){
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