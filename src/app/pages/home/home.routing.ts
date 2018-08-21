import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LocalizeRouterModule } from 'localize-router';
import { HomeComponent } from './home.component';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
const routes: Routes = [
	{ path: '', component: HomeComponent, pathMatch: 'full' }
];
@NgModule({
  imports: [
    RouterModule.forChild(routes),
    LocalizeRouterModule.forChild(<any> routes)
  ],
  exports: [ RouterModule, LocalizeRouterModule ]
})
export class HomeRoutingModule { }

