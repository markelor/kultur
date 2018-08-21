import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common"
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { ServiceRoutingModule }  from './service.routing';
import { CreateServiceComponent } from './create-service/create-service.component';
import { DataTablesModule } from 'angular-datatables';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule} from "../../shared/shared.module";
import { TemplatesModule } from '../../templates/templates.module';
import { COMPOSITION_BUFFER_MODE } from '@angular/forms';
import { ManageServicesComponent } from './manage-services/manage-services.component';
import { EditServiceComponent } from './manage-services/edit-service/edit-service.component';
import { DecodePipe } from '../../shared/pipes/decode.pipe';
import { InlineSVGModule } from 'ng-inline-svg';
@NgModule({
  imports: [
  	CommonModule,FormsModule,ReactiveFormsModule,TranslateModule,SharedModule,TemplatesModule,
    ServiceRoutingModule,DataTablesModule,NgbModule,InlineSVGModule
  ],
  declarations: [CreateServiceComponent, ManageServicesComponent,EditServiceComponent],
  providers: [
   {provide: COMPOSITION_BUFFER_MODE, useValue: false},DecodePipe
  ],
    entryComponents: []
})
export  class ServiceModule { }
