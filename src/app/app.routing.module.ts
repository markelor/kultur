import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Location }             from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { PagesComponent } from './pages/pages.component';
import { LocalizeRouterModule, LocalizeRouterSettings, LocalizeParser, ManualParserLoader } from 'localize-router';
 //import { LocalizeRouterHttpLoader } from 'localize-router-http-loader';
import { TranslateService } from '@ngx-translate/core';

 /*export function createTranslateLoader(translate: TranslateService, location: Location, settings: LocalizeRouterSettings, http: HttpClient) {
  return new LocalizeRouterHttpLoader(translate, location, settings, http)
} */

export function createTranslateLoader(translate: TranslateService, location: Location, settings: LocalizeRouterSettings,) {
  return new ManualParserLoader(translate, location, settings, ['eu','es', 'en'], '');
}

const routes: Routes = [
  { path: '**', component: PagesComponent,pathMatch: 'full' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes,{onSameUrlNavigation: 'reload'}),
    LocalizeRouterModule.forRoot(routes, {
      parser: {
        provide: LocalizeParser,
        useFactory: (createTranslateLoader),
        deps: [TranslateService, Location, LocalizeRouterSettings]
      }
    })
  ],
  exports: [ RouterModule, LocalizeRouterModule ]
})
export class AppRoutingModule {}

