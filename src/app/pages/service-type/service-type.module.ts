import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common"
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { ServiceTypeRoutingModule }  from './service-type.routing';
import { CreateServiceTypeComponent } from './create-service-type/create-service-type.component';
import { ServiceTypeModalComponent } from './create-service-type/service-type-modal/service-type-modal.component';
import { DataTablesModule } from 'angular-datatables';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule} from "../../shared/shared.module";
import { TemplatesModule } from '../../templates/templates.module';
import { InlineSVGModule } from 'ng-inline-svg';
import { COMPOSITION_BUFFER_MODE } from '@angular/forms';
@NgModule({
  imports: [
  	CommonModule,FormsModule,ReactiveFormsModule,TranslateModule,SharedModule,TemplatesModule,
    ServiceTypeRoutingModule,DataTablesModule,NgbModule,InlineSVGModule
  ],
  declarations: [ServiceTypeModalComponent,CreateServiceTypeComponent],
  providers: [
   {provide: COMPOSITION_BUFFER_MODE, useValue: false}
  ],
    entryComponents: [
    ServiceTypeModalComponent
  ]
})
export  class ServiceTypeModule { }
