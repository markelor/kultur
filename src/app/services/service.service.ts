import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { LocalizeRouterService } from 'localize-router';
@Injectable()
export class ServiceService {
  private domain = this.authService.domain;
  private route;

  constructor(
    private authService: AuthService,
    private localizeService:LocalizeRouterService,
    private http: HttpClient
  ) { }
  // Function to create a new comment post
  public newService(service,place) {
    var data = {'service': service, 'place': place };
    return this.http.post<any>(this.domain + 'service/newService', data);
  }
   // Function to get services from the database
  public getServices(language) {
    return this.http.get<any>(this.domain + 'service/getServices/'+language);
  }
  // Function to get service from the database
  public getService(id,username,language) {
    this.route= encodeURIComponent(id) +'/'+encodeURIComponent(username)+'/';
    return this.http.get<any>(this.domain + 'service/getService/'+this.route+language);
  }
  // Function to get all user services from the database
  public getUserServices(username,language) {
    this.route= encodeURIComponent(username) +'/';
    return this.http.get<any>(this.domain + 'service/userServices/'+this.route+language);
  }
  // Function to delete a service
  public deleteService(username,id,language) {
    this.route= username+'/'+id +'/'
    return this.http.delete<any>(this.domain + 'service/deleteService/'+this.route+language);
  }
  // Function to edit a service
  public editService(service) {
    return this.http.put<any>(this.domain + 'service/editService',service);
  }
}