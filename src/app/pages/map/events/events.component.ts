import { Component,OnDestroy,PLATFORM_ID, Inject } from '@angular/core';
import { ObservableService } from '../../../services/observable.service';
import { LocalizeRouterService } from 'localize-router';
import { TranslateService } from '@ngx-translate/core';
import { BindContentPipe } from '../../../shared/pipes/bind-content.pipe';
import { GroupByPipe } from '../../../shared/pipes/group-by.pipe';
import { ActivatedRoute,Router,NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import * as moment from 'moment-timezone';
import { isPlatformBrowser} from '@angular/common';
import { Meta,Title } from '@angular/platform-browser';

@Component({
  selector: 'map-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent  {	
  private startTimestamp;
  private endTimestamp;
  public lat: number = 42.88305555555556;
  public lng: number = -1.9355555555555555;
  public zoom: number = 9;
  public markers: marker[]=[];
  private subscription:Subscription;
  public browser=false;
  public bigestLat;
  public smallestLat;
  public bigestLng;
  public smallestLng;
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private meta: Meta,
    private metaTitle: Title,
    private localizeService:LocalizeRouterService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private observableService: ObservableService,
    private translate:TranslateService,
    private bindPipe: BindContentPipe,
    private groupByPipe: GroupByPipe) { 
    //twitter
    //this.meta.updateTag({ name: 'twitter:card', content: 'summary' });
    //this.meta.updateTag({ name: 'twitter:site', content: '@kulturekintzak' });
    //this.meta.updateTag({ name: 'twitter:image', content: 'assets/img/defaults/kulturekintzak.svg' });
    //facebbok
    //this.meta.updateTag({ property: 'og:type', content: 'article' });
    //this.meta.updateTag({ property: 'og:image', content: 'assets/img/defaults/kulturekintzak.svg'});
    this.translate.get('metatag.map-title').subscribe(
      data => {        
      this.metaTitle.setTitle(data);
      //this.meta.updateTag({ name: 'twitter:title', content: data });
      //this.meta.updateTag({ property: 'og:title', content: data });
    });
    this.translate.get('metatag.map-description').subscribe(
      data => {         
      this.meta.addTag({ name: 'description', content: data });
      //this.meta.updateTag({ name: 'twitter:description', content: data });
      //this.meta.updateTag({ property: 'og:description', content: data });
    });
     this.translate.get('metatag.map-keywords').subscribe(
      data => {         
      this.meta.addTag({ name: 'keywords', content: data });
    });
    
  }
  private clickedMarker(label: string, index: number) {
    //console.log(`clicked the marker: ${label || index}`)
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
  private addMarker(data){
    if(!this.bigestLat && !this.bigestLng && !this.smallestLat && !this.smallestLng){
      this.bigestLat=data.place.coordinates.lat;
      this.bigestLng=data.place.coordinates.lng;
      this.smallestLat=data.place.coordinates.lat;
      this.smallestLng=data.place.coordinates.lng;
    }
    if(data.place.coordinates.lat>this.bigestLat){
      this.bigestLat=data.place.coordinates.lat;
    }
    if(data.place.coordinates.lat<this.smallestLat){
      this.smallestLat=data.place.coordinates.lat;
    }
    if(data.place.coordinates.lng>this.bigestLng){
      this.bigestLng=data.place.coordinates.lng;
    }
    if(data.place.coordinates.lng<this.smallestLng){
      this.smallestLng=data.place.coordinates.lng;
    }
    this.lat=Number((this.bigestLat+this.smallestLat)/2);
    this.lng=Number((this.bigestLng+this.smallestLng)/2);
    //this.map._mapsWrapper.setCenter({lat: this.lat, lng: this.lng}));
    if(data.images.poster.length===0){
      data.images.poster.push({url:'assets/img/defaults/event/default-'+this.localizeService.parser.currentLang+'.png'});      
    }
    var icon;
    if(!data.selectedCategory && data.categories.length>1){
      icon=data.categories[1].icons[0].url;
    }else{
      var exists=false;
      for (var i = 0; i < data.categories.length; ++i) {
        if(data.categories[i].parentId===data.selectedCategory){

          icon=data.categories[i].icons[0].url;
          exists=true;
        }
      }
      if(!exists){
        icon=data.categories[data.categories.length-1].icons[0].url;
      }
    }
    this.markers.push({      
      lat: Number(data.place.coordinates.lat),
      lng: Number(data.place.coordinates.lng),
      customInfo: {
        icon: icon,
        event:data
      },
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

  ngOnInit() {
     if (isPlatformBrowser(this.platformId)) {
      this.browser=true;
    }
    this.observableService.mapEvents="map-events";
    this.subscription=this.observableService.notifyObservable.subscribe(res => {
      if (res.hasOwnProperty('option') && res.option === this.observableService.mapEvents) {
        if(res.count===0 || !res.exists){
          this.markers=[];
        }
        if(res.exists ){
          this.addMarker(res.value);
        }       
      }
    }); 
  }
}
// just an interface for type safety.
interface marker {
  lat: number;
  lng: number;
  icon?:object;
  customInfo:object;
  labelOptions?: object;
  draggable: boolean;
}

