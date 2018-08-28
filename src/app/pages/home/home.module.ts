import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home.routing'
import { HomeComponent } from './home.component';
import { SharedModule } from "../../shared/shared.module";
import { DateNamePipe } from "../../shared/pipes/date-name.pipe";
import { CommentsPipe } from "../../shared/pipes/comments.pipe";
import { ReactionsPipe } from "../../shared/pipes/reactions.pipe";
import { TemplatesModule } from "../../templates/templates.module";
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { MomentModule } from 'ngx-moment';

@NgModule({
  imports: [
    CommonModule,HomeRoutingModule,SharedModule,TemplatesModule,TranslateModule,NgbModule,MomentModule
  ],
  declarations: [HomeComponent],
  providers:[DateNamePipe,CommentsPipe,ReactionsPipe]
})
export class HomeModule { }


