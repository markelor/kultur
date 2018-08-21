import { Component, OnInit } from '@angular/core';
//import { ThemeService } from '../../services/theme.service';
import { TranslateService } from '@ngx-translate/core';
import { LocalizeRouterService } from 'localize-router';
@Component({
  selector: 'right-sidebar',
  templateUrl: './right-sidebar.component.html',
  styleUrls: ['./right-sidebar.component.css']
})
export class RightSidebarComponent implements OnInit {
  constructor(
    private localizeService:LocalizeRouterService,
    private translate:TranslateService,
  ) {
  }

  ngOnInit() {
  }

}
