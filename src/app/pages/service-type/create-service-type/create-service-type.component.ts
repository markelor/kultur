import { Component, OnInit, ViewChild } from '@angular/core';
import { LocalizeRouterService } from 'localize-router';
import { AuthService } from '../../../services/auth.service';
import { ServiceTypeService } from '../../../services/service-type.service';
import { TranslateService} from '@ngx-translate/core';
import { ServiceTypeModalComponent } from './service-type-modal/service-type-modal.component';
import { ConfirmationModalComponent } from '../../../templates/modals/confirmation-modal/confirmation-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ObservableService } from '../../../services/observable.service';
import { AlphanumericValidator } from '../../../validators';
import { ServiceType } from '../../../class/service-type';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import {DataTableDirective} from 'angular-datatables';
import { AuthGuard} from '../../guards/auth.guard';
import { Router } from '@angular/router';
@Component({
  selector: 'app-create-service-type',
  templateUrl: './create-service-type.component.html',
  styleUrls: ['./create-service-type.component.css']
})
export class CreateServiceTypeComponent implements OnInit {
  public message;
  private messageClass;
  public serviceTypes;
  private subscriptionObservableSuccess: Subscription;
  private subscriptionObservableDelete: Subscription;
  private submitted:boolean = false;
  @ViewChild(DataTableDirective)
  public dtElement: DataTableDirective;
  public services;
  public dtOptions: any = {};
  public dtTrigger: Subject<any> = new Subject();
  constructor(
    private localizeService:LocalizeRouterService,
    private serviceTypeService:ServiceTypeService,
    private authService:AuthService,
    private observableService:ObservableService,
    private modalService: NgbModal,
    private translate: TranslateService,
    private router:Router,
    private authGuard:AuthGuard){
    }
  private serviceTypeStaticModalShow(serviceType) {
    const activeModal = this.modalService.open(ServiceTypeModalComponent, {backdrop: 'static'});
    activeModal.componentInstance.inputServiceType = serviceType;

  }
  private staticModalShow() {
    const activeModal = this.modalService.open(ConfirmationModalComponent, {size: 'sm',backdrop: 'static'});
    this.translate.get('modal.delete-service-type-header').subscribe(
      data => {   
        activeModal.componentInstance.modalHeader = data;
    });
    this.translate.get('modal.delete-service-type-content').subscribe(
      data => {   
       activeModal.componentInstance.modalContent = data;
    });      
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
      responsive: true,
       columnDefs: [
        { responsivePriority: 4, targets: 0 },
        { responsivePriority: 1, targets: 1 },
        { responsivePriority: 3, targets: 2 },
        { responsivePriority: 2, targets: 3 }
      ]
    };
  }
    private serviceTypeEditClick(serviceType): void {
    if(this.observableService.modalCount<1){
      this.serviceTypeStaticModalShow(serviceType);
    }
  }
  private serviceTypeDeleteClick(index,serviceType): void {
    this.observableService.confirmationModalType="confirmation-modal-delete-service-type";
    if(this.observableService.modalCount<1){
      this.staticModalShow();
      this.subscriptionObservableDelete=this.observableService.notifyObservable.subscribe(res => {
        this.subscriptionObservableDelete.unsubscribe();
        if (res.hasOwnProperty('option') && res.option === 'confirmation-modal-delete-service-type') {
          this.serviceTypeService.deleteServiceType(this.authService.user.id,serviceType._id,this.localizeService.parser.currentLang).subscribe(data=>{
            if(data.success){  
              this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                // Destroy the table first
                dtInstance.destroy();
                this.serviceTypes.splice(index,1);
                // Call the addTrigger to rerender again
                this.dtTrigger.next();
              }); 
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
  private observableServiceTypeSuccess(){
    this.subscriptionObservableSuccess=this.observableService.notifyObservable.subscribe(res => {
      if (res.hasOwnProperty('option') && res.option === 'confirmation-modal-edit-service-type-success') {
         this.getServiceTypes(true);
      } 
    });   
  }
  private getServiceTypes(operation){
    //Get serviceType
    this.serviceTypeService.getServiceTypes(this.localizeService.parser.currentLang).subscribe(data=>{
      if(data.success){ 
        if(operation){
          this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            // Destroy the table first
            dtInstance.destroy();
            this.serviceTypes=data.serviceTypes; 
            // Call the addTrigger to rerender again
            this.dtTrigger.next();
          }); 
        }else{
          this.serviceTypes=data.serviceTypes;        
          this.dtTrigger.next();
        }
      }    
    });                 
  }
  private handleSVG(svg: SVGElement, parent: Element | null): SVGElement {
    svg.setAttribute('width', '50');
    svg.setAttribute('height', '50');
    return svg;
  }
  ngOnInit() {
    // Get authentication on page load
    this.authService.getAuthentication(this.localizeService.parser.currentLang).subscribe(authentication => {
      if(!authentication.success){
        this.authService.logout();
        this.authGuard.redirectUrl=this.router.url;
        this.router.navigate([this.localizeService.translateRoute('/sign-in-route')]); // Return error and route to login page
      }
    });
    $('textarea').each(function () {
      this.setAttribute('style', 'height:' + (this.scrollHeight) + 'px;overflow-y:hidden;');
    }).on('input', function () {
      this.style.height = (this.scrollHeight) + 'px';
    });
    this.createSettings(); 
    this.getServiceTypes(undefined);
    this.observableServiceTypeSuccess(); 	
  }
  ngOnDestroy(){
      this.dtTrigger.unsubscribe();
  }
}



