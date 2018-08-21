import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LocalizeRouterModule } from 'localize-router';
import { CreateEventComponent } from './create-event/create-event.component';
import { ManageEventsComponent } from './manage-events/manage-events.component';
import { SeeEventComponent } from './see-event/see-event.component';
import { EditEventComponent } from './manage-events/edit-event/edit-event.component';
import { AuthGuard } from '../guards/auth.guard';
import { ModeratorGuard } from '../guards/moderator.guard';

const routes: Routes = [
	{ path: '', component: CreateEventComponent,canActivate:[AuthGuard], pathMatch: 'full' },
	{ path: 'create-route', component: CreateEventComponent,canActivate:[AuthGuard] },	
	{ path: 'manage-route', component: ManageEventsComponent,canActivate:[AuthGuard] },	
	{ path: 'see-route/:id', component: SeeEventComponent },
	{ path: 'manage-route/edit-route/:id', component: EditEventComponent,canActivate:[AuthGuard] }	

];
@NgModule({
  imports: [
    RouterModule.forChild(routes),
    LocalizeRouterModule.forChild(<any> routes)
  ],
  exports: [ RouterModule, LocalizeRouterModule ]
})
export class EventRoutingModule { }