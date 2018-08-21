import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { LocalizeRouterService } from 'localize-router';
@Injectable()
export class ServiceTypeService {
  private domain = this.authService.domain;
  private route;
  private language;
  constructor(
    private authService: AuthService,
    private localizeService:LocalizeRouterService,
    private http: HttpClient
  ) { }


  // Function to create a new comment post
  public newServiceType(serviceType) {
    return this.http.post<any>(this.domain + 'serviceType/newServiceType', serviceType);
  }
   // Function to get ccategories from the database
  public getServiceTypes(language) {
    this.language=language;
    return this.http.get<any>(this.domain + 'serviceType/getServiceTypes/'+language);
  }
  // Function to edit a serviceType
  public editServiceType(serviceType) {
    return this.http.put<any>(this.domain + 'serviceType/editServiceType',serviceType);
  }
  // Function to delete a serviceType
  public deleteServiceType(username,id,language) {
    this.route= username+'/'+id +'/';
    return this.http.delete<any>(this.domain + 'serviceType/deleteServiceType/' + this.route+language);
  }
}