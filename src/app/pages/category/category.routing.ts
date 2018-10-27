import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LocalizeRouterModule } from 'localize-router';
import { CreateCategoryComponent } from './create-category/create-category.component';
import { AdminGuard } from '../guards/admin.guard';
import { ModeratorGuard } from '../guards/moderator.guard';

const routes: Routes = [
	{ path: '', redirectTo: 'create-route', pathMatch: 'full' },
	{ path: 'create-route', component: CreateCategoryComponent,canActivate:[AdminGuard] },

	
];
@NgModule({
  imports: [
    RouterModule.forChild(routes),
    LocalizeRouterModule.forChild(<any> routes)
  ],
  exports: [ RouterModule, LocalizeRouterModule ]
})
export class CategoryRoutingModule { }