import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute,Router } from '@angular/router';
import { User } from '../../../class/user';
import { LocalizeRouterService } from 'localize-router';
@Component({
  selector: 'app-activate',
  templateUrl: './activate.component.html',
  styleUrls: ['../authentication.component.css']
})
export class ActivateComponent implements OnInit {
  public message:boolean;
  public messageClass:string;
  private temporaryToken:User=new User();
  constructor(private authService:AuthService,private activatedRoute: ActivatedRoute,private router:Router,private localizeService: LocalizeRouterService) { }

  ngOnInit() {
     this.temporaryToken.setLanguage=this.localizeService.parser.currentLang;
     this.temporaryToken.setTemporaryToken=this.activatedRoute.snapshot.params['temporaryToken']
     this.authService.activateAcount(this.temporaryToken).subscribe(data=>{
       this.message = false; // Clear errorMsg each time user submits
        // Check if activation was successful or not
        if (data.success) {
          this.messageClass="alert alert-success ks-solid",
            this.message = data.message; // If successful, grab message from JSON object and redirect to login page
            // Redirect after 2000 milliseconds (2 seconds)
            setTimeout(() => {
              this.router.navigate([this.localizeService.translateRoute('/sign-in-route')]);
            }, 5000);
            
        } else {
          this.messageClass="alert alert-danger ks-solid";
            this.message = data.message; // If not successful, grab message from JSON object and redirect to login page
            // Redirect after 2000 milliseconds (2 seconds)
            setTimeout(() => {
              this.router.navigate([this.localizeService.translateRoute('/sign-in-route')]);
            }, 5000);
        }

     });
  }

}
