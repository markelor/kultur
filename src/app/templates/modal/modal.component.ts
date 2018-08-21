import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ObservableService } from '../../services/observable.service';
import { AuthService } from '../../services/auth.service';
import { LocalizeRouterService } from 'localize-router';
@Component({
  selector: 'modal',
  styleUrls: ['./modal.component.css'],
  templateUrl: './modal.component.html'
})

export class ModalComponent implements OnInit {
  public modalHeader;
  public modalContent;

  constructor(private localizeService:LocalizeRouterService, private activeModal: NgbActiveModal,private authService: AuthService,
    private observableService: ObservableService,private router: Router) {
  }

  ngOnInit() {
    this.observableService.modalCount=this.observableService.modalCount+1;
  }

  public closeModal() {
    this.activeModal.close();
    this.observableService.modalCount=this.observableService.modalCount-1;

  }
  
  public cancelModal(){
    if(this.observableService.modalType==="modal-renew-session"){
      this.authService.logout();
      this.router.navigate([this.localizeService.translateRoute('/sign-in-route')]); // Return error and route to login page
    }
    this.closeModal();

  }
  public confirmModal() {
    this.observableService.notifyOther({option: this.observableService.modalType});
    this.closeModal();
  }
}
