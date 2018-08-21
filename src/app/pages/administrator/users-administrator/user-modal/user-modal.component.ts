import { Component, OnInit,Input } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { AlphanumericValidator, EmailValidator } from '../../../../validators';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ObservableService } from '../../../../services/observable.service';
import { AuthService } from '../../../../services/auth.service';
import { LocalizeRouterService } from 'localize-router';
@Component({
  selector: 'app-user-modal',
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.css']
})
export class UserModalComponent implements OnInit {
  public form:FormGroup;
  @Input() oldUser;
  public name:AbstractControl;
  public username:AbstractControl;
  public email:AbstractControl;
  public aboutYourself:AbstractControl;
  public permission:AbstractControl;
  public emailValid:boolean=true;
  public emailMessage;
  public usernameValid:boolean=true;
  public usernameMessage;
  public modalHeader;
  constructor(
    private localizeService:LocalizeRouterService,
    private formBuilder:FormBuilder,
    private activeModal: NgbActiveModal,
    private authService: AuthService,
    private observableService: ObservableService,
  ) {
  	this.createForm();  // Create Login Form when component is constructed
  }
  private createForm() {
    this.form = this.formBuilder.group({
      // Permission Input
      'permission': ['', Validators.compose([Validators.required])],
      // Name Input
      'name': ['', Validators.compose([Validators.required,AlphanumericValidator.validate, Validators.minLength(5),Validators.maxLength(35)])],
      // Email Input
      'email': ['', Validators.compose([Validators.required, EmailValidator.validate, Validators.minLength(5),Validators.maxLength(30)])],
      // Username Input
      'username': ['', Validators.compose([Validators.required,AlphanumericValidator.validate, Validators.minLength(3),Validators.maxLength(15)])],
      // Username Input
      'aboutYourself': ['', Validators.compose([Validators.maxLength(500)])],
    });
    this.permission = this.form.controls['permission'];
    this.name = this.form.controls['name'];
    this.username = this.form.controls['username'];
    this.email = this.form.controls['email'];
    this.aboutYourself = this.form.controls['aboutYourself'];
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
  public closeModal() {
    this.activeModal.close();
    this.observableService.modalCount=this.observableService.modalCount-1;

  }
  
  public cancelModal(){
    this.closeModal();

  }
  public confirmModal() {
    this.oldUser.language=this.localizeService.parser.currentLang;
    this.oldUser.permission=this.form.get('permission').value;
    this.oldUser.name=this.form.get('name').value;
    this.oldUser.username=this.form.get('username').value;
    this.oldUser.email=this.form.get('email').value;
    this.oldUser.aboutYourself=this.form.get('aboutYourself').value;
    this.authService.editUser(this.oldUser).subscribe(data=>{
    this.observableService.notifyOther({option: this.observableService.modalType,data:data});
    });
    this.closeModal();
  }

  ngOnInit() {
    this.observableService.modalCount=this.observableService.modalCount+1;
    this.form.controls['permission'].setValue(this.oldUser.permission);
    this.form.controls['name'].setValue(this.oldUser.name);
    this.form.controls['username'].setValue(this.oldUser.username);
    this.form.controls['email'].setValue(this.oldUser.email);
    this.form.controls['aboutYourself'].setValue(this.oldUser.aboutYourself);

  }

  
}
