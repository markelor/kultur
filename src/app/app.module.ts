import { NgModule }       from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { FormsModule }    from '@angular/forms';
import { HttpClientModule, HttpClient }    from '@angular/common/http';
import { AppComponent }         from './app.component';
import { AppRoutingModule }     from './app.routing.module';
import { PagesModule } from './pages/pages.module';
import { PLATFORM_ID, APP_ID, Inject } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { AppTranslationModule } from './app.translation.module';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { environment } from '../environments/environment';
import { JWT_OPTIONS, JwtModule } from '@auth0/angular-jwt';

export function jwtOptionsFactory(platformId) {
  return {
    tokenGetter: () => {
      let token = null;
      if (isPlatformBrowser(platformId)) {
        token = localStorage.getItem('token');
      }
      return token;
    }
  };
}

@NgModule({
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    PagesModule,
    AppTranslationModule,
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
        deps: [PLATFORM_ID]
      }
    })
  ],
  declarations: [
  AppComponent
  ],
  providers: [ ],
  bootstrap: [ AppComponent ]
})
export class AppModule {
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(APP_ID) private appId: string) {
    const platform = isPlatformBrowser(platformId) ?
      'in the browser' : 'on the server';
    console.log(`Running ${platform} with appId=${appId}`);
  }
}
