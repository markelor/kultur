import { Component, OnInit, ViewChild, Input} from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder,Validators, FormArray } from '@angular/forms';
import { LocalizeRouterService } from 'localize-router';
import { AuthService } from '../../../services/auth.service';
import { CategoryService } from '../../../services/category.service';
import { ObservableService } from '../../../services/observable.service';
import { TranslateService,LangChangeEvent } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { Category } from '../../../class/category';
import { Subscription } from 'rxjs/Subscription';
import { AuthGuard} from '../../../pages/guards/auth.guard';
import { GroupByPipe } from '../../../shared/pipes/group-by.pipe';
const URL = 'http://localhost:8080/fileUploader/uploadImages/category-icon';
@Component({
  selector: 'app-filter-form',
  templateUrl: './filter-form.component.html',
  styleUrls: ['./filter-form.component.css']
})
export class FilterFormComponent  {  
  public form:FormGroup;
  public category:AbstractControl;
  @Input() inputEvents;
  private startTimestamp;
  private endTimestamp;
  public timeStart = {hour: 0, minute: 0};
  public timeEnd = {hour: 0, minute: 0};
  //private events;
  public start:AbstractControl;
  public end:AbstractControl;
  public price:AbstractControl;
  private subscription:Subscription;
  private categoryId=[];
  private levelCategories=[];
  constructor(
    private fb: FormBuilder,
    private localizeService:LocalizeRouterService,
    private router: Router,
    private categoryService:CategoryService,
    private translate:TranslateService,
    private observableService: ObservableService,
    private groupByPipe:GroupByPipe
  ) { 
    this.createNewFilterForm();
    
  }
    private createItem(value) {
    return this.fb.group({
      category: [value],
    });
  }
  // Function to create new event form
  private createNewFilterForm() {
    this.form = this.fb.group({
      categories: this.fb.array([ this.createItem('') ]),
      start: ['', Validators.compose([
        Validators.required/*,DateValidator.validate*/
      ])],
      end: ['', Validators.compose([
        Validators.required/*,DateValidator.validate*/
      ])],
      price: ['']
    })
    this.start = this.form.controls['start'];
    this.end = this.form.controls['end'];
    this.price = this.form.controls['price'];
    this.price.setValue(0);
  }
  
     // Function on seleccted categories
  public onSelectedCategory(value,level){
    var index;
    for (var i = 0; i < this.levelCategories[level].value.length; ++i) {
      if(this.levelCategories[level].value[i].language===this.localizeService.parser.currentLang && this.levelCategories[level].value[i].title===value.split(' ')[1]){
        index=i;
      }else{
        for (var j = 0; j < this.levelCategories[level].value[i].translation.length; ++j) {
          if(this.levelCategories[level].value[i].translation[j].language===this.localizeService.parser.currentLang){
            index=j;
          }
        } 
      }
    }
    if (!value){
      // remove
        for (var i = this.form.controls['categories'].value.length - 1; i >= level; i--) {
          this.categoryId.splice(i+1,1);
        } 
        for (var i = this.form.controls['categories'].value.length - 1; i >= level+1; i--) {
          (this.form.controls['categories'] as FormArray).removeAt(i);
        }       
    }else{
      //hide categories
      this.categoryId[level+1] = this.levelCategories[level].value[index]._id;
      var newFormArray=false;
      if(this.levelCategories[level+1]){
         for (var i = 0; i < this.levelCategories[level+1].value.length; ++i) {
          if(this.levelCategories[level+1].value[i].parentId===this.levelCategories[level].value[index]._id){
            newFormArray=true;
          }
        }
      }     
      if((this.form.controls['categories'].value.length-1 <= level) && newFormArray===true){
        (this.form.controls['categories'] as FormArray).push(this.createItem(''));
      }else {
        // remove
        for (var i = this.form.controls['categories'].value.length - 1; i >= level+1; i--) {
          (this.form.controls['categories'] as FormArray).removeAt(i);
          this.categoryId.splice(i+1,1);
        }
        if(newFormArray){
         (this.form.controls['categories'] as FormArray).push(this.createItem('')); 
        }       
      }    
    }
  }   
  private getCategories(){
    this.categoryId.splice(0, 0, null);
    //Get categories
    this.categoryService.getCategories(this.localizeService.parser.currentLang).subscribe(data=>{
      if(data.success){
        this.levelCategories=this.groupByPipe.transform(data.categories,'level');
      }   
    });
  }
  public onEventSubmit(){
    //this.markers=[];

    var count=0;
    var exists=false;
    this.startTimestamp=new Date(this.form.get('start').value.year,this.form.get('start').value.month-1,this.form.get('start').value.day,0,0);
    this.endTimestamp=new Date(this.form.get('end').value.year,this.form.get('end').value.month-1,this.form.get('end').value.day,0,0);
    for (var i = 0; i < this.inputEvents.length; ++i) {
      for (var j = 0; j < this.inputEvents[i].categories.length; ++j) {;
        if(this.inputEvents[i].categories[j]._id===this.categoryId[this.categoryId.length-1] && 
          new Date(this.inputEvents[i].start)>=this.startTimestamp &&
          new Date(this.inputEvents[i].end)<=this.endTimestamp &&
          this.inputEvents[i].price<=this.price.value
          ){
          exists=true;
          //this.addMarker(this.inputEvents[i]);
          this.observableService.notifyOther({option: this.observableService.mapEvent, value: this.inputEvents[i],count:count,exists:exists});
          count=count+1;
        }
      }
    }  
    if(!exists){
      this.observableService.notifyOther({option: this.observableService.mapEvent, value: [],count:count,exists:exists});
    }
  }
  ngOnInit() {
    this.getCategories();

  }
}

