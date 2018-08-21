import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { LocalizeRouterService } from 'localize-router';
@Injectable()
export class CommentService {
  public domain = this.authService.domain;
  public route;
  constructor(
    private authService: AuthService,
    private localizeService:LocalizeRouterService,
    private http: HttpClient
  ) { }


  // Function to create a new comment post
  public newComment(comment) {
    return this.http.post<any>(this.domain + 'comment/newComment', comment);
  }
   // Function to get comments from the database
  public getComments(id,language) {
    this.route= id+'/';
    return this.http.get<any>(this.domain + 'comment/getComments/' + this.route+language);
  }
     // Function to get comments notification from the database
  public getCommentsNotification(username,language) {
    this.route= username+'/';
    return this.http.get<any>(this.domain + 'comment/getCommentsNotification/' + this.route+language);
  }
  // Function to edit a comment
  public editComment(comment) {
    return this.http.put<any>(this.domain + 'comment/editComment',comment);
  }
  // Function to edit comments notifications from the database
  public editCommentsNotification(username,language) {
    var data={
      username:username,
      language:language
    }
    return this.http.put<any>(this.domain + 'comment/editCommentsNotification',data);
  }
  // Function to delete a comment
  public deleteComment(username,id,language) {
    this.route= username+'/'+id +'/';
    return this.http.delete<any>(this.domain + 'comment/deleteComment/' + this.route+language);
  }
}