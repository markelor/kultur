
import { Injectable, Inject } from '@angular/core';
import { Subject }    from 'rxjs/Subject';
@Injectable()
export class ObservableService {
  public eventsEvent;
  public mapEvents;
  public mapSingleEvent;
  public mapClickType;
  public applicationEvents;
  public applicationServices;
  public applicationObservations;
  public confirmationModalType;
  public createModalType;
  public avatarType;
  public modalCount=0;
  private notify = new Subject<any>();
  /**
   * Observable string streams
   */
  notifyObservable = this.notify.asObservable();

  constructor(){}

  public notifyOther(data: any) {
    if (data) {
      this.notify.next(data);
    }
  }
}


