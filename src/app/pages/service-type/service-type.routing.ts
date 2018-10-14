import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LocalizeRouterModule } from 'localize-router';
import { CreateServiceTypeComponent } from './create-service-type/create-service-type.component';
import { AdminGuard } from '../guards/admin.guard';

const routes: Routes = [
	{ path: '', redirectTo: 'create-route', pathMatch: 'full' },
	{ path: 'create-route', component: CreateServiceTypeComponent,canActivate:[AdminGuard] },

];
@NgModule({
  imports: [
    RouterModule.forChild(routes),
    LocalizeRouterModule.forChild(<any> routes)
  ],
  exports: [ RouterModule, LocalizeRouterModule ]
})
export class ServiceTypeRoutingModule { }