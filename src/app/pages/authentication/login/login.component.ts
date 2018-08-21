import { Component, OnInit } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { AuthGuard} from '../../guards/auth.guard';
import { ContributorGuard} from '../../guards/contributor.guard';
import { ModeratorGuard} from '../../guards/moderator.guard';
import { AdminGuard} from '../../guards/admin.guard';
import { TranslateService } from '@ngx-translate/core';
import { User } from '../../../class/user';
import { LocalizeRouterService } from 'localize-router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../authentication.component.css']
})
export class LoginComponent implements OnInit {
  public form:FormGroup;
  public username:AbstractControl;
  public password:AbstractControl;
  public messageClass:string;
  public message:string;
  public submitted:boolean = false;
  private previousUrl;
  public emailActivateExpired;
  private user:User=new User();

  constructor(
    private localizeService:LocalizeRouterService,
    private formBuilder:FormBuilder,
    private authService:AuthService,
    private router:Router,
    private translate: TranslateService,
    private authGuard:AuthGuard,
    private contributorGuard:ContributorGuard,
    private moderatorGuard:ModeratorGuard,
    private adminGuard:AdminGuard) {
    this.createForm();  // Create Login Form when component is constructed
  	}

  private createForm() {
    this.form = this.formBuilder.group({
      username: ['', Validators.required], // Username field
      password: ['', Validators.required] // Password field
    });
    this.form.controls['username'].setValue("Markelor");
    this.form.controls['password'].setValue('Pasahitza1!');
    this.username = this.form.controls['username'];
    this.password = this.form.controls['password'];
  }
    // Function to disable form
  private disableForm() {
    this.form.disable(); // Disable form
  }

  // Function to enable form
  private enableForm() {
    this.form.enable(); // Enable form
  }

  public onSubmit(){
    if (this.form.valid) {
      this.submitted = true; // Used to submit button while is being submitted
      //this.disableForm(); // Disable form while being process
       // Create user object from user's input   
       this.user.setLanguage=this.localizeService.parser.currentLang;
       this.user.setUsername=this.form.get('username').value;
       this.user.setPassword=this.form.get('password').value;
        // Function to send login data to API
        this.authService.login(this.user).subscribe(data => { 
          // Check if response was a success or error
          if (data.success) {
            this.createForm();
            this.submitted = false; // Enable submit button
            this.messageClass = 'alert alert-success ks-solid'; // Set bootstrap success class
            this.message = data.message; // Set success message
            // Function to store user's token in client local storage
            this.authService.storeUserData(data.token, data.user);
            // After 2 seconds, redirect to dashboard page
            setTimeout(() => {
            // Check if user was redirected or logging in for first time
            if (this.previousUrl) {
              this.router.navigate([this.previousUrl]); // Redirect to page they were trying to view before
            } else {
              this.router.navigate(['/',this.localizeService.parser.currentLang]); // Navigate to dashboard view
            }
          }, 2000);
            
          }else{
            if(data.expired){
            this.emailActivateExpired=true;
            }else {  
            this.emailActivateExpired=false;                  
          }
          this.messageClass = 'alert alert-danger ks-solid'; // Set bootstrap error class
          this.message = data.message; // Set error message
          this.submitted = false; // Enable submit button
          this.enableForm(); // Enable form for editting  
        }
      });
    }      
  }
  private redirectUsersGuard(){
    // On page load, check if user was redirected to login
    if (this.authGuard.redirectUrl) {
      this.translate.get('auth-form.guard-error').subscribe(data => {
          if(data){
            this.messageClass = 'alert alert-danger ks-solid'; // Set error message: need to login
            this.message = data; // Set error message
          } 
      });
      this.previousUrl = this.authGuard.redirectUrl; // Set the previous URL user was redirected from
      this.authGuard.redirectUrl = undefined; // Erase previous URL
    }else if(this.contributorGuard.redirectUrl){
      this.translate.get('auth-form.guard-error').subscribe(data => {
          if(data){
            this.messageClass = 'alert alert-danger ks-solid'; // Set error message: need to login
            this.message = data; // Set error message
          } 
      });
      this.previousUrl = this.contributorGuard.redirectUrl; // Set the previous URL user was redirected from
      this.contributorGuard.redirectUrl = undefined; // Erase previous URL
    }else if(this.moderatorGuard.redirectUrl){
      this.translate.get('auth-form.guard-error').subscribe(data => {
          if(data){
            this.messageClass = 'alert alert-danger ks-solid'; // Set error message: need to login
            this.message = data; // Set error message
          } 
      });
      this.previousUrl = this.moderatorGuard.redirectUrl; // Set the previous URL user was redirected from
      this.moderatorGuard.redirectUrl = undefined; // Erase previous URL
    }else if(this.adminGuard.redirectUrl){
      this.translate.get('auth-form.guard-error').subscribe(data => {
          if(data){
            this.messageClass = 'alert alert-danger ks-solid'; // Set error message: need to login
            this.message = data; // Set error message
          } 
      });
      this.previousUrl = this.adminGuard.redirectUrl; // Set the previous URL user was redirected from
      this.adminGuard.redirectUrl = undefined; // Erase previous URL
    }
  }
  ngOnInit() {
    this.redirectUsersGuard(); 

  }

}
