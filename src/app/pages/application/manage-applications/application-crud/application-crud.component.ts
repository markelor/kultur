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
    this.observableService.application="application-events";
    this.observableService.notifyOther({option: this.observableService.application});
  }
  public refreshServices(){
    this.observableService.application="application-services";
    this.observableService.notifyOther({option: this.observableService.application});
    
  }
  public refreshObservations(){
    this.observableService.application="application-observations";
    this.observableService.notifyOther({option: this.observableService.application});
  }
  public refreshContributors(){
    this.observableService.application="application-contributors";
    this.observableService.notifyOther({option: this.observableService.application});
    
  }
  ngOnInit() {
  	$('a[data-toggle="tab"]').on('shown.bs.tab', function(e){
	   $($.fn.dataTable.tables(true)).DataTable()
	      .columns.adjust()
	      .responsive.recalc();
	  });
  }


}
