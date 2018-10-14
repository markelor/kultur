import { Injectable } from '@angular/core';
import { Router, Resolve, ActivatedRouteSnapshot} from '@angular/router';
import { EventService } from '../../../../services/event.service';
import { LocalizeRouterService } from 'localize-router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/empty' 
@Injectable()
export class EventResolverComponent implements Resolve<any> {
  constructor(
    private eventService: EventService,
    private localizeService:LocalizeRouterService
  ) {}

  resolve(activeRouteSnapshot: ActivatedRouteSnapshot){
     return this.eventService.getEvent(activeRouteSnapshot.params['id'],this.localizeService.parser.currentLang).catch(error => {
     	return Observable.empty();
     });
  }
}

