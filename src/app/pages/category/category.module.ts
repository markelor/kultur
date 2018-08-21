import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common"
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { CategoryRoutingModule }  from './category.routing';
import { CreateCategoryComponent } from './create-category/create-category.component';
import { CategoryModalComponent } from './create-category/category-modal/category-modal.component';
import { DataTablesModule } from 'angular-datatables';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule} from "../../shared/shared.module";
import { TemplatesModule } from '../../templates/templates.module';
import { COMPOSITION_BUFFER_MODE } from '@angular/forms';
import { InlineSVGModule } from 'ng-inline-svg';
@NgModule({
  imports: [
  	CommonModule,FormsModule,ReactiveFormsModule,TranslateModule,SharedModule,TemplatesModule,
    CategoryRoutingModule,DataTablesModule,NgbModule,InlineSVGModule
  ],
  declarations: [CategoryModalComponent,CreateCategoryComponent],
  providers: [
   {provide: COMPOSITION_BUFFER_MODE, useValue: false}
  ],
    entryComponents: [
    CategoryModalComponent
  ]
})
export  class CategoryModule { }
