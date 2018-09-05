import { Component, OnInit } from '@angular/core';
import { ObservableService } from '../../../../services/observable.service';
declare let $: any;
@Component({
  selector: 'app-application-crud',
  templateUrl: './application-crud.component.html',
  styleUrls: ['./application-crud.component.css']
})
export class ApplicationCrudComponent implements OnInit {

  constructor(private observableService: ObservableService) { }
  public refreshEvents(){
    this.observableService.applicationEvents="application-events";
    this.observableService.notifyOther({option: this.observableService.applicationEvents});
  }
  public refreshServices(){
    this.observableService.applicationServices="application-services";
    this.observableService.notifyOther({option: this.observableService.applicationServices});
    
  }
  public refreshObservations(){
    this.observableService.applicationObservations="application-observations";
    this.observableService.notifyOther({option: this.observableService.applicationObservations});
    
  }
  ngOnInit() {
  	$('a[data-toggle="tab"]').on('shown.bs.tab', function(e){
	   $($.fn.dataTable.tables(true)).DataTable()
	      .columns.adjust()
	      .responsive.recalc();
	  });
  }


}
