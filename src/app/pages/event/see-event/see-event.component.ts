import { Component, OnInit, PLATFORM_ID, APP_ID, Inject } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { EventService } from '../../../services/event.service';
import { ObservableService } from '../../../services/observable.service';
import { TranslateService,LangChangeEvent } from '@ngx-translate/core';
import { LocalizeRouterService } from 'localize-router';
import { AuthGuard} from '../../guards/auth.guard';
import { ActivatedRoute,Router,NavigationEnd } from '@angular/router';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';
import { BindContentPipe } from '../../../shared/pipes/bind-content.pipe';
import { ReactionsModalComponent } from './reactions-modal/reactions-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { Meta,Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs/Subscription';
@Component({
  selector: 'app-see-event',
  templateUrl: './see-event.component.html',
  styleUrls: ['./see-event.component.css']
})
export class SeeEventComponent implements OnInit {
  private subscriptionLanguage: Subscription;
  public event;
  private categories;
  private galleryOptions: NgxGalleryOptions[];
  private galleryImages: NgxGalleryImage[];
  private reactions;
  private allReactions;
  private existReactionAndUsernames;
  public currentUrl;
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private meta: Meta,
    private metaTitle: Title,
    private authService:AuthService,
    private eventService:EventService,
    private observableService:ObservableService,
    private localizeService:LocalizeRouterService,
    private translate:TranslateService,
    private router:Router,
    private bindContent:BindContentPipe,
    private activatedRoute: ActivatedRoute,
    private authGuard:AuthGuard,
    private modalService:NgbModal) {
      this.translate.get('metatag.see-event-title').subscribe(
        data => {       
        this.metaTitle.setTitle(data);
      });
      this.translate.get('metatag.see-event-description').subscribe(
        data => {         
        this.meta.addTag({ name: 'description', content: data });
      });
       this.translate.get('metatag.see-event-keywords').subscribe(
        data => {         
        this.meta.addTag({ name: 'keywords', content: data });
      });
    }
  private initializeGalleryOptions(){
    this.galleryOptions = [
      { thumbnails: false },
      { breakpoint: 500, "width": "100%", "height": "100%" }
      
  ];

  }
  private initializeGalleryImages(){
    var exists=false;
    if(this.event.language===this.localizeService.parser.currentLang){
      if(this.event.images.poster.length>0){ 
        exists=true;
        this.galleryImages = [
          {
            small: this.event.images.poster[0].url,
            medium:this.event.images.poster[0].url ,
            big: this.event.images.poster[0].url
          }
        ];
      }
    }else{
      for (var i = 0; i < this.event.translation.length; ++i) {
        if(this.event.translation[i].language===this.localizeService.parser.currentLang) {
          if(this.event.translation[i].images.poster.length>0){    
            exists=true,    
            this.galleryImages = [
              {
                small: this.event.translation[i].images.poster[0].url,
                medium:this.event.translation[i].images.poster[0].url ,
                big: this.event.translation[i].images.poster[0].url
              }
            ];
          }
        }           
      }
    }  
    if(!exists){          
      this.galleryImages = [
        {
            small:'assets/img/defaults/event/default-'+this.localizeService.parser.currentLang+'.png',
            medium:'assets/img/defaults/event/default-'+this.localizeService.parser.currentLang+'.png',
            big:'assets/img/defaults/event/default-'+this.localizeService.parser.currentLang+'.png'
        }
      ];
    }   
  }
  private addReaction(reaction){
    this.eventService.newReactionEvent(this.event._id,reaction,this.localizeService.parser.currentLang).subscribe(data=>{
      if(data.success){
        this.getEvent();
      }else{
        if(data.authentication===false){
          this.authService.logout();
          this.authGuard.redirectUrl=this.router.url;
          this.router.navigate([this.localizeService.translateRoute('/sign-in-route')]);
        }
      }
    });  
  }
  private deleteReaction(){
    this.eventService.deleteReactionEvent(this.event._id,this.localizeService.parser.currentLang).subscribe(data=>{
      if(data.success){
        this.getEvent();
      }
    });  
  }
  
  private passCoordinates(){
    var market_info={
      title:this.event.title,
      icon:this.categories[this.categories.length-1].icons[0].url, // Event field
      lat:this.event.place.coordinates.lat, // Lat field
      lng:this.event.place.coordinates.lng, // Lng field
    }
    this.observableService.mapSingleEvent="map-single-event";
    this.observableService.notifyOther({option: this.observableService.mapSingleEvent, value: market_info});
  }
  private initReactions(){
    this.reactions=['like','love','haha','wow','sad','angry'];
    //Put reaction text
    var reactionsCount=0;
    var myReaction=false;

    this.allReactions=[];
    this.existReactionAndUsernames=[];
    for (var i = 0; i < this.reactions.length; i++) {
      if(this.authService.user){
        if (this.bindContent.transform(this.event,'reactions',this.reactions[i]+'By').includes(this.authService.user.username)) {           
          myReaction=true;
        var translateReaction=this.translate.get('reaction.'+this.reactions[i]).subscribe(
          data => {   
            $(".like-btn-emo").removeClass().addClass('like-btn-emo').addClass('like-btn-'+this.reactions[i]);
            $(".like-btn-text").text(data).removeClass().addClass('like-btn-text').addClass('like-btn-text-'+this.reactions[i]).addClass("active");          
          });
        }
      }
      reactionsCount= reactionsCount+this.bindContent.transform(this.event,'reactions',this.reactions[i]+'By').length;
      //reactions and count reactions to modal;
      var reactionAndUsernamesObj={
        reaction:this.reactions[i],
        usernames:this.bindContent.transform(this.event,'reactions',this.reactions[i]+'By')
      };
      this.existReactionAndUsernames.push(reactionAndUsernamesObj);
      this.allReactions=this.allReactions.concat(this.bindContent.transform(this.event,'reactions',this.reactions[i]+'By'));
    } 
    if(myReaction===true){ 
      //reactions count
      if(reactionsCount===1){
        reactionsCount=reactionsCount-1;
        setTimeout(() => {
          this.translate.get('reaction.you').subscribe(
          data => {
             $(".like-details").html(data);
          });
        }, 0);      
      }else if(reactionsCount>1){   
        reactionsCount=reactionsCount-1; 
        setTimeout(() => {
          this.translate.get('reaction.you-and').subscribe(
          youAnd => {
            this.translate.get('reaction.others').subscribe(
              others => {
                $(".like-details").html(youAnd+reactionsCount +others);
              });
          });
        }, 0); 
      }   
    }else{

      this.translate.get('reaction.like').subscribe(
      data => {         
          $(".like-btn-text").text(data).removeClass().addClass('like-btn-text');
          $(".like-btn-emo").removeClass().addClass('like-btn-emo').addClass("like-btn-default");
        });

      if(reactionsCount){
        setTimeout(() => {
          //$(".like-details").html(reactionsCount);
           $(".like-details").html(reactionsCount+'');
        }, 0);
         
      }else{
        setTimeout(() => {
          $(".like-details").html("");
        }, 0);     
      }        
    } 
  }
  private getEvent(){
    this.currentUrl="http://localhost:4200"+this.router.url;
    console.log(this.currentUrl);
    this.eventService.getEvent(this.activatedRoute.snapshot.params['id'],this.localizeService.parser.currentLang).subscribe(data=>{
      if(data.success){
        this.event=data.event;
        this.categories=data.categories;
        this.initializeGalleryImages();
        setTimeout(() => {
          this.passCoordinates();
          if (isPlatformBrowser(this.platformId)) {
            this.initReactions();
          }   
        });
      }

    });
  }
   //reactions modal

  private reactionStaticModalShow(currentReaction,existReactionAndUsernames,allReactions) {
    const activeModal = this.modalService.open(ReactionsModalComponent, {backdrop: 'static'});
    activeModal.componentInstance.currentReaction = currentReaction;
    activeModal.componentInstance.existReactionAndUsernames = existReactionAndUsernames;

  }
  private reactionClick(currentReaction){
    console.log(this.existReactionAndUsernames);
    console.log(this.allReactions);
    this.reactionStaticModalShow(currentReaction,this.existReactionAndUsernames,this.allReactions);
  }

  private scrollComment(){
    if (isPlatformBrowser(this.platformId)) {
      $("html, body").animate({ scrollTop: $('#textareaScroll').offset().top }, 1000);
    }
    //var editor=$("#textareaComment").froalaEditor('events.focus', true);
  }


  ngOnInit() {
    this.getEvent();
    this.initializeGalleryOptions();
    this.subscriptionLanguage =this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.localizeService.parser.currentLang=event.lang;
      this.initializeGalleryImages();
      this.initReactions();
    });
  }
  ngOnDestroy(){
    this.subscriptionLanguage.unsubscribe();
  } 
}



