import { Component, OnInit } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../../services/auth.service';
import { PasswordValidator, EqualPasswordsValidator } from '../../../../validators';
import { Router,ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { User } from '../../../../class/user';
import { LocalizeRouterService } from 'localize-router';
@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['../../authentication.component.css']
})
export class NewPasswordComponent implements OnInit {

  public form:FormGroup;
  public password:AbstractControl
  public repeatPassword:AbstractControl;
  public passwords:FormGroup;
  public messageClass:string;
  public message:string;
  public showForm=true;
  private token:string;
  public submitted:boolean = false;
  private user:User = new User();
	constructor(
    private formBuilder:FormBuilder,
    private authService:AuthService,
    private activatedRoute: ActivatedRoute,
    private router:Router,
    private translate: TranslateService,
    private localizeService: LocalizeRouterService
  ) {
   this.createForm();
  }
  private createForm() {
    this.form = this.formBuilder.group({     
      // Passwords Input
      'passwords': this.formBuilder.group({
        'password': ['', Validators.compose([Validators.required,PasswordValidator.validate, Validators.minLength(8),Validators.maxLength(35)])],
        'repeatPassword': ['', Validators.compose([Validators.required,PasswordValidator.validate, Validators.minLength(8),Validators.maxLength(35)])]
      }, {validator: EqualPasswordsValidator.validate('password', 'repeatPassword')})
    });

    this.passwords = <FormGroup> this.form.controls['passwords'];
    this.password = this.passwords.controls['password'];
    this.repeatPassword = this.passwords.controls['repeatPassword'];
  }
    // Function to disable the registration form
  private disableForm(){
    this.form.disable();
  }
   // Function to enable the registration form
   private enableForm(){
    this.form.enable();
  }

  public onSubmit(){
    if (this.form.valid) {
      this.submitted = true; // Used to submit button while is being submitted
      //this.disableForm(); // Disable form while being process
      // Create user object from user's input
      this.user.setLanguage=this.localizeService.parser.currentLang;
      this.user.setPassword=this.form.get('passwords').value.password;
      // Function to save new password
      this.authService.savePassword(this.user).subscribe(data => {
        // Check if response was a success or error
        if (data.success) {
          this.createForm(); // Reset all form fields
          this.submitted = false;
          this.authService.storeUserData(this.token,this.user); // Username input field
          // Function to send login data to API
          this.messageClass = 'alert alert-success ks-solid'; // Set bootstrap error class
          this.message = data.message; // If successful, grab message from JSON object and redirect to login page
              // Redirect after 2000 milliseconds (2 seconds)
              setTimeout(() => {
                this.router.navigate(['/',this.localizeService.parser.currentLang]); // Navigate to dashboard view
              }, 2000);          
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
    this.token = this.activatedRoute.snapshot.params['token'];
    // Function to check credentials
    this.authService.resetPassword(this.token,this.localizeService.parser.currentLang).subscribe(data => {
      // Check if response was a success or error
      if (data.success) {
      	this.user.setUsername=data.user.username;
        // Function to send login data to API
        this.translate.get('auth-form.new-password-success').subscribe(data => {
          if(data){
            this.messageClass = 'alert alert-success ks-solid'; // Set bootstrap error class
            this.message = data; // Set error message
          } 
        });
             
      }else{
        this.showForm=false;
        this.messageClass = 'alert alert-danger ks-solid'; // Set bootstrap error class
        this.message = data.message; // Set error message
        this.submitted = false; // Enable submit button
        this.enableForm(); // Enable form for editting                   
      }
             
    });
	}
}