import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LocalizeRouterModule } from 'localize-router';
import { CreateObservationComponent } from './create-observation/create-observation.component';
import { AuthGuard } from '../guards/auth.guard';
import { ModeratorGuard } from '../guards/moderator.guard';
import { ManageObservationsComponent } from './manage-observations/manage-observations.component';
import { EditObservationComponent } from './manage-observations/edit-observation/edit-observation.component';

const routes: Routes = [
	{ path: '', component: CreateObservationComponent,canActivate:[AuthGuard], pathMatch: 'full' },
	{ path: 'create-route', component: CreateObservationComponent,canActivate:[ModeratorGuard] },
	{ path: 'manage-route', component: ManageObservationsComponent,canActivate:[AuthGuard] },	
	{ path: 'manage-route/edit-route/:id', component: EditObservationComponent,canActivate:[AuthGuard] }
	
];
@NgModule({
  imports: [
    RouterModule.forChild(routes),
    LocalizeRouterModule.forChild(<any> routes)
  ],
  exports: [ RouterModule, LocalizeRouterModule ]
})
export class ObservationRoutingModule { }