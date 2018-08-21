import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { COMPOSITION_BUFFER_MODE } from '@angular/forms';
import { AgmCoreModule } from '@agm/core';
import { MapRoutingModule }  from './map.routing';
import { EventComponent } from './event/event.component';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from "../../shared/shared.module";
import { BindContentPipe } from '../../shared/pipes/bind-content.pipe';
import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';
import { EventFormComponent } from './event-form/event-form.component';
import { InlineSVGModule } from 'ng-inline-svg';
import { InlineSVGDirective} from 'ng-inline-svg';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
@NgModule({
  imports: [
    CommonModule,FormsModule,ReactiveFormsModule,AgmCoreModule,MapRoutingModule,TranslateModule,SharedModule,AgmSnazzyInfoWindowModule,InlineSVGModule,NgbModule
  ],
  declarations: [EventComponent,EventFormComponent],
  exports: [EventComponent,EventFormComponent],
  providers:[{provide: COMPOSITION_BUFFER_MODE, useValue: false},BindContentPipe]
})

export class MapModule { }
