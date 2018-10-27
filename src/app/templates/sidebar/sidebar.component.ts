import { Component, OnInit,PLATFORM_ID, Inject} from '@angular/core';
//import { ThemeService } from '../../services/theme.service';
import { AuthService } from '../../services/auth.service';
import { LocalizeRouterService } from 'localize-router';
import { TranslateService } from '@ngx-translate/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
declare let $: any;
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
  public closeSidebar(){
    var ksBody = $('body');
    var ksSidebar = $('.ks-sidebar');
    var ksMobileOverlay = $('.ks-mobile-overlay');
    var ksNavbarMenu = $('.ks-navbar-menu');
    var ksNavbarMenuToggle = $('.ks-navbar-menu-toggle');
    var ksNavbarActions = $('.ks-navbar .ks-navbar-actions');
    var ksNavbarActionsToggle = $('.ks-navbar-actions-toggle');

    ksMobileOverlay.removeClass('ks-open');
    ksNavbarMenu.removeClass('ks-open');
    ksNavbarMenuToggle.removeClass('ks-open');
    ksNavbarActions.removeClass('ks-open');
    ksNavbarActionsToggle.removeClass('ks-open');
    ksSidebar.toggleClass('ks-open');
  }

  ngOnInit() {
    this.getPermission();
    if (isPlatformBrowser(this.platformId)) {
      sidebarObj.init();
      sidebarObj.secondLevel();    
    }

      
  } 
}
