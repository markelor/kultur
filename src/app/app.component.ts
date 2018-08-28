import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LocalizeRouterService } from 'localize-router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(translate: TranslateService,private localizeService: LocalizeRouterService) {
    translate.use(this.localizeService.parser.currentLang);
  }

}
