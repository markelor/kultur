import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { LocalizeRouterService } from 'localize-router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
@Injectable()
export class PlaceService {
  public domain = this.authService.domain;
  public route;
  public language;
  constructor(
    private authService: AuthService,
    private localizeService:LocalizeRouterService,
    private http: HttpClient
  ) { }

  // Function to get all user places from the database
  public getPlacesCoordinates(province,municipality,language) {
    this.route= encodeURIComponent(province)+'/'+encodeURIComponent(municipality)+'/';
    this.language=language;
    return this.http.get<any>(this.domain + 'place/getPlacesCoordinates/'+this.route+language);
  }
  public getGeonamesJson(geonameType,language,name){
    return this.http.get<any>('assets/json/'+geonameType+'/'+language+'/'+name+'.json');     
  }
}