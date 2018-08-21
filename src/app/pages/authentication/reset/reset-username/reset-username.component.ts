import { Component, OnInit } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../../services/auth.service';
import { EmailValidator } from '../../../../validators';
import { User } from '../../../../class/user';
import { LocalizeRouterService } from 'localize-router';
@Component({
  selector: 'app-reset-username',
  templateUrl: './reset-username.component.html',
  styleUrls: ['../../authentication.component.css']
})
export class ResetUsernameComponent implements OnInit {

  public form:FormGroup;
  public email:AbstractControl;
  public messageClass:string;
  public message:string;
  public submitted:boolean = false;
  private user:User=new User();
	constructor(
    private formBuilder:FormBuilder,
    private authService:AuthService,
    private localizeService:LocalizeRouterService
  ) {
   this.createForm();
  }
  private createForm() {
    this.form = this.formBuilder.group({
     'email': ['', Validators.compose([Validators.required])]
    });
    this.email= this.form.controls['email'];
  }
    // Function to disable form
  private disableForm() {
    this.form.disable(); 
  }

  // Function to enable form
  private enableForm() {
    this.form.enable(); 
  }

  public onSubmit(){
    this.submitted = true; // Used to submit button while is being submitted
    //this.disableForm(); // Disable form while being process
    // Create user object from user's input
      this.user.setLanguage=this.localizeService.parser.currentLang;
      this.user.setEmail=this.form.get('email').value;
    // Function to get username
    this.authService.sendUsernameToEmail(this.user).subscribe(data => {
      // Check if response was a success or error
      if (data.success) {
        this.createForm(); // Reset all form fields
        this.submitted = false;
        this.messageClass = 'alert alert-success ks-solid'; // Set bootstrap error class
        this.message = data.message; // Set error message
             
      }else{
        /*if(data.expired){
        this.emailActivateExpired=true;
        }else {  
        this.emailActivateExpired=false;*/ 
        this.messageClass = 'alert alert-danger ks-solid'; // Set bootstrap error class
        this.message = data.message; // Set error message
        this.submitted = false; // Enable submit button
        this.enableForm(); // Enable form for editting                   
      }        
    });    
  }

  ngOnInit() {
  }

}
