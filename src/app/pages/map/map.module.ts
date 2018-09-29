import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { COMPOSITION_BUFFER_MODE } from '@angular/forms';
import { AgmCoreModule } from '@agm/core';
import { MapRoutingModule }  from './map.routing';
import { EventsComponent } from './events/events.component';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from "../../shared/shared.module";
import { TemplatesModule } from "../../templates/templates.module";
import { BindContentPipe } from '../../shared/pipes/bind-content.pipe';
import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';
import { InlineSVGModule } from 'ng-inline-svg';
import { InlineSVGDirective} from 'ng-inline-svg';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DateNamePipe } from "../../shared/pipes/date-name.pipe";

@NgModule({
  imports: [
    CommonModule,FormsModule,ReactiveFormsModule,AgmCoreModule,MapRoutingModule,TranslateModule,SharedModule,TemplatesModule,AgmSnazzyInfoWindowModule,InlineSVGModule,NgbModule
  ],
  declarations: [EventsComponent],
  exports: [EventsComponent],
  providers:[{provide: COMPOSITION_BUFFER_MODE, useValue: false},BindContentPipe,DateNamePipe]
})

export class MapModule { }
