import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LocalizeRouterModule } from 'localize-router';
import { UsersAdministratorComponent } from './users-administrator/users-administrator.component';
import { EventsAdministratorComponent } from './events-administrator/events-administrator.component';
import { ServicesAdministratorComponent } from './services-administrator/services-administrator.component';
import { ObservationsAdministratorComponent } from './observations-administrator/observations-administrator.component';
import { ApplicationsAdministratorComponent } from './applications-administrator/applications-administrator.component';
import { EditApplicationComponent } from './applications-administrator/edit-application/edit-application.component';
import { AdminGuard } from '../guards/admin.guard';

const routes: Routes = [
	{ path: '', component: UsersAdministratorComponent, pathMatch: 'full',canActivate:[AdminGuard] },
	{ path: 'users-route', component: UsersAdministratorComponent,canActivate:[AdminGuard] },
	{ path: 'events-route', component: EventsAdministratorComponent,canActivate:[AdminGuard] },
	{ path: 'services-route', component: ServicesAdministratorComponent,canActivate:[AdminGuard] },
	{ path: 'observations-route', component: ObservationsAdministratorComponent,canActivate:[AdminGuard] },
	{ path: 'applications-route', component: ApplicationsAdministratorComponent,canActivate:[AdminGuard] },
	{ path: 'applications-route/edit-route/:id', component: EditApplicationComponent,canActivate:[AdminGuard] }
];
@NgModule({
  imports: [
    RouterModule.forChild(routes),
    LocalizeRouterModule.forChild(<any> routes)
  ],
  exports: [ RouterModule, LocalizeRouterModule ]
})
export class AdministratorRoutingModule { }

