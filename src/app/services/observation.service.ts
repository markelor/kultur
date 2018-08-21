import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { LocalizeRouterService } from 'localize-router';
@Injectable()
export class ObservationService {
  private domain = this.authService.domain;
  private route;

  constructor(
    private authService: AuthService,
    private localizeService:LocalizeRouterService,
    private http: HttpClient
  ) { }
  // Function to create a new comment post
  public newObservation(observation) {
    return this.http.post<any>(this.domain + 'observation/newObservation', observation);
  }
   // Function to get observations from the database
  public getObservations(language) {
    return this.http.get<any>(this.domain + 'observation/getObservations/'+language);
  }
  // Function to get observation from the database
  public getObservation(id,username,language) {
    this.route= encodeURIComponent(id) +'/'+encodeURIComponent(username)+'/';
    return this.http.get<any>(this.domain + 'observation/getObservation/'+this.route+language);
  }
  // Function to get all user observations from the database
  public getUserObservations(username,language) {
    this.route= encodeURIComponent(username) +'/';
    return this.http.get<any>(this.domain + 'observation/userObservations/'+this.route+language);
  }
  // Function to delete a observation
  public deleteObservation(username,id,language) {
    this.route= username+'/'+id +'/'
    return this.http.delete<any>(this.domain + 'observation/deleteObservation/'+this.route+language);
  }
  // Function to edit a observation
  public editObservation(observation) {
    return this.http.put<any>(this.domain + 'observation/editObservation',observation);
  }
}