import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LocalizeRouterModule } from 'localize-router';
import { CreateApplicationComponent } from './create-application/create-application.component';
import { ManageApplicationsComponent } from './manage-applications/manage-applications.component';
import { ApplicationCrudComponent } from './manage-applications/application-crud/application-crud.component';
import { AdminGuard } from '../guards/admin.guard';
import { ContributorGuard } from '../guards/contributor.guard';

const routes: Routes = [
	{ path: '', redirectTo: 'create-route',pathMatch: 'full' },
	{ path: 'create-route', component: CreateApplicationComponent,canActivate:[AdminGuard] },
	{ path: 'manage-route', component: ManageApplicationsComponent,canActivate:[ContributorGuard] },
	{ path: 'manage-route/:id',  component: ApplicationCrudComponent,canActivate:[ContributorGuard]}	
];
@NgModule({
  imports: [
    RouterModule.forChild(routes),
    LocalizeRouterModule.forChild(<any> routes)
  ],
  exports: [ RouterModule, LocalizeRouterModule ]
})
export class ApplicationRoutingModule { }