import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'compareDate'
})
export class CompareDatePipe implements PipeTransform {

  transform(dateEnd: any, timeEnd: any,dateStart: any, timeStart: any): any {
  	var response=false;
  	if(dateEnd && timeEnd && dateStart && timeStart){
  		var datetimeEnd=new Date(dateEnd.year+"/"+dateEnd.month+"/"+dateEnd.day+" "+timeEnd.hour+":"+timeEnd.minute);
  		var datetimeStart=new Date(dateStart.year+"/"+dateStart.month+"/"+dateStart.day+" "+timeStart.hour+":"+timeStart.minute);
  		if(datetimeEnd <= datetimeStart){
  			response= true;
  		}else{
  			response= false
  		}
  	}
  	return response;
   
  }

}

