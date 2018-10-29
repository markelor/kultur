import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LocalizeRouterService } from 'localize-router';
import { Router,NavigationEnd } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(
  	private translate: TranslateService,
  	private localizeService: LocalizeRouterService,
  	public router: Router
  	) {
    translate.use(this.localizeService.parser.currentLang);
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
      	console.log(event.urlAfterRedirects);
        (<any>window).ga('set', 'page', event.urlAfterRedirects);
        (<any>window).ga('send', 'pageview');
      }
    });
  }

}
