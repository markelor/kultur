import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LocalizeRouterModule } from 'localize-router';
import { UserComponent } from './user.component';
import { AuthGuard } from '../guards/auth.guard';


const routes: Routes = [
	{ path: '', component: UserComponent,canActivate:[AuthGuard], pathMatch: 'full' },
	{ path: 'user-route', component: UserComponent,canActivate:[AuthGuard] }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    LocalizeRouterModule.forChild(<any> routes)
  ],
  exports: [ RouterModule, LocalizeRouterModule ]
})
export class UserRoutingModule { }