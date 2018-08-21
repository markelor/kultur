import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { AdministratorRoutingModule }  from './administrator.routing';
import { UsersAdministratorComponent } from './users-administrator/users-administrator.component';
import { EventsAdministratorComponent } from './events-administrator/events-administrator.component';
import { ServicesAdministratorComponent } from './services-administrator/services-administrator.component';
import { ObservationsAdministratorComponent } from './observations-administrator/observations-administrator.component';
import { ApplicationsAdministratorComponent } from './applications-administrator/applications-administrator.component';
import { EditApplicationComponent } from './applications-administrator/edit-application/edit-application.component';
import { SharedModule } from "../../shared/shared.module";
import { TranslateModule } from '@ngx-translate/core';
import { DataTablesModule } from 'angular-datatables';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { UserModalComponent } from './users-administrator/user-modal/user-modal.component';
import { TemplatesModule } from '../../templates/templates.module';
import { COMPOSITION_BUFFER_MODE } from '@angular/forms';
import { BindContentPipe } from '../../shared/pipes/bind-content.pipe';
import { GroupByPipe } from '../../shared/pipes/group-by.pipe';
import { InlineSVGModule } from 'ng-inline-svg';


@NgModule({
  imports: [
    CommonModule,FormsModule,
    ReactiveFormsModule,SharedModule,TranslateModule,AdministratorRoutingModule,DataTablesModule,
    NgbModule,TemplatesModule,InlineSVGModule
  ],
  declarations: [UsersAdministratorComponent,UserModalComponent, EventsAdministratorComponent,ServicesAdministratorComponent,ObservationsAdministratorComponent,ApplicationsAdministratorComponent, EditApplicationComponent],
  providers: [
   GroupByPipe,BindContentPipe,{provide: COMPOSITION_BUFFER_MODE, useValue: false}
  ],
  entryComponents: [
    UserModalComponent
  ]
})
export class AdministratorModule { }





