import { Component, OnInit } from '@angular/core';
import { LocalizeRouterService } from 'localize-router';
import { Subscription } from 'rxjs/Subscription';
import { AuthService } from '../services/auth.service';
@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html'
})
export class PagesComponent implements OnInit {
  constructor(
    private authService:AuthService
  ) { 
  }
  ngOnInit() {
  	this.authService.loadUser();
  }

}
