import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common"
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { ApplicationRoutingModule }  from './application.routing';
import { CreateApplicationComponent } from './create-application/create-application.component';
import { DataTablesModule } from 'angular-datatables';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule} from "../../shared/shared.module";
import { TemplatesModule } from '../../templates/templates.module';
import { COMPOSITION_BUFFER_MODE } from '@angular/forms';
import { ApplicationCrudComponent } from './manage-applications/application-crud/application-crud.component';
import { EditEventsApplicationComponent } from './manage-applications/application-crud/edit-events-application/edit-events-application.component';
import { EditServicesApplicationComponent } from './manage-applications/application-crud/edit-services-application/edit-services-application.component';
import { EditObservationsApplicationComponent } from './manage-applications/application-crud/edit-observations-application/edit-observations-application.component';
import { ManageApplicationsComponent } from './manage-applications/manage-applications.component';
import { InlineSVGModule } from 'ng-inline-svg';
@NgModule({
  imports: [
  	CommonModule,FormsModule,ReactiveFormsModule,TranslateModule,SharedModule,TemplatesModule,
    ApplicationRoutingModule,DataTablesModule,NgbModule,InlineSVGModule
  ],
  declarations: [CreateApplicationComponent, ManageApplicationsComponent,ApplicationCrudComponent,EditEventsApplicationComponent,EditServicesApplicationComponent,EditObservationsApplicationComponent],
  providers: [
   {provide: COMPOSITION_BUFFER_MODE, useValue: false},
  ],
    entryComponents: [
  ]
})
export  class ApplicationModule { }
