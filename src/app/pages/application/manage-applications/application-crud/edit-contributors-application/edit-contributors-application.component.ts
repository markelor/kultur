
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
  selector: 'app-edit-contributors-application',
  templateUrl: './edit-contributors-application.component.html',
  styleUrls: ['./edit-contributors-application.component.css']
})
export class EditContributorsApplicationComponent implements OnInit {
  public message;
  public messageClass;
  private applicationId;
  private application;
  public contributorsApplication=[];
  public users;
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
        { responsivePriority: 3, targets: 0 },
        { responsivePriority: 4, targets: 1 },
        { responsivePriority: 1, targets: 2 },
        { responsivePriority: 5, targets: 3 },
        { responsivePriority: 6, targets: 4 },
        { responsivePriority: 7, targets: 5 },
        { responsivePriority: 2, targets: 6 }
      ]
    };
  }
  private addUserApplicationTable(indexUser){
      console.log(this.application);
    if(!this.application || !this.application.contributors.includes(this.users[indexUser]._id)){
      this.application.contributors.push(this.users[indexUser]._id);
      // Edit application
      this.applicationService.editApplication(this.application).subscribe(data => {
        console.log(data);
        console.log(this.application);
        if(data.success){ 
          this.dtElements.forEach((dtElement: DataTableDirective, index: number) => {
            if(index===0){
              dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                // Destroy the table first
                dtInstance.destroy();
                console.log(this.users[indexUser]);
                this.contributorsApplication.push(this.users[indexUser]);
                // Call the addTrigger to rerender again
                this.deleteTrigger.next();
              });
            }        
          });
        }
      });
    }  
  }
  private deleteUserApplicationTable(indexUser){
      var indexAplicatonUser=this.application.contributors.indexOf(this.contributorsApplication[indexUser]._id);
      this.application.contributors.splice(indexAplicatonUser,1);
      // Edit application
      this.applicationService.editApplication(this.application).subscribe(data => {
        if(data.success){ 
          this.dtElements.forEach((dtElement: DataTableDirective, index: number) => {
            if(index===0){
              dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              // Destroy the table first
              dtInstance.destroy();
              this.contributorsApplication.splice(indexUser,1);
              // Call the addTrigger to rerender again
              this.deleteTrigger.next();
              });
            }        
          });
        }
      });
  }
  private getApplicationContributorsInit(){
    // Get application contributors
    this.applicationService.getApplicationContributors(this.applicationId,this.localizeService.parser.currentLang).subscribe(data => {
      console.log(data);
      if(data.success){
        this.application=data.application;
        this.contributorsApplication=data.contributors;
        console.log(this.contributorsApplication);
      }
      this.deleteTrigger.next();
    });
  }
  private getApplicationContributors(){
    // Get application contributors
    this.applicationService.getApplicationContributors(this.applicationId,this.localizeService.parser.currentLang).subscribe(data => {
      this.dtElements.forEach((dtElement: DataTableDirective, index: number) => {
        if(index===0){
          dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            // Destroy the table first
            dtInstance.destroy();
            if(data.success){
              this.application=data.application;
              this.contributorsApplication=data.contributors;
            }else{
              this.application=undefined;
              this.contributorsApplication=[];
            }        
            this.deleteTrigger.next();
          });
        }        
      });   
    });
  }
  // Function to get users from the database
  private getUsers() {
    this.authService.getAllUsers(this.localizeService.parser.currentLang).subscribe(data => {
      if(data.success){
        this.users=data.users;
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
      if (res.hasOwnProperty('option') && res.option === "application-contributors") {
        this.getApplicationContributors();
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
    this.getApplicationContributorsInit();
    this.getUsers(); 
    this.tabClick();       
  }
   ngOnDestroy(){
    this.addTrigger.unsubscribe();
    this.deleteTrigger.unsubscribe();
    this.subscriptionTabClick.unsubscribe();
  }
}
