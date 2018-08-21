
import { Component, OnInit,Injectable,Input,ViewChildren,QueryList } from '@angular/core';
import { LocalizeRouterService } from 'localize-router';
import { AuthService } from '../../../../../services/auth.service';
import { ServiceService } from '../../../../../services/service.service';
import { ApplicationService } from '../../../../../services/application.service';
import { TranslateService,LangChangeEvent } from '@ngx-translate/core';
import { Application } from '../../../../../class/application';
import { Subject } from 'rxjs/Subject';
import {DataTableDirective} from 'angular-datatables';
import { Subscription } from 'rxjs/Subscription';
import { AuthGuard} from '../../../../guards/auth.guard';
import { Router,ActivatedRoute } from '@angular/router';

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
  private subscriptionLanguage: Subscription;
  constructor(
    private localizeService:LocalizeRouterService,
    private applicationService:ApplicationService,
    private authService:AuthService,
    private serviceService:ServiceService,
    private translate: TranslateService,
    private router:Router,
    private activatedRoute: ActivatedRoute,
    private authGuard:AuthGuard){
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
    this.applicationService.getApplicationServices(this.applicationId,this.localizeService.parser.currentLang).subscribe(data => {
      if(data.success){
        this.application=data.application;
        this.servicesApplication=data.services;
      }
      this.deleteTrigger.next();
    });
  }
  // Function to get services from the database
  private getServicesInit() {
    this.serviceService.getServices(this.localizeService.parser.currentLang).subscribe(data => {
      if(data.success){
        this.services=data.services;
      }
      this.addTrigger.next();
    });
  }
   private getApplicationServices(){
    // Get application services
    this.applicationService.getApplicationServices(this.applicationId,this.localizeService.parser.currentLang).subscribe(data => {
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
    this.serviceService.getServices(this.localizeService.parser.currentLang).subscribe(data => {
      if(data.success){
        this.dtElements.forEach((dtElement: DataTableDirective, index: number) => {
          if(index===1){
            dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              // Destroy the table first
              dtInstance.destroy();
              this.services=data.services;
              this.addTrigger.next();
            });
          }       
        });      
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
    // Get application id
    this.applicationId=this.activatedRoute.snapshot.params['id'];
    $('textarea').each(function () {
      this.setAttribute('style', 'height:' + (this.scrollHeight) + 'px;overflow-y:hidden;');
    }).on('input', function () {
      this.style.height = (this.scrollHeight) + 'px';
    }); 
    this.createSettings(); 
    this.getApplicationServicesInit();
    this.getServicesInit();  
    this.subscriptionLanguage =this.translate.onLangChange.subscribe((service: LangChangeEvent) => {
      this.localizeService.parser.currentLang=service.lang;
      this.getApplicationServices();
      this.getServices(); 
    });       
  }
   ngOnDestroy(){
    this.subscriptionLanguage.unsubscribe();
    this.addTrigger.unsubscribe();
    this.deleteTrigger.unsubscribe();
  }
}
