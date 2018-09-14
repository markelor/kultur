import { Component, OnInit,Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ObservableService } from '../../../services/observable.service';
import { AuthService } from '../../../services/auth.service';
import { LocalizeRouterService } from 'localize-router';
@Component({
  selector: 'information-modal',
  styleUrls: ['./information-modal.component.css'],
  templateUrl: './information-modal.component.html'
})

export class InformationModalComponent implements OnInit {
  public modalHeader;
  public modalContent;
  constructor(
    private localizeService:LocalizeRouterService,
    private activeModal: NgbActiveModal,
    private authService: AuthService,
    private observableService: ObservableService,
    private router: Router
    ) {
  }

  public closeModal() {
    this.activeModal.close();
    this.observableService.modalCount=this.observableService.modalCount-1;

  }  
  public confirmModal() {
    this.closeModal();
  }
  ngOnInit() {
    this.observableService.modalCount=this.observableService.modalCount+1;
  }
}
