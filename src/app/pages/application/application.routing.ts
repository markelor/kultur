import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LocalizeRouterModule } from 'localize-router';
import { CreateApplicationComponent } from './create-application/create-application.component';
import { ManageApplicationsComponent } from './manage-applications/manage-applications.component';
import { ApplicationCrudComponent } from './manage-applications/application-crud/application-crud.component';
import { AuthGuard } from '../guards/auth.guard';
import { ModeratorGuard } from '../guards/moderator.guard';

const routes: Routes = [
	{ path: '', component: CreateApplicationComponent,canActivate:[AuthGuard], pathMatch: 'full' },
	{ path: 'create-route', component: CreateApplicationComponent,canActivate:[ModeratorGuard] },
	{ path: 'manage-route', component: ManageApplicationsComponent,canActivate:[ModeratorGuard] },
	{ path: 'manage-route/:id',  component: ApplicationCrudComponent,canActivate:[AuthGuard]}	
];
@NgModule({
  imports: [
    RouterModule.forChild(routes),
    LocalizeRouterModule.forChild(<any> routes)
  ],
  exports: [ RouterModule, LocalizeRouterModule ]
})
export class ApplicationRoutingModule { }