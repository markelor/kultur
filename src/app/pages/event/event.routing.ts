import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LocalizeRouterModule } from 'localize-router';
import { CreateEventComponent } from './create-event/create-event.component';
import { ManageEventsComponent } from './manage-events/manage-events.component';
import { SeeEventComponent } from './see-event/see-event.component';
import { EditEventComponent } from './manage-events/edit-event/edit-event.component';
import { UserGuard } from '../guards/user.guard';
import { ModeratorGuard } from '../guards/moderator.guard';
import { EventResolverComponent } from './see-event/event-resolver/event-resolver.component';
const routes: Routes = [
	{ path: '', redirectTo: 'create-route', pathMatch: 'full' },
	{ path: 'create-route', component: CreateEventComponent,canActivate:[UserGuard] },	
	{ path: 'manage-route', component: ManageEventsComponent,canActivate:[UserGuard] },	
	{ path: 'see-route/:id', component: SeeEventComponent,runGuardsAndResolvers: 'always',resolve: { event: EventResolverComponent} },
	{ path: 'manage-route/edit-route/:id', component: EditEventComponent,canActivate:[UserGuard] }	

];
@NgModule({
  imports: [
    RouterModule.forChild(routes),
    LocalizeRouterModule.forChild(<any> routes)
  ],
  exports: [ RouterModule, LocalizeRouterModule ]
})
export class EventRoutingModule { }
