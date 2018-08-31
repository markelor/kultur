import { Component, OnInit,Input,  PLATFORM_ID, APP_ID, Inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../../../services/auth.service';
import { LocalizeRouterService } from 'localize-router';
import { isPlatformBrowser, CommonModule } from '@angular/common';
declare let $: any;
@Component({
  selector: 'app-reactions-modal',
  templateUrl: './reactions-modal.component.html',
  styleUrls: ['./reactions-modal.component.css']
})
export class ReactionsModalComponent implements OnInit {
	@Input() currentReaction;
	@Input() existReactionAndUsernames;
	private allUsers=[];
	public allBy=[];
	public likeBy;
	public loveBy;
	public hahaBy;
	public wowBy;
	public sadBy;
	public angryBy;
	private allByImages;
	private likeByImages;
	private loveByImages;
	private hahaByImages;
	private wowByImages;
	private sadByImages;
	private angryByImages;
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
  	private localizeService:LocalizeRouterService,
  	private activeModal: NgbActiveModal,
  	private authService:AuthService
  ) { }
  public closeModal() {
    this.activeModal.close();
  }
  
  public cancelModal(){
    this.closeModal();

  }
  public confirmModal() {
    this.closeModal();
  }
  private getUserImages(usernames,reaction,i){
  	this.authService.getUsersImages(JSON.stringify(usernames),this.localizeService.parser.currentLang).subscribe(data=>{
      if(data.success){
      	if(reaction==='like'){
      		this.likeByImages=data.users;
      		this.allBy[i].avatars=data.users;

  		}else{
  			if(reaction==='love'){
  				this.loveByImages=data.users;
  				this.allBy[i].avatars=data.users;
  			}else{
  				if(reaction==='haha'){
  					this.hahaByImages=data.users;
  					this.allBy[i].avatars=data.users;
  				}else {
  					if(reaction==='wow'){				
  						this.wowByImages=data.users;
  						this.allBy[i].avatars=data.users;
  					}else{
  						if(reaction==='sad'){
  							this.sadByImages=data.users;
  							this.allBy[i].avatars=data.users;
  						}else{
		  					if(reaction==='angry'){
		  						this.angryByImages=data.users;
		  						this.allBy[i].avatars=data.users;
		  					}							
  						}
  					}
  				}
  			}
  		}
      }
    });
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        $(".nav-"+this.currentReaction).addClass('active');
        $( ".nav-"+this.currentReaction ).click ();
      }, 0);
    }
    var count=0;
  	for (var i = 0; i < this.existReactionAndUsernames.length; i++) {
  		if(this.existReactionAndUsernames[i].usernames.length){
  			this.allBy=this.allBy.concat(this.existReactionAndUsernames[i]);;
  			this.allUsers=this.allUsers.concat(this.existReactionAndUsernames[i].usernames);
	  		if(this.existReactionAndUsernames[i].reaction==='like'){
	  			this.likeBy=this.existReactionAndUsernames[i].usernames;
	  			this.getUserImages(this.likeBy,'like',count);
	  		}else{
	  			if(this.existReactionAndUsernames[i].reaction==='love'){
	  				this.loveBy=this.existReactionAndUsernames[i].usernames;
	  				this.getUserImages(this.loveBy,'love',count);
	  			}else{
	  				if(this.existReactionAndUsernames[i].reaction==='haha'){
	  					this.hahaBy=this.existReactionAndUsernames[i].usernames;
	  					this.getUserImages(this.hahaBy,'haha',count);
	  				}else {
	  					if(this.existReactionAndUsernames[i].reaction==='wow'){
	  						this.wowBy=this.existReactionAndUsernames[i].usernames;
	  						this.getUserImages(this.wowBy,'wow',count);
	  					}else{
	  						if(this.existReactionAndUsernames[i].reaction==='sad'){
	  							this.sadBy=this.existReactionAndUsernames[i].usernames;
	  							this.getUserImages(this.sadBy,'sad',count);
	  						}else{
			  					if(this.existReactionAndUsernames[i].reaction==='angry'){
			  						this.angryBy=this.existReactionAndUsernames[i].usernames;
			  						this.getUserImages(this.angryBy,'angry',count);
			  					}							
	  						}
	  					}
	  				}
	  			}
	  		}
	  		count=count+1;
  		}		
  	}
  	 
  }
}
