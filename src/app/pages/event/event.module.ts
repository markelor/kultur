import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common"
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { EventRoutingModule }  from './event.routing';
import { SeeEventComponent } from './see-event/see-event.component';
import { CreateEventComponent } from './create-event/create-event.component';
import { EditEventComponent } from './manage-events/edit-event/edit-event.component';
import { DataTablesModule } from 'angular-datatables';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule} from "../../shared/shared.module";
import { TemplatesModule } from '../../templates/templates.module';
import { COMPOSITION_BUFFER_MODE } from '@angular/forms';
import { ManageEventsComponent } from './manage-events/manage-events.component';
import { NgxGalleryModule } from 'ngx-gallery';
import { ShareButtonsModule } from '@ngx-share/buttons';
import { ReactionsModalComponent } from './see-event/reactions-modal/reactions-modal.component';
import { HasBeenTranslatedPipe } from "../../shared/pipes/has-been-translated.pipe";
import { TranslateLanguagePipe } from "../../shared/pipes/translate-language.pipe";
import { HtmlTextPipe} from "../../shared/pipes/html-text.pipe";
import { EventResolverComponent } from './see-event/event-resolver/event-resolver.component';

@NgModule({
  imports: [
  	CommonModule,FormsModule,EventRoutingModule,ReactiveFormsModule,TranslateModule,SharedModule,TemplatesModule,DataTablesModule,NgbModule,NgxGalleryModule,ShareButtonsModule
  ],
  declarations: [SeeEventComponent,CreateEventComponent, ManageEventsComponent,EditEventComponent,ReactionsModalComponent],
  providers: [
   {provide: COMPOSITION_BUFFER_MODE, useValue: false},HasBeenTranslatedPipe,TranslateLanguagePipe,HtmlTextPipe,EventResolverComponent
  ],
    entryComponents: [
      ReactionsModalComponent
  ]
})
export  class EventModule { }
