import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { LocalizeRouterService } from 'localize-router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
@Injectable()
export class ApplicationService {
  public domain = this.authService.domain;
  public route;
  constructor(
    private authService: AuthService,
    private localizeService:LocalizeRouterService,
    private http: HttpClient
  ) { }
  // Function to create a new application post
  public newApplication(application) {
    return this.http.post<any>(this.domain + 'application/newApplication', application);
  }
  // Function to get application from the database
  public getApplications(language) {
    return this.http.get<any>(this.domain + 'application/getApplications/'+language);
  }
  // Function to get application events from the database
  public getApplicationEvents(id,language) {
    this.route= encodeURIComponent(id) +'/';
    return this.http.get<any>(this.domain + 'application/getApplicationEvents/'+this.route+language);
  }
  // Function to get application services from the database
  public getApplicationServices(id,language) {
    this.route= encodeURIComponent(id) +'/';
    return this.http.get<any>(this.domain + 'application/getApplicationServices/'+this.route+language);
  }
   // Function to get application services from the database
  public getApplicationObservations(id,language) {
    this.route= encodeURIComponent(id) +'/';
    return this.http.get<any>(this.domain + 'application/getApplicationObservations/'+this.route+language);
  }
  // Function to get all user applications from the database
  public getUserApplications(username,language) {
    this.route= encodeURIComponent(username) +'/';
    return this.http.get<any>(this.domain + 'application/userApplications/'+this.route+language);
  }
  // Function to edit/update theme post
  public editApplication(application) {
    return this.http.put<any>(this.domain + 'application/editApplication',application);
  }
  // Function to delete a event
  public deleteApplication(username,id,language) {
    this.route= username+'/'+id +'/'
    return this.http.delete<any>(this.domain + 'application/deleteApplication/'+this.route+language);
  }
}