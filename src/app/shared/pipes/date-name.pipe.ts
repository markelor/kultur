import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment-timezone';

@Pipe({
  name: 'dateNamePipe'
})
export class DateNamePipe implements PipeTransform {

  transform(datetime: any,locale:any): any {
  	moment.updateLocale('eu', {
      calendar : {lastDay : '[Atzo]' , sameDay : '[Gaur]' , nextDay : '[Bihar]' , lastWeek : '[aurreko] dddd' , nextWeek : 'dddd' , sameElse : 'L'}
    });
    moment.updateLocale('es', {
      calendar : {lastDay : '[Ayer]' , sameDay : '[Hoy]' , nextDay : '[Mañana]' , lastWeek : '[pasado] dddd' , nextWeek : 'dddd' , sameElse : 'L'}
    });
      moment.updateLocale('en', {
      calendar : {lastDay : '[Yesterday]' , sameDay : '[Today]' , nextDay : '[Tomorrow]' , lastWeek : '[last] dddd' , nextWeek : 'dddd' , sameElse : 'L'}
    });
    var date=new Date(datetime);
    var now=new Date();
    var daysDiff=moment(date).tz("Europe/Madrid").diff(moment(now),'days');
    var monthName=moment(date).locale(locale).tz("Europe/Madrid").format('MMM');
    var dayName;
    if(daysDiff==0||daysDiff==1){
      dayName=moment(date).locale(locale).tz("Europe/Madrid").calendar();
    }else{
      dayName=moment(date).locale(locale).tz("Europe/Madrid").format('dddd');
    }
    var result=
                {
                  "month":monthName[0].toUpperCase() + monthName.substring(1),
                  "day":dayName[0].toUpperCase() + dayName.substring(1),
                  "dayNumber":moment(date).tz("Europe/Madrid").format('DD'),
                  "hour":moment(date).tz("Europe/Madrid").format('HH:mm'),
                };
    return result;
  }

}
