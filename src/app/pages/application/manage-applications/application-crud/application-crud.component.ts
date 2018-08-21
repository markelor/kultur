import { Component, OnInit } from '@angular/core';
declare let $: any;
@Component({
  selector: 'app-application-crud',
  templateUrl: './application-crud.component.html',
  styleUrls: ['./application-crud.component.css']
})
export class ApplicationCrudComponent implements OnInit {

  constructor() { }
  ngOnInit() {
  	$('a[data-toggle="tab"]').on('shown.bs.tab', function(e){
	   $($.fn.dataTable.tables(true)).DataTable()
	      .columns.adjust()
	      .responsive.recalc();
	});
  }

}
