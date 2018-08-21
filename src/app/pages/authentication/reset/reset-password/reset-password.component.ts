import { Component, OnInit } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../../services/auth.service';
import { User } from '../../../../class/user';
import { LocalizeRouterService } from 'localize-router';
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['../../authentication.component.css']
})
export class ResetPasswordComponent implements OnInit {
  public form:FormGroup;
  public username:AbstractControl;
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
      username: ['', Validators.required], // Username field
    });
    this.username = this.form.controls['username'];
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
    if (this.form.valid) {
      this.submitted = true; // Used to submit button while is being submitted
      //this.disableForm(); // Disable form while being process
      // Create user object from user's input
      this.user.setLanguage=this.localizeService.parser.currentLang;
      this.user.setUsername=this.form.get('username').value;
      // Function to get password
      this.authService.sendConfirmResetPasswordEmail(this.user).subscribe(data => {
        // Check if response was a success or error
        if (data.success) {
          // Function to send login data to API
          this.createForm(); // Reset all form fields
          this.submitted = false;
          this.messageClass = 'alert alert-success ks-solid'; // Set bootstrap error class
          this.message = data.message; // Set error message
               
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
