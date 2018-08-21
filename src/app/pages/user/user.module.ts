import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ProfileComponent } from './profile/profile.component';
import { UserRoutingModule } from './user.routing';
import { ImageCropperModule } from "ngx-img-cropper";
import { FileUploadModule } from 'ng2-file-upload';
import { DataTablesModule } from 'angular-datatables';
import { UserComponent } from './user.component';
import { TemplatesModule } from '../../templates/templates.module';
import { SharedModule } from '../../shared/shared.module';
import { DecodePipe } from '../../shared/pipes/decode.pipe';
import { InlineSVGModule } from 'ng-inline-svg';
@NgModule({
  imports: [
    CommonModule,TranslateModule,UserRoutingModule,FileUploadModule,TemplatesModule,SharedModule,DataTablesModule,InlineSVGModule,ImageCropperModule,
  ],
  declarations: [ProfileComponent,UserComponent],
  providers:[DecodePipe]
})

export class UserModule { }
