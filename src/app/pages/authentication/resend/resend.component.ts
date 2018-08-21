import { Component, OnInit } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { User } from '../../../class/user';
import { LocalizeRouterService } from 'localize-router';
@Component({
  selector: 'app-resend',
  templateUrl: './resend.component.html',
  styleUrls: ['../authentication.component.css']
})
export class ResendComponent implements OnInit {
  public form:FormGroup;
  public username:AbstractControl;
  public password:AbstractControl;
  public messageClass:string;
  public message:string;
  public submitted:boolean = false;
  private user:User=new User();
  constructor(
  	private formBuilder:FormBuilder,
    private authService:AuthService,
    private router:Router,
    private localizeService: LocalizeRouterService
  	) {
  	this.createForm();
  	}

  private createForm() {
    this.form = this.formBuilder.group({
      username: ['', Validators.required], // Username field
      password: ['', Validators.required] // Password field
    });
    this.username = this.form.controls['username'];
    this.password = this.form.controls['password'];
  }
    // Function to disable resend form
  private disableForm(){
    this.form.disable(); // Disable form
  }
   // Function to enable resend form
   private enableForm(){
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
      // Function to check credentials
      this.authService.checkCredentials(this.user).subscribe(data => {
        // Check if response was a success or error
        if (data.success) {
          // Function to send email to activate acount
          this.authService.resendActivateAcountEmail(this.user).subscribe(data => {
            if(data.success){
              this.submitted = false;
              this.createForm(); // Reset all form fields
              this.messageClass = 'alert alert-success ks-solid'; // Set bootstrap success class
              this.message = data.message; // Set success message  
            }               
          });
               
        }else{
          this.messageClass = 'alert alert-danger ks-solid'; // Set bootstrap error class
          this.message = data.message; // Set error message
          this.submitted = false; // Enable submit button
          this.enableForm(); // Enable form for editting                   
        }
               
      });
    }
    
  }
  
	ngOnInit() {
     
	}

}
