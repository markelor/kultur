import { Injectable,Injector } from '@angular/core';
import { LocalizeRouterService } from 'localize-router';
import {AuthService} from './auth.service';
import {CommentService} from './comment.service';
import {HttpRequest,HttpHandler,HttpEvent,HttpInterceptor} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class CommentInterceptor implements HttpInterceptor {
  private authService;
  private commentService;
  private localizeService;
  private domain;
  constructor(private injector: Injector) {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
	this.authService = this.injector.get(AuthService);
	this.commentService = this.injector.get(CommentService);
	this.localizeService=this.injector.get(LocalizeRouterService);
	this.domain = this.authService.domain;
	if(request.url===this.domain+"comment/newComment"){
		request = request.clone({
		  setHeaders: {
		    'Content-Type': 'application/json',
		    'Authorization': 'Bearer '+this.authService.authToken, // Attach token
		    'language':this.localizeService.parser.currentLang
		  }
		});
	}else if(request.url===this.domain+"comment/getComments/"+this.commentService.route+this.localizeService.parser.currentLang){
		request = request.clone({
		  setHeaders: {
		    'Content-Type': 'application/json',
		    'language':this.localizeService.parser.currentLang,
		    'route':this.commentService.route
		  }
		});              
    }else if(request.url===this.domain+"comment/getCommentsNotification/"+this.commentService.route+this.localizeService.parser.currentLang){
		request = request.clone({
		  setHeaders: {
		    'Content-Type': 'application/json',
		    'Authorization': 'Bearer '+this.authService.authToken, // Attach token
		    'language':this.localizeService.parser.currentLang
		  }
		});              
    }else if(request.url===this.domain+"comment/editComment"){
		request = request.clone({
		  setHeaders: {
		    'Content-Type': 'application/json',
		    'Authorization': 'Bearer '+this.authService.authToken, // Attach token
		    'language':this.localizeService.parser.currentLang
		  }
		});       
    }
    else if(request.url===this.domain+"comment/editCommentsNotification"){
		request = request.clone({
		  setHeaders: {
		    'Content-Type': 'application/json',
		    'Authorization': 'Bearer '+this.authService.authToken, // Attach token
		    'language':this.localizeService.parser.currentLang
		  }
		});                 
    }else if(request.url===this.domain+"comment/deleteComment/"+this.commentService.route+this.localizeService.parser.currentLang){
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