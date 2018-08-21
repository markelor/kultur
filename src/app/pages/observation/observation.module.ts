import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common"
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { ObservationRoutingModule }  from './observation.routing';
import { CreateObservationComponent } from './create-observation/create-observation.component';
import { DataTablesModule } from 'angular-datatables';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule} from "../../shared/shared.module";
import { TemplatesModule } from '../../templates/templates.module';
import { COMPOSITION_BUFFER_MODE } from '@angular/forms';
import { ManageObservationsComponent } from './manage-observations/manage-observations.component';
import { EditObservationComponent } from './manage-observations/edit-observation/edit-observation.component';
import { DecodePipe } from '../../shared/pipes/decode.pipe';
@NgModule({
  imports: [
  	CommonModule,FormsModule,ReactiveFormsModule,TranslateModule,SharedModule,TemplatesModule,
    ObservationRoutingModule,DataTablesModule,NgbModule
  ],
  declarations: [CreateObservationComponent, ManageObservationsComponent,EditObservationComponent],
  providers: [
   {provide: COMPOSITION_BUFFER_MODE, useValue: false},DecodePipe
  ],
    entryComponents: []
})
export  class ObservationModule { }
