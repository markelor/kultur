import { Component, OnInit } from '@angular/core';
import { LocalizeRouterService } from 'localize-router';
import { AuthService } from '../../../services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { UserModalComponent } from './user-modal/user-modal.component';
import { ModalComponent } from '../../../templates/modal/modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ObservableService } from '../../../services/observable.service';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
@Component({
  selector: 'app-users-administrator',
  templateUrl: './users-administrator.component.html',
  styleUrls: ['./users-administrator.component.css']
})
export class UsersAdministratorComponent implements OnInit {
  public users;
  public messageClass;
  public message;
  private subscription: Subscription;
  public dtOptions: any = {};
  public dtTrigger: Subject<any> = new Subject();
  constructor(private localizeService:LocalizeRouterService,
    private authService:AuthService,
    private observableService:ObservableService,
    private translate: TranslateService,
    private modalService: NgbModal
  ){ }

  private userStaticModalShow(user) {
    const activeModal = this.modalService.open(UserModalComponent, {size: 'sm',backdrop: 'static'});
    activeModal.componentInstance.oldUser = user;

  }
  private staticModalShow() {
    const activeModal = this.modalService.open(ModalComponent, {size: 'sm',backdrop: 'static'});
    activeModal.componentInstance.modalHeader = 'Modal user';
    activeModal.componentInstance.modalContent = `This is static modal, backdrop click
 will not close it. Click × or confirmation button to close modal.`;

  }

  private createSettings(){
    this.dtOptions = {
      // Declare the use of the extension in the dom parameter
      dom: 'Bfrtip',
      // Configure the buttons
      buttons: [
        /*'columnsToggle',*/
        'colvis',
        'copy',
        'print',
        'csv',

      ],
      responsive: true
    };
  }
  private userEditClick(user): void {
    this.observableService.modalType="modal-edit-user";
    if(this.observableService.modalCount<1){
      this.userStaticModalShow(user);
      this.subscription=this.observableService.notifyObservable.subscribe(res => {
        this.subscription.unsubscribe();
        if (res.hasOwnProperty('option') && res.option === 'modal-edit-user') {
          if(res.data.success){
              this.messageClass = 'alert alert-success ks-solid '; // Set bootstrap success class
              this.message = res.data.message; // Set success message
              
            }else{
              this.messageClass = 'alert alert-danger ks-solid'; // Set bootstrap error class
              this.message = res.data.message; // Set error message
            }
          
        }
      });
    }
  }
  private userDeleteClick(index,user): void {
    this.observableService.modalType="modal-delete-user";
    if(this.observableService.modalCount<1){
      this.staticModalShow();
      this.subscription=this.observableService.notifyObservable.subscribe(res => {
        this.subscription.unsubscribe();
        console.log(this.users);
        if (res.hasOwnProperty('option') && res.option === 'modal-delete-user') {
          this.authService.deleteUser(user.username,this.localizeService.parser.currentLang).subscribe(data=>{
            if(data.success){  
              this.users.splice(index,1);
              this.messageClass = 'alert alert-success ks-solid'; // Set bootstrap success class
              this.message = data.message; // Set success messag
            }else{
              this.messageClass = 'alert alert-danger ks-solid'; // Set bootstrap error class
              this.message = data.message; // Set error message
            }
          });
        }
      });
    }
  }
  private getAllUsers(){
    this.authService.getAllUsers(this.localizeService.parser.currentLang).subscribe(data=>{
      if(data.success){
        this.users=data.users;
        this.dtTrigger.next();       
      }     
    });  
  }
  ngOnInit() {
    this.createSettings(); 
    this.getAllUsers();
  }
}
