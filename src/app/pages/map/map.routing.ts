import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LocalizeRouterModule } from 'localize-router';
import { EventComponent } from './event/event.component';
import { AuthGuard } from '../guards/auth.guard';


const routes: Routes = [
	{ path: '', component: EventComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    LocalizeRouterModule.forChild(<any> routes)
  ],
  exports: [ RouterModule, LocalizeRouterModule ]
})

export class MapRoutingModule { }