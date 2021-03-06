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
    this.language=language;
    var data = {'province': province,'municipality': municipality, 'language': language };
    return this.http.post<any>(this.domain + 'place/getPlacesCoordinates',data);
  }
   // Function to get all user places from the database
  public getPlacesGeonameId(filters,language) {
    var data = {'filters': filters, 'language': language };
    return this.http.post<any>(this.domain + 'place/getPlacesGeonameId',data);
  }
  public getGeonamesJson(geonameType,language,name){
    return this.http.get<any>('assets/json/'+geonameType+'/'+language+'/'+name+'.json');     
  }
  public placesGeonameIdFilterSearchTitle(title: Observable<string>,filters,language) {
    return title.debounceTime(400)
      .distinctUntilChanged()
      .switchMap(search => this.getPlacesGeonameIdTitleFilter(title,filters,language));
  }
  public placesGeonameIdFilterSearchPrice(price: Observable<string>,filters,language) {
    return price.debounceTime(400)
      .distinctUntilChanged()
      .switchMap(search => this.getPlacesGeonameIdPriceFilter(price,filters,language));
  }
  // Function to get events title from the database
  public getPlacesGeonameIdTitleFilter(title,filters,language) {
    var data = {'filters': filters, 'language': language };
    return this.http.post<any>(this.domain + 'place/getPlacesGeonameId',data);

  }
  // Function to get events price from the database
  public getPlacesGeonameIdPriceFilter(price,filters,language) {
    var data = {'filters': filters, 'language': language };
    return this.http.post<any>(this.domain + 'place/getPlacesGeonameId',data);
    
  }
}
