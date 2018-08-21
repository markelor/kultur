import { Component, OnInit,Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ObservableService } from '../../../../services/observable.service';
import { AuthService } from '../../../../services/auth.service';
import { LocalizeRouterService } from 'localize-router';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-service-type-modal',
  templateUrl: './service-type-modal.component.html',
  styleUrls: ['./service-type-modal.component.css']
})
export class ServiceTypeModalComponent implements OnInit {
  private tabLanguage:string;
  public modalHeader;
  @Input() inputServiceType;
  @Input() inputParentCategories;
  constructor(
  	private localizeService:LocalizeRouterService,
    private activeModal: NgbActiveModal,
    private authService: AuthService,
    private observableService: ObservableService,
    private translate: TranslateService){
    }
  public closeModal() {
    this.activeModal.close();
    this.observableService.modalCount=this.observableService.modalCount-1;

  }
  public cancelModal(){
    this.closeModal();

  }
  public confirmModal() {
  	this.observableService.modalType="modal-edit-service-type";
    this.observableService.notifyOther({option: this.observableService.modalType,language:this.tabLanguage});
    this.closeModal();
  }
  public clickLanguage(language){
    this.tabLanguage=language;
  }
  ngOnInit() {
    setTimeout(() => {
      $(".nav-"+this.localizeService.parser.currentLang).addClass('active');
      $( ".nav-"+this.localizeService.parser.currentLang).click ();
    }, 0); 
  	this.observableService.modalCount=this.observableService.modalCount+1;
  }
}
