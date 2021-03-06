
import { Component, OnInit,Injectable,Input,ViewChildren,QueryList } from '@angular/core';
import { LocalizeRouterService } from 'localize-router';
import { AuthService } from '../../../../../services/auth.service';
import { ServiceService } from '../../../../../services/service.service';
import { ApplicationService } from '../../../../../services/application.service';
import { TranslateService } from '@ngx-translate/core';
import { Application } from '../../../../../class/application';
import { Subject } from 'rxjs/Subject';
import {DataTableDirective} from 'angular-datatables';
import { Subscription } from 'rxjs/Subscription';
import { AuthGuard} from '../../../../guards/auth.guard';
import { Router,ActivatedRoute } from '@angular/router';
import { ObservableService } from '../../../../../services/observable.service';

@Component({
  selector: 'app-edit-services-application',
  templateUrl: './edit-services-application.component.html',
  styleUrls: ['./edit-services-application.component.css']
})
export class EditServicesApplicationComponent implements OnInit {
  public message;
  public messageClass;
  private applicationId;
  private application;
  public servicesApplication=[];
  public services;
  @ViewChildren(DataTableDirective)
  dtElements: QueryList<DataTableDirective>;
  public dtOptions: any = {};
  public addTrigger: Subject<any> = new Subject();
  public deleteTrigger: Subject<any> = new Subject();
  private subscriptionTabClick: Subscription;
  constructor(
    private localizeService:LocalizeRouterService,
    private applicationService:ApplicationService,
    private authService:AuthService,
    private observableService: ObservableService,
    private serviceService:ServiceService,
    private translate: TranslateService,
    private router:Router,
    private activatedRoute: ActivatedRoute,
    private authGuard:AuthGuard){
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
        'csv'
      ],
      responsive: true,
      columnDefs: [
        { responsivePriority: 1, targets: 0 },
        { responsivePriority: 10, targets: 1 },
        { responsivePriority: 3, targets: 2 },
        { responsivePriority: 8, targets: 3 },
        { responsivePriority: 4, targets: 4 },
        { responsivePriority: 6, targets: 5 },
        { responsivePriority: 5, targets: 6 },
        { responsivePriority: 9, targets: 7 },
        { responsivePriority: 7, targets: 8 },
        { responsivePriority: 2, targets: 9 }
      ]
    };
  }
  private addServiceApplicationTable(indexService){
    if(!this.application || !this.application.services.includes(this.services[indexService]._id)){
      this.application.services.push(this.services[indexService]._id);
      // Edit application
      this.applicationService.editApplication(this.application).subscribe(data => {
        if(data.success){ 
          this.dtElements.forEach((dtElement: DataTableDirective, index: number) => {
            if(index===0){
              dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                // Destroy the table first
                dtInstance.destroy();
                this.servicesApplication.push(this.services[indexService]);
                // Call the addTrigger to rerender again
                this.deleteTrigger.next();
              });
            }        
          });
        }
      });
    }  
  }
  private deleteServiceApplicationTable(indexService){
      var indexAplicatonService=this.application.services.indexOf(this.servicesApplication[indexService]._id);
      this.application.services.splice(indexAplicatonService,1);
      // Edit application
      this.applicationService.editApplication(this.application).subscribe(data => {
        if(data.success){ 
          this.dtElements.forEach((dtElement: DataTableDirective, index: number) => {
            if(index===0){
              dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              // Destroy the table first
              dtInstance.destroy();
              this.servicesApplication.splice(indexService,1);
              // Call the addTrigger to rerender again
              this.deleteTrigger.next();
              });
            }        
          });
        }
      });
  }
  private getApplicationServicesInit(){
    // Get application services
    this.applicationService.getApplicationServices(this.applicationId,this.authService.user.id,this.localizeService.parser.currentLang).subscribe(data => {
      if(data.success){
        this.application=data.application;
        this.servicesApplication=data.services;
        this.getServices(); 
      }
      this.deleteTrigger.next();
    });
  }
   private getApplicationServices(){
    // Get application services
    this.applicationService.getApplicationServices(this.applicationId,this.authService.user.id,this.localizeService.parser.currentLang).subscribe(data => {
      this.dtElements.forEach((dtElement: DataTableDirective, index: number) => {
        if(index===0){
          dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            // Destroy the table first
            dtInstance.destroy();
            if(data.success){
              this.application=data.application;
              this.servicesApplication=data.services;
            }else{
              this.application=undefined;
              this.servicesApplication=[];
            }        
            this.deleteTrigger.next();
          });
        }        
      });   
    });
  }
  // Function to get services from the database
  private getServices() {
    var filtersServices={};   
    if(this.application.contributors.includes(this.authService.user.id)){
      filtersServices['$or']= [{ createdBy: this.authService.user.id }, { translation: { $elemMatch: { createdBy: this.authService.user.id } } }];
    }
    this.serviceService.getServices(filtersServices,this.localizeService.parser.currentLang).subscribe(data => {
      if(data.success){
        this.services=data.services;
      }
      this.addTrigger.next();
    });
  }
  private handleSVG(svg: SVGElement, parent: Element | null): SVGElement {
    svg.setAttribute('width', '50');
    svg.setAttribute('height', '50');
    return svg;
  }
  private tabClick(){
    this.subscriptionTabClick=this.observableService.notifyObservable.subscribe(res => {
      if (res.hasOwnProperty('option') && res.option === "application-services") {
        this.getApplicationServices();
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
    // Get application id
    this.applicationId=this.activatedRoute.snapshot.params['id'];
    this.createSettings(); 
    this.getApplicationServicesInit();
    this.tabClick();       
  }
   ngOnDestroy(){
    this.addTrigger.unsubscribe();
    this.deleteTrigger.unsubscribe();
    this.subscriptionTabClick.unsubscribe();
  }
}
