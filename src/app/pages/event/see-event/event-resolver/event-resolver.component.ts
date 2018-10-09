import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot} from '@angular/router';
import { EventService } from '../../../../services/event.service';
import { LocalizeRouterService } from 'localize-router';
@Injectable()
export class EventResolverComponent implements Resolve<any> {
  constructor(
    private eventService: EventService,
    private localizeService:LocalizeRouterService
  ) {}

  resolve(activeRouteSnapshot: ActivatedRouteSnapshot, state: RouterStateSnapshot){
     return this.eventService.getEvent(activeRouteSnapshot.params['id'],this.localizeService.parser.currentLang).map(data=>{
       return data;
    });
  }
}