import { Component, OnInit,PLATFORM_ID, Inject} from '@angular/core';
//import { ThemeService } from '../../services/theme.service';
import { AuthService } from '../../services/auth.service';
import { LocalizeRouterService } from 'localize-router';
import { TranslateService } from '@ngx-translate/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
declare var sidebarObj: any;
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit {
  public permission;
 
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private authService:AuthService,
    private localizeService:LocalizeRouterService
  ) { 
  }

  private getPermission() {
    if(this.authService.user){
      this.permission=this.authService.user.permission;
    }
  }

  ngOnInit() {
    this.getPermission();
    if (isPlatformBrowser(this.platformId)) {
      sidebarObj.init();
      sidebarObj.secondLevel();    
    }

      
  } 
}
