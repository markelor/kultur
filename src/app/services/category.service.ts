import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { LocalizeRouterService } from 'localize-router';
@Injectable()
export class CategoryService {
  private domain = this.authService.domain;
  private route;

  constructor(
    private authService: AuthService,
    private localizeService:LocalizeRouterService,
    private http: HttpClient
  ) { }


  // Function to create a new comment post
  public newCategory(category) {
    return this.http.post<any>(this.domain + 'category/newCategory', category);
  }
   // Function to get ccategories from the database
  public getCategories(language) {
    return this.http.get<any>(this.domain + 'category/getCategories/'+language);
  }
   // Function to get ccategories from the database
  public getChildCategories(id,language) {
    this.route=  encodeURIComponent(id)+'/';
    return this.http.get<any>(this.domain + 'category/childCategories/'+ this.route+language);
  }
  // Function to delete a category
  public deleteCategory(id,language) {
    this.route=  encodeURIComponent(id)+'/';
    return this.http.delete<any>(this.domain + 'category/deleteCategory/' + this.route+language);
  }
  // Function to edit a category
  public editCategory(category) {
    return this.http.put<any>(this.domain + 'category/editCategory',category);
  }
}