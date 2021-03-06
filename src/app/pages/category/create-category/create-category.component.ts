import { Component, OnInit, ViewChild } from '@angular/core';
import { LocalizeRouterService } from 'localize-router';
import { AuthService } from '../../../services/auth.service';
import { CategoryService } from '../../../services/category.service';
import { TranslateService } from '@ngx-translate/core';
import { CategoryModalComponent } from './category-modal/category-modal.component';
import { ConfirmationModalComponent } from '../../../templates/modals/confirmation-modal/confirmation-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ObservableService } from '../../../services/observable.service';
import { AlphanumericValidator } from '../../../validators';
import { Category } from '../../../class/category';
import { GroupByPipe } from '../../../shared/pipes/group-by.pipe';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import {DataTableDirective} from 'angular-datatables';
import { AuthGuard} from '../../guards/auth.guard';
import { Router } from '@angular/router';
@Component({
  selector: 'app-create-category',
  templateUrl: './create-category.component.html',
  styleUrls: ['./create-category.component.css']
})
export class CreateCategoryComponent implements OnInit {
  public message;
  public messageClass;
  private subscriptionObservableSuccess: Subscription;
  private subscriptionObservableDelete: Subscription;
  private submitted:boolean = false;
  public parentCategories;
  @ViewChild(DataTableDirective)
  public dtElement: DataTableDirective;
  public categories;
  public dtOptions: any = {};
  public dtTrigger: Subject<any> = new Subject();
  constructor(
    private localizeService:LocalizeRouterService,
    private categoryService:CategoryService,
    private authService:AuthService,
    private observableService:ObservableService,
    private modalService: NgbModal,
    private groupByPipe:GroupByPipe,
    private translate: TranslateService,
    private router:Router,
    private authGuard:AuthGuard){
    }
  private categoryStaticModalShow(category) {
    const activeModal = this.modalService.open(CategoryModalComponent, {backdrop: 'static'});
    activeModal.componentInstance.inputCategory = category;
    activeModal.componentInstance.inputParentCategories = this.parentCategories;

  }
  private staticModalShow() {
    const activeModal = this.modalService.open(ConfirmationModalComponent, {size: 'sm',backdrop: 'static'});
    this.translate.get('modal.delete-category-header').subscribe(
      data => {   
        activeModal.componentInstance.modalHeader = data;
    });
    this.translate.get('modal.delete-category-content').subscribe(
      data => {   
       activeModal.componentInstance.modalContent = data;
    });      
  }   
  private createSettings(){
    this.dtOptions = {
      // Declare the use of the extension in the dom parameter
      dom: 'Bfrtip',
      // Configure the buttons
      buttons: [
        /*'columnsToggle',*/
        'colvis',
        'copy',
        'print',
        'csv',

      ],
      responsive: true,
      columnDefs: [
        { responsivePriority: 4, targets: 0 },
        { responsivePriority: 5, targets: 1 },
        { responsivePriority: 6, targets: 2 },
        { responsivePriority: 1, targets: 3 },
        { responsivePriority: 7, targets: 4 },
        { responsivePriority: 3, targets: 5 },
        { responsivePriority: 2, targets: 6 }
      ]
    };
  }
    private categoryEditClick(category): void {
    if(this.observableService.modalCount<1){
      this.categoryStaticModalShow(category);
    }
  }
  private categoryDeleteClick(index,category): void {
    this.observableService.confirmationModalType="confirmation-modal-delete-category";
    if(this.observableService.modalCount<1){
      this.staticModalShow();
      this.subscriptionObservableDelete=this.observableService.notifyObservable.subscribe(res => {
        this.subscriptionObservableDelete.unsubscribe();
        if (res.hasOwnProperty('option') && res.option === 'confirmation-modal-delete-category') {
          this.categoryService.deleteCategory(category._id,this.localizeService.parser.currentLang).subscribe(data=>{
            if(data.success){  
              this.getCategories(true);
              this.messageClass = 'alert alert-success ks-solid'; // Set bootstrap success class
              this.message = data.message; // Set success messag
            }else{
              this.messageClass = 'alert alert-danger ks-solid'; // Set bootstrap error class
              this.message = data.message; // Set error message
            }
          });
        }
      });
    }
  }
  private observableCategorySuccess(){
    this.subscriptionObservableSuccess=this.observableService.notifyObservable.subscribe(res => {
      if (res.hasOwnProperty('option') && res.option === 'confirmation-modal-edit-category-success') {
       this.getCategories(true);
      } 
    });   
  }
  private getCategories(operation){
    //Get categories
    this.categoryService.getCategories(this.localizeService.parser.currentLang).subscribe(data=>{
      if(data.success){ 
        if(operation){
          this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            // Destroy the table first
            dtInstance.destroy();
            this.parentCategories=data.categories;   
            this.categories=this.groupByPipe.transform(data.categories,'firstParentId');
            // Call the addTrigger to rerender again
            this.dtTrigger.next();
          }); 
        }else{
          this.parentCategories=data.categories;   
          this.categories=this.groupByPipe.transform(data.categories,'firstParentId');        
          this.dtTrigger.next();
        }            
      }  
    });                 
  }
  private handleSVG(svg: SVGElement, parent: Element | null): SVGElement {
    svg.setAttribute('width', '50');
    svg.setAttribute('height', '50');
    return svg;
  }
  ngOnInit() {
    // Get authentication on page load
    this.authService.getAuthentication(this.localizeService.parser.currentLang).subscribe(authentication => {
      if(!authentication.success){
        this.authService.logout();
        this.authGuard.redirectUrl=this.router.url;
        this.router.navigate([this.localizeService.translateRoute('/sign-in-route')]); // Return error and route to login page
      }
    });
    $('textarea').each(function () {
      this.setAttribute('style', 'height:' + (this.scrollHeight) + 'px;overflow-y:hidden;');
    }).on('input', function () {
      this.style.height = (this.scrollHeight) + 'px';
    });
    this.createSettings(); 
    this.getCategories(undefined);
    this.observableCategorySuccess();     	  
  }
  ngOnDestroy(){
    this.dtTrigger.unsubscribe();
  }
}



