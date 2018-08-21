import { Component, OnInit,ViewChild } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { ApplicationService } from '../../../services/application.service';
import { TranslateService,LangChangeEvent } from '@ngx-translate/core';
import { LocalizeRouterService } from 'localize-router';
import { AuthGuard} from '../../guards/auth.guard';
import { Router,ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { DataTableDirective } from 'angular-datatables';
import { ModalComponent } from '../../../templates/modal/modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ObservableService } from '../../../services/observable.service';
import { Subscription } from 'rxjs/Subscription';
@Component({
  selector: 'app-applications-administrator',
  templateUrl: './applications-administrator.component.html',
  styleUrls: ['./applications-administrator.component.css']
})
export class ApplicationsAdministratorComponent implements OnInit {
  public messageClass;
  public message;
  public applications;
  @ViewChild(DataTableDirective)
  public dtElement: DataTableDirective;
  private subscriptionObservable: Subscription;
  public dtOptions: any = {};
  public dtTrigger: Subject<any> = new Subject();
  private subscriptionLanguage: Subscription;
  constructor(
  	private applicationService:ApplicationService,
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
    const activeModal = this.modalService.open(ModalComponent, {size: 'sm',backdrop: 'static'});
    activeModal.componentInstance.modalHeader = 'Modal user';
    activeModal.componentInstance.modalContent = `This is static modal, backdrop click
 will not close it. Click × or confirmation button to close modal.`;

  }
  private createSettings(){
    this.dtOptions = {
      // Declare the use of the extension in the dom parameter
      ordering: false,
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
        { responsivePriority: 3, targets: 1 },
        { responsivePriority: 7, targets: 2 },
        { responsivePriority: 4, targets: 3 },
        { responsivePriority: 5, targets: 4 },
        { responsivePriority: 6, targets: 5 },
        { responsivePriority: 2, targets: 6 }
      ]
    };
  }
  private applicationDeleteClick(index,application): void {
    this.observableService.modalType="modal-delete-application";
    if(this.observableService.modalCount<1){
      this.staticModalShow();
      this.subscriptionObservable=this.observableService.notifyObservable.subscribe(res => {
        this.subscriptionObservable.unsubscribe();
        if (res.hasOwnProperty('option') && res.option === 'modal-delete-application') {
          this.applicationService.deleteApplication(this.authService.user.username,application._id,this.localizeService.parser.currentLang).subscribe(data=>{
            if(data.success){ 
            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              // Destroy the table first
              dtInstance.destroy();
              this.applications.splice(index,1);
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
   // Function to get applications from the database
  private getApplicationsInit() {
    //Get applications
    this.applicationService.getApplications(this.localizeService.parser.currentLang).subscribe(data => {
      if(data.success){
        this.applications=data.applications;
      }
      this.dtTrigger.next();
    });
  }
  private getApplications(){
    //Get applications
      this.applicationService.getApplications(this.localizeService.parser.currentLang).subscribe(data=>{
        if(data.success){    
          this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            // Destroy the table first
            dtInstance.destroy();
            this.applications=data.applications;
            this.dtTrigger.next();
          });
        }    
      });                 
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
    this.createSettings(); 
    this.getApplicationsInit();
    this.subscriptionLanguage =this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.localizeService.parser.currentLang=event.lang;
      this.getApplications(); 
    });
  }
  ngOnDestroy(){
      this.subscriptionLanguage.unsubscribe();
      this.dtTrigger.unsubscribe();
  }

}
