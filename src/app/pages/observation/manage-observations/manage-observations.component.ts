
import { Component, OnInit,ViewChild } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { ObservationService } from '../../../services/observation.service';
import { TranslateService} from '@ngx-translate/core';
import { LocalizeRouterService } from 'localize-router';
import { AuthGuard} from '../../guards/auth.guard';
import { Router,ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { DataTableDirective } from 'angular-datatables';
import { ConfirmationModalComponent } from '../../../templates/modals/confirmation-modal/confirmation-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ObservableService } from '../../../services/observable.service';
import { Subscription } from 'rxjs/Subscription';
@Component({
  selector: 'app-manage-observations',
  templateUrl: './manage-observations.component.html',
  styleUrls: ['./manage-observations.component.css']
})
export class ManageObservationsComponent implements OnInit {
  private messageClass;
  public message;
  public observations;
  @ViewChild(DataTableDirective)
  private dtElement: DataTableDirective;
  private subscriptionObservable: Subscription;
  public dtOptions: any = {};
  public dtTrigger: Subject<any> = new Subject();
  constructor(
    private observationService:ObservationService,
    private authService:AuthService,
    private observableService:ObservableService,
    private localizeService:LocalizeRouterService,
    private translate:TranslateService,
    private router:Router,
    private activatedRoute: ActivatedRoute,
    private authGuard:AuthGuard,
    private modalService: NgbModal
  ) { }
  private staticModalShow() {
    const activeModal = this.modalService.open(ConfirmationModalComponent, {size: 'sm',backdrop: 'static'});
    this.translate.get('modal.delete-observation-header').subscribe(
      data => {   
        activeModal.componentInstance.modalHeader = data;
    });
    this.translate.get('modal.delete-observation-content').subscribe(
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
        { responsivePriority: 1, targets: 0 },
        { responsivePriority: 5, targets: 1 },
        { responsivePriority: 4, targets: 2 },
        { responsivePriority: 3, targets: 3 },
        { responsivePriority: 2, targets: 4 },
      ]
    };
  }
  private observationDeleteClick(index,observation): void {
    this.observableService.confirmationModalType="confirmation-modal-delete-observation";
    if(this.observableService.modalCount<1){
      this.staticModalShow();
      this.subscriptionObservable=this.observableService.notifyObservable.subscribe(res => {
        this.subscriptionObservable.unsubscribe();
        if (res.hasOwnProperty('option') && res.option === 'confirmation-modal-delete-observation') {
          this.observationService.deleteObservation(this.authService.user.id,observation._id,this.localizeService.parser.currentLang).subscribe(data=>{
            if(data.success){ 
            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              // Destroy the table first
              dtInstance.destroy();
              this.observations.splice(index,1);
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
    // Function to get observations from the database
  private getObservations() {
    this.observationService.getUserObservations(this.authService.user.id,this.localizeService.parser.currentLang).subscribe(data => {
      if(data.success){
        this.observations=data.observations;
      }
      this.dtTrigger.next();
    });
  }
   // Function to get observations from the database
  ngOnInit() {
    // Get authentication on page load
    this.authService.getAuthentication(this.localizeService.parser.currentLang).subscribe(authentication => {
      if(!authentication.success){
        this.authService.logout();
        this.authGuard.redirectUrl=this.router.url;
        this.router.navigate([this.localizeService.translateRoute('/sign-in-route')]); // Return error and route to login page
      }
    });
    this.createSettings(); 
    this.getObservations();
  }
  ngOnDestroy(){
    this.dtTrigger.unsubscribe();
  }
}
