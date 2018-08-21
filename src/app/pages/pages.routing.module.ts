import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes,RouterModule } from '@angular/router';
import { LocalizeRouterModule} from 'localize-router';
import { PagesComponent } from './pages.component';
import { ModuleWithProviders } from '@angular/core';
export const routes:Routes=[
  { path:'',
    component: PagesComponent,
    children:[
      { path: '', loadChildren: './home/home.module#HomeModule',pathMatch: 'full' },
      { path: 'admin-route',loadChildren: './administrator/administrator.module#AdministratorModule'},
      { path: 'category-route',loadChildren: './category/category.module#CategoryModule'},
      { path: 'event-route',loadChildren: './event/event.module#EventModule'},
      { path: 'map-route',loadChildren: './map/map.module#MapModule'},
      { path: 'application-route',loadChildren: './application/application.module#ApplicationModule'},
      { path: 'service-route',loadChildren: './service/service.module#ServiceModule'},
      { path: 'service-type-route',loadChildren: './service-type/service-type.module#ServiceTypeModule'},
      { path: 'observation-route',loadChildren: './observation/observation.module#ObservationModule'},
      { path: 'user-route',loadChildren: './user/user.module#UserModule'}    
    ]  
  },
  { path: '',loadChildren: './authentication/authentication.module#AuthenticationModule'}
];
@NgModule({
  imports: [
    RouterModule.forChild(routes),
    LocalizeRouterModule.forChild(<any> routes)
  ],
  exports: [ RouterModule, LocalizeRouterModule ]
})
export class PagesRoutingModule { }


