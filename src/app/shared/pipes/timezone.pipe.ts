import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment-timezone';
@Pipe({
  name: 'timezone'
})
export class TimezonePipe implements PipeTransform {
  transform(time:any): Array<any> {
  	if(time){
  	 return moment(time).tz("Europe/Madrid").format('YYYY-MM-DD HH:mm');
  	}
   
  }

}

