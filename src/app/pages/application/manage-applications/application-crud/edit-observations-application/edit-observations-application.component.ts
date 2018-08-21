import { Component, OnInit,Injectable,Input,ViewChildren,QueryList } from '@angular/core';
import { LocalizeRouterService } from 'localize-router';
import { AuthService } from '../../../../../services/auth.service';
import { ObservationService } from '../../../../../services/observation.service';
import { ApplicationService } from '../../../../../services/application.service';
import { TranslateService,LangChangeEvent } from '@ngx-translate/core';
import { Application } from '../../../../../class/application';
import { Subject } from 'rxjs/Subject';
import {DataTableDirective} from 'angular-datatables';
import { Subscription } from 'rxjs/Subscription';
import { AuthGuard} from '../../../../guards/auth.guard';
import { Router,ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-observations-application',
  templateUrl: './edit-observations-application.component.html',
  styleUrls: ['./edit-observations-application.component.css']
})
export class EditObservationsApplicationComponent implements OnInit {
  public message;
  public messageClass;
  private applicationId;
  private application;
  public observationsApplication=[];
  public observations;
  @ViewChildren(DataTableDirective)
  dtElements: QueryList<DataTableDirective>;
  public dtOptions: any = {};
  public addTrigger: Subject<any> = new Subject();
  public deleteTrigger: Subject<any> = new Subject();
  private subscriptionLanguage: Subscription;
  constructor(
    private localizeService:LocalizeRouterService,
    private applicationObservation:ApplicationService,
    private authObservation:AuthService,
    private observationObservation:ObservationService,
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
        { responsivePriority: 5, targets: 1 },
        { responsivePriority: 4, targets: 2 },
        { responsivePriority: 3, targets: 3 },
        { responsivePriority: 2, targets: 4 }
      ]
    };
  }
  private addObservationApplicationTable(indexObservation){
    if(!this.application || !this.application.observations.includes(this.observations[indexObservation]._id)){
      this.application.observations.push(this.observations[indexObservation]._id);
      // Edit application
      this.applicationObservation.editApplication(this.application).subscribe(data => {
        if(data.success){ 
          this.dtElements.forEach((dtElement: DataTableDirective, index: number) => {
            if(index===0){
              dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                // Destroy the table first
                dtInstance.destroy();
                this.observationsApplication.push(this.observations[indexObservation]);
                // Call the addTrigger to rerender again
                this.deleteTrigger.next();
              });
            }        
          });
        }
      });
    }  
  }
  private deleteObservationApplicationTable(indexObservation){
      var indexAplicatonObservation=this.application.observations.indexOf(this.observationsApplication[indexObservation]._id);
      this.application.observations.splice(indexAplicatonObservation,1);
      // Edit application
      this.applicationObservation.editApplication(this.application).subscribe(data => {
        if(data.success){ 
          this.dtElements.forEach((dtElement: DataTableDirective, index: number) => {
            if(index===0){
              dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              // Destroy the table first
              dtInstance.destroy();
              this.observationsApplication.splice(indexObservation,1);
              // Call the addTrigger to rerender again
              this.deleteTrigger.next();
              });
            }        
          });
        }
      });
  }
  private getApplicationObservationsInit(){
    // Get application observations
    this.applicationObservation.getApplicationObservations(this.applicationId,this.localizeService.parser.currentLang).subscribe(data => {
      if(data.success){
        this.application=data.application;
        this.observationsApplication=data.observations;
      }
      this.deleteTrigger.next();
    });
  }
  // Function to get observations from the database
  private getObservationsInit() {
    this.observationObservation.getObservations(this.localizeService.parser.currentLang).subscribe(data => {
      console.log(data);
      if(data.success){
        this.observations=data.observations;
      }
      this.addTrigger.next();
    });
  }
   private getApplicationObservations(){
    // Get application observations
    this.applicationObservation.getApplicationObservations(this.applicationId,this.localizeService.parser.currentLang).subscribe(data => {
      this.dtElements.forEach((dtElement: DataTableDirective, index: number) => {
        if(index===0){
          dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            // Destroy the table first
            dtInstance.destroy();
            if(data.success){
              this.application=data.application;
              this.observationsApplication=data.observations;
            }else{
              this.application=undefined;
              this.observationsApplication=[];
            }        
            this.deleteTrigger.next();
          });
        }        
      });   
    });
  }
  // Function to get observations from the database
  private getObservations() {
    this.observationObservation.getObservations(this.localizeService.parser.currentLang).subscribe(data => {
      if(data.success){
        this.dtElements.forEach((dtElement: DataTableDirective, index: number) => {
          if(index===1){
            dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              // Destroy the table first
              dtInstance.destroy();
              this.observations=data.observations;
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
    this.authObservation.getAuthentication(this.localizeService.parser.currentLang).subscribe(authentication => {
      if(!authentication.success){
        this.authObservation.logout();
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
    this.getApplicationObservationsInit();
    this.getObservationsInit();  
    this.subscriptionLanguage =this.translate.onLangChange.subscribe((observation: LangChangeEvent) => {
      this.localizeService.parser.currentLang=observation.lang;
      this.getApplicationObservations();
      this.getObservations(); 
    });       
  }
   ngOnDestroy(){
    this.subscriptionLanguage.unsubscribe();
    this.addTrigger.unsubscribe();
    this.deleteTrigger.unsubscribe();
  }
}