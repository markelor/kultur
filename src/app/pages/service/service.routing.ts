import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LocalizeRouterModule } from 'localize-router';
import { CreateServiceComponent } from './create-service/create-service.component';
import { ContributorGuard } from '../guards/contributor.guard';
import { ManageServicesComponent } from './manage-services/manage-services.component';
import { EditServiceComponent } from './manage-services/edit-service/edit-service.component';

const routes: Routes = [
	{ path: '', component: CreateServiceComponent,canActivate:[ContributorGuard], pathMatch: 'full' },
	{ path: 'create-route', component: CreateServiceComponent,canActivate:[ContributorGuard] },
	{ path: 'manage-route', component: ManageServicesComponent,canActivate:[ContributorGuard] },	
	{ path: 'manage-route/edit-route/:id', component: EditServiceComponent,canActivate:[ContributorGuard] }
	
];
@NgModule({
  imports: [
    RouterModule.forChild(routes),
    LocalizeRouterModule.forChild(<any> routes)
  ],
  exports: [ RouterModule, LocalizeRouterModule ]
})
export class ServiceRoutingModule { }