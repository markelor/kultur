import { Injectable,PLATFORM_ID, Inject } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import 'rxjs/add/operator/map';
import { LocalizeRouterService } from 'localize-router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs/Observable';
import { isPlatformBrowser, CommonModule } from '@angular/common';
@Injectable()
export class AuthService {
  //public domain = "http://localhost:8080/"; // Development Domain - Not Needed in Production
  public domain="";
  public authToken;
  public user;
  public permission;
  public route;

  constructor(
     @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient,
    private localizeService: LocalizeRouterService,
    public jwtHelper: JwtHelperService
  ) {
   
   } 
  // Function to store user's data in client local storage
  public storeUserData(token, user) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('token', token); // Set token in local storage
      localStorage.setItem('user', JSON.stringify(user)); // Set user in local storage as string
      this.authToken = token; // Assign token to be used elsewhere
      this.user = user; // Set user to be used elsewhere
    }
  }
  // Function to get token from client local storage
  public loadToken() {
    if (isPlatformBrowser(this.platformId)) {
      this.authToken = localStorage.getItem('token'); // Get token and asssign to variable to be used elsewhere
    }
  }
  // Function to get token from client local storage
  public loadUser() {
    if (isPlatformBrowser(this.platformId)) {
      this.user = JSON.parse(localStorage.getItem('user')); // Get token and asssign to variable to be used elsewhere
    }
  }
  // Function to get token from client local storage
  /*public loadLanguage() {
    return localStorage.getItem('language'); // Get token and asssign to variable to be used elsewhere
  }*/
   // Function to store language data in client local storage
  /*public storeLanguageData(language) {
    localStorage.setItem('language', language); // Set language in local storage
    this.localizeService.parser.currentLang=language;
  }*/

  // Function to register user accounts
  public registerUser(user) {
    return this.http.post<any>(this.domain + 'authentication/register', user);
  }

  // Function to check if username is taken
  public checkUsername(username,language) {
    this.route=''
    if(username){
      this.route= encodeURIComponent(username) +'/'
    }
    return this.http.get<any>(this.domain + 'authentication/checkUsername/' +this.route+language);
  }

  // Function to check if e-mail is taken
  public checkEmail(email,language) {
    this.route=''
    if(email){
      this.route= encodeURIComponent(email) +'/'
    }
    return this.http.get<any>(this.domain + 'authentication/checkEmail/' + this.route+language);
  }
  
  // Function to activate account
  public activateAcount(temporaryToken) {
    return this.http.put<any>(this.domain + 'authentication/activate',temporaryToken);
  }
  // Function to login user
  public login(user) {
    return this.http.post<any>(this.domain + 'authentication/login', user);
  }
  // Function to check credentials
  public checkCredentials(loginData) {
    return this.http.post<any>(this.domain + 'authentication/resend',loginData);
  }
  // Function to resend email to activate account
  public resendActivateAcountEmail(username) {
    return this.http.put<any>(this.domain + 'authentication/resend',username);
  }
  // Function to send forgot username to email
  public sendUsernameToEmail(user) {
   this.route=encodeURIComponent(user.email)+'/';
   return this.http.get<any>(this.domain + 'authentication/resetUsername/' +this.route+user.language);
  }
  // Function to confirm password reset
  public sendConfirmResetPasswordEmail(username) {
   return this.http.put<any>(this.domain + 'authentication/resetPassword', username);
  }
   // Function to reset password
  public resetPassword(token,language) {
   this.route=token+'/';
   return this.http.get<any>(this.domain + 'authentication/resetPassword/'+this.route+language);
  }
  // Function to reset password
  public savePassword(loginData) {
   return this.http.put<any>(this.domain + 'authentication/savePassword',loginData);
  }
  // Function to logout
  public logout() {
    if (isPlatformBrowser(this.platformId)) {
      this.authToken = null; // Set token to null
      this.user = null; // Set user to null
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  }
  // Function renew session when expired
  public renewSession(username,language) {
   
   return this.http.get<any>(this.domain + 'authentication/renewToken/'+username+'/'+language);
  }
  // Function to get permission
  public getPermission(language) {
   
   return this.http.get<any>(this.domain + 'authentication/permission/'+language);
  }
  public userSearch(searchs: Observable<string>,language) {
    return searchs.debounceTime(400)
      .distinctUntilChanged()
      .switchMap(search => this.getUsersSearch(search,language));
  }
   // Function to get all themes from the database
  public getUsersSearch(search,language) {
    if(!search){
      this.route='';
    }else{
      this.route= encodeURIComponent(search) +'/';
    }    
    return this.http.get<any>(this.domain + 'event/usersSearch/'+this.route+language);
  }
  // Function to get allusers
  public getAllUsers(language) {
   return this.http.get<any>(this.domain + 'authentication/management/'+language);
  }
    // Function to get allusers
  public getUsersImages(users,language) {
    this.route=  users+'/';
   return this.http.get<any>(this.domain + 'authentication/usersImages/'+this.route+language);
  }
  // Function to delete a user
  public deleteUser(username,language) {
    this.route=  encodeURIComponent(username)+'/';
    return this.http.delete<any>(this.domain + 'authentication/management/' + this.route+language);
  }
  // Function to edit a user
  public editUser(user) {
    return this.http.put<any>(this.domain + 'authentication/edit',user);
  }
  
  // Function to get user's profile data
  public getAuthentication(language) {
    return this.http.get<any>(this.domain + 'authentication/authentication/'+language);
  }
  // Function to get user's profile data
  public getProfile(username,language) {
    this.route=  encodeURIComponent(username)+'/';
    return this.http.get<any>(this.domain + 'authentication/profile/'+this.route+language);
  }

  // Function to get public profile data
  public getPublicProfile(username) {
    return this.http.get<any>(this.domain + 'authentication/publicProfile/' + username);
  }
  // Function to check if user is logged in
  public loggedIn() {
    if (isPlatformBrowser(this.platformId)) {
      return !this.jwtHelper.isTokenExpired(this.authToken);
    }
  }

}