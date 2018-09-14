export  class CreateModule { }
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemplatesRoutingModule }  from './templates.routing';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { RightSidebarComponent } from './right-sidebar/right-sidebar.component';
import { ConfirmationModalComponent } from './modals/confirmation-modal/confirmation-modal.component';
import { CreateModalComponent } from './modals/create-modal/create-modal.component';
import { InformationModalComponent } from './modals/information-modal/information-modal.component';
import { SharedModule } from "../shared/shared.module";
import { GroupByPipe } from '../shared/pipes/group-by.pipe';
import { DisableCategoriesPipe } from '../shared/pipes/disable-categories.pipe';
import { SpacePipe } from '../shared/pipes/space.pipe';
import { BindContentPipe } from '../shared/pipes/bind-content.pipe';
import { CompareDatePipe } from '../shared/pipes/compare-date.pipe';
import { FormArrayPipe } from '../shared/pipes/form-array.pipe';
import { DataTablesModule } from 'angular-datatables';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { COMPOSITION_BUFFER_MODE } from '@angular/forms';
import { EventFormComponent } from './forms/event-form/event-form.component';
import { CategoryFormComponent } from './forms/category-form/category-form.component';
import { ServiceFormComponent } from './forms/service-form/service-form.component';
import { ServiceTypeFormComponent } from './forms/service-type-form/service-type-form.component';
import { ObservationFormComponent } from './forms/observation-form/observation-form.component';
import { CommentComponent } from './comment/comment.component';
import { FileUploadModule } from 'ng2-file-upload';
import { SingleEventComponent } from '../pages/map/single-event/single-event.component';
import { AgmCoreModule } from '@agm/core';
import { MomentModule } from 'ngx-moment';
// Import the Froala Editor plugin.
import * as FroalaEditor from 'froala-editor/js/froala_editor.pkgd.min';
// Import Angular plugin.
import { FroalaEditorModule, FroalaViewModule,FroalaEditorDirective, FroalaViewDirective } from 'angular-froala-wysiwyg';
import { ApplicationFormComponent } from './forms/application-form/application-form.component';
import { FormsComponent } from './forms/forms.component';
import { InlineSVGModule } from 'ng-inline-svg';
import { FilterFormComponent } from './forms/filter-form/filter-form.component';
@NgModule({
  imports: [
    CommonModule,FormsModule,ReactiveFormsModule,AgmCoreModule,MomentModule,
    FroalaEditorModule.forRoot(), FroalaViewModule.forRoot(),FileUploadModule,
    SharedModule,TranslateModule,TemplatesRoutingModule,DataTablesModule,NgbModule,InlineSVGModule
  ],
  declarations: [
    NavbarComponent,SidebarComponent,RightSidebarComponent,ConfirmationModalComponent,CreateModalComponent,InformationModalComponent, EventFormComponent,SingleEventComponent, ApplicationFormComponent,CategoryFormComponent,FormsComponent,ServiceFormComponent,ServiceTypeFormComponent,ObservationFormComponent,CommentComponent,FilterFormComponent
  ],
  exports: [
    NavbarComponent,SidebarComponent,RightSidebarComponent,ConfirmationModalComponent,CreateModalComponent,InformationModalComponent,EventFormComponent,SingleEventComponent,ApplicationFormComponent,CategoryFormComponent,FormsComponent,ServiceFormComponent,ServiceTypeFormComponent,ObservationFormComponent,CommentComponent,FilterFormComponent
    ],
   providers:[
     GroupByPipe,SpacePipe,BindContentPipe,CompareDatePipe,DisableCategoriesPipe,FormArrayPipe,{provide: COMPOSITION_BUFFER_MODE, useValue: false}
   ],
  entryComponents: [
    ConfirmationModalComponent,CreateModalComponent,InformationModalComponent
  ]
})
export class TemplatesModule { } 

