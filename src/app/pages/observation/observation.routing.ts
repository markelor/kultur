import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LocalizeRouterModule } from 'localize-router';
import { CreateObservationComponent } from './create-observation/create-observation.component';
import { ContributorGuard } from '../guards/contributor.guard';
import { ManageObservationsComponent } from './manage-observations/manage-observations.component';
import { EditObservationComponent } from './manage-observations/edit-observation/edit-observation.component';

const routes: Routes = [
	{ path: '', component: CreateObservationComponent,canActivate:[ContributorGuard], pathMatch: 'full' },
	{ path: 'create-route', component: CreateObservationComponent,canActivate:[ContributorGuard] },
	{ path: 'manage-route', component: ManageObservationsComponent,canActivate:[ContributorGuard] },	
	{ path: 'manage-route/edit-route/:id', component: EditObservationComponent,canActivate:[ContributorGuard] }
	
];
@NgModule({
  imports: [
    RouterModule.forChild(routes),
    LocalizeRouterModule.forChild(<any> routes)
  ],
  exports: [ RouterModule, LocalizeRouterModule ]
})
export class ObservationRoutingModule { }