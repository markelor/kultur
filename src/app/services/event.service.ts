import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { LocalizeRouterService } from 'localize-router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
@Injectable()
export class EventService {
  public domain = this.authService.domain;
  public route;

  constructor(
    private authService: AuthService,
    private localizeService:LocalizeRouterService,
    private http: HttpClient
  ) { }


  // Function to create a new event post
  public newEvent(event,place) {
    var data = {'event': event, 'place': place };
    return this.http.post<any>(this.domain + 'event/newEvent', data);
  }
  // Function to get all user events from the database
  public getUserEvents(username,language) {
    this.route= encodeURIComponent(username) +'/';
    return this.http.get<any>(this.domain + 'event/userEvents/'+this.route+language);
  }
  // Function to get events from the database
  public getEvents(language) {
    return this.http.get<any>(this.domain + 'event/getEvents/'+language);
  }
  // Function to get event from the database
  public getEvent(id,language) {
    this.route= encodeURIComponent(id) +'/';
    return this.http.get<any>(this.domain + 'event/getEvent/'+this.route+language);
  }
  // Function to edit/update theme post
  public editEvent(event) {
    return this.http.put<any>(this.domain + 'event/editEvent', event);
  }
  public eventSearch(searchs: Observable<string>,language) {
    return searchs.debounceTime(400)
      .distinctUntilChanged()
      .switchMap(search => this.getEventsSearch(search,language));
  }
  // Function to get all events from the database
  public getEventsSearch(search,language) {
    if(!search){
      this.route='';
    }else{
      this.route= encodeURIComponent(search) +'/';
    }    
    return this.http.get<any>(this.domain + 'event/eventsSearch/'+this.route+language);
  }
  // Function to delete a event
  public deleteEvent(username,id,language) {
    this.route= username+'/'+id +'/'
    return this.http.delete<any>(this.domain + 'event/deleteEvent/'+this.route+language);
  }
  // Function to like a theme post
  public newReactionEvent(id,reaction,language) {
    const eventData = { id: id,reaction:reaction,language:language };
    return this.http.put<any>(this.domain + 'event/newReactionEvent', eventData);
  }
  // Function to dislike a theme post
  public deleteReactionEvent(id,language) {
    const eventData = { id: id,language:language };
    return this.http.put<any>(this.domain + 'event/deleteReactionEvent',eventData);
  }

  // Function to post a comment on a theme post
  public postComment(id, comment) {
    // Create themeData to pass to backend
    const themeData = {
      id: id,
      comment: comment
    }
    return this.http.post<any>(this.domain + 'event/comment', themeData);
  }
}