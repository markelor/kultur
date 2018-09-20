import { Component,OnInit,OnDestroy,ViewChild,PLATFORM_ID, APP_ID, Inject } from '@angular/core';
import { EventService } from '../../../services/event.service';
import { LocalizeRouterService } from 'localize-router';
import { TranslateService } from '@ngx-translate/core';
import { ObservableService } from '../../../services/observable.service';
import { Subscription } from 'rxjs/Subscription';
import { BindContentPipe } from '../../../shared/pipes/bind-content.pipe';
import { isPlatformBrowser, CommonModule } from '@angular/common';
@Component({
  selector: 'single-event-map',
  templateUrl: './single-event.component.html',
  styleUrls: ['./single-event.component.css']
})
export class SingleEventComponent implements OnInit{
  public lat: number = 42.88305555555556;
  public lng: number = -1.9355555555555555;
  public zoom: number = 8;
  private coordinates;
  public markers: marker[]=[];
  private subscription:Subscription;
  public browser=false;
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private localizeService:LocalizeRouterService,
    private eventService:EventService,
    private translate:TranslateService,
    private observableService:ObservableService,
    private bindPipe: BindContentPipe
    ) {    
  }
  private clickedMarker(label: string, index: number) {
    //console.log(`clicked the marker: ${label || index}`)
  }
  public placeClick($event){
    this.observableService.mapClickType="map-click-place";
    this.observableService.notifyOther({option: this.observableService.mapClickType,lat:$event.coords.lat,lng:$event.coords.lng});
  }
  private addMarker(data){
    this.lat=Number(data.lat);
    this.lng=Number(data.lng);
    //this.map._mapsWrapper.setCenter({lat: this.lat, lng: this.lng}));
    this.markers.push({      
      lat: Number(data.lat),
      lng: Number(data.lng),
      customInfo: data.icon,
      /*labelOptions: {
        color: '#CC0000',
        fontFamily: '',
        fontSize: '14px',
        fontWeight: 'bold',
        text: data.title
       },*/
      draggable: true
    });
  }
  private handleSVG(svg: SVGElement, parent: Element | null): SVGElement {
    svg.setAttribute('width', '80');
    svg.setAttribute('height', '80');
    return svg;
  }
  private onSvgInserted(event,m){
    var icon={
      url:"data:image/svg+xml;utf-8,"+this.bindPipe.transform(event,undefined,undefined).changingThisBreaksApplicationSecurity.outerHTML,
      scaledSize: {
        height: 40,
        width: 40
      }
    }
    setTimeout(()=>{ 
      m.icon=icon;
    });   
  }

  ngOnInit() {
    this.observableService.mapSingleEvent="map-single-event";
    this.subscription=this.observableService.notifyObservable.subscribe(res => {
      if (res.hasOwnProperty('option') && res.option === this.observableService.mapSingleEvent) {
        this.markers=[];
        this.addMarker(res.value);
      }
    }); 
    if (isPlatformBrowser(this.platformId)) {
      this.browser=true;
    }   
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();     
  }
}
// just an interface for type safety.
interface marker {
	lat: number;
	lng: number;
  icon?:object;
  customInfo:string;
	labelOptions?: object;
	draggable: boolean;
}

