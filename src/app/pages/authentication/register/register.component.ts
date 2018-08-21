import { Component, OnInit } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { TitleValidator,UsernameValidator, EmailValidator,PasswordValidator, EqualPasswordsValidator } from '../../../validators';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { User } from '../../../class/user';
import { LocalizeRouterService } from 'localize-router';
declare let $: any;
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['../authentication.component.css']
})
export class RegisterComponent implements OnInit {

  public form:FormGroup;
  public name:AbstractControl;
  public username:AbstractControl;
  public email:AbstractControl;
  public password:AbstractControl;
  public repeatPassword:AbstractControl;
  public passwords:FormGroup;
  public aboutYourself:AbstractControl;
  public message;
  public messageClass;
  public submitted:boolean = false;
  public emailValid:boolean=true;
  public emailMessage;
  public usernameValid:boolean=true;
  public usernameMessage;
  private user:User=new User();

  constructor(
    private formBuilder:FormBuilder,
    private authService:AuthService,
    private router:Router,
    private localizeService: LocalizeRouterService 
   ) {
    this.createForm();  //Create Angular form when components load
  }
  // Function to create registration form
  private createForm() {
    this.form = this.formBuilder.group({
      // Name Input
      'name': ['', Validators.compose([Validators.required,TitleValidator.validate, Validators.minLength(5),Validators.maxLength(35)])],
      // Email Input
      'email': ['', Validators.compose([Validators.required, EmailValidator.validate, Validators.minLength(5),Validators.maxLength(30)])],
      // Username Input
      'username': ['', Validators.compose([Validators.required,UsernameValidator.validate, Validators.minLength(3),Validators.maxLength(15)])],
      // Passwords Input
      'passwords': this.formBuilder.group({
        'password': ['', Validators.compose([Validators.required,PasswordValidator.validate, Validators.minLength(8),Validators.maxLength(35)])],
        'repeatPassword': ['', Validators.compose([Validators.required,PasswordValidator.validate, Validators.minLength(8),Validators.maxLength(35)])]
      }, {validator: EqualPasswordsValidator.validate('password', 'repeatPassword')}),
      // About yourself Input
      'aboutYourself': ['', Validators.compose([Validators.maxLength(500)])] 
    });
    this.name = this.form.controls['name'];
    this.username = this.form.controls['username'];
    this.email = this.form.controls['email'];
    this.passwords = <FormGroup> this.form.controls['passwords'];
    this.password = this.passwords.controls['password'];
    this.repeatPassword = this.passwords.controls['repeatPassword'];
    this.aboutYourself = this.form.controls['aboutYourself'];
  }
  // Function to disable the registration form
  private disableForm(){
    this.form.disable(); // Disable form
  }
   // Function to enable the registration form
   private enableForm(){
    this.form.enable(); // Enable form
  }

  public onSubmit(){
    if (this.form.valid) {
      this.submitted = true;
      //this.disableForm();
      this.user.setLanguage=this.localizeService.parser.currentLang,
      this.user.setName=this.form.get('name').value;
      this.user.setUsername=this.form.get('username').value;
      this.user.setEmail=this.form.get('email').value;
      this.user.setPassword=this.form.get('passwords').value.password
      this.user.setAboutYourself=this.form.get('aboutYourself').value;
      this.authService.registerUser(this.user).subscribe(data=>{
        if(!data.success){
          this.messageClass='alert alert-danger ks-solid';
          this.message=data.message
          this.submitted = false;
          this.enableForm();

        }else{
          this.createForm(); // Reset all form fields
          this.submitted = false;
          this.messageClass='alert alert-success ks-solid'
          this.message=data.message
         // After 2 second timeout, navigate to the login page
        setTimeout(() => {
          this.router.navigate([this.localizeService.translateRoute('/sign-in-route')]); // Redirect to login view
        }, 5000);
      }
      });
    }
    
    
  }
  // Function to check if e-mail is taken
  public checkEmail() {
    // Function from authentication file to check if e-mail is taken
    this.authService.checkEmail(this.form.get('email').value,this.localizeService.parser.currentLang).subscribe(data => {
      // Check if success true or false was returned from API
      if (!data.success) {
        this.emailValid = false; // Return email as invalid
        this.emailMessage = data.message; // Return error message
      } else {
        this.emailValid = true; // Return email as valid
        this.emailMessage = data.message; // Return success message
      }
    });
  }

  // Function to check if username is available
  public checkUsername() {
    // Function from authentication file to check if username is taken
    this.authService.checkUsername(this.form.get('username').value,this.localizeService.parser.currentLang).subscribe(data => {
      // Check if success true or success false was returned from API
      if (!data.success) {
        this.usernameValid = false; // Return username as invalid
        this.usernameMessage = data.message; // Return error message
      } else {
        this.usernameValid = true; // Return username as valid
        this.usernameMessage = data.message; // Return success message
      }
    });
  }
   ngOnInit() {
     $('textarea').each(function () {
      this.setAttribute('style', 'height:' + (this.scrollHeight) + 'px;overflow-y:hidden;');
    }).on('input', function () {
      this.style.height = (this.scrollHeight) + 'px';
    });
  }
}
