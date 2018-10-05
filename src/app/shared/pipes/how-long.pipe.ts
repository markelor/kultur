import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment-timezone';

@Pipe({
  name: 'howLongPipe'
})
export class HowLongPipe implements PipeTransform {

  transform(datetime: any,locale:any): any {
    var date=new Date(datetime);
    var now=new Date();
    var minDiff=moment(now).tz("Europe/Madrid").diff(moment(date),'minutes');
    var hoursDiff=moment(now).tz("Europe/Madrid").diff(moment(date),'hours');
    var daysDiff=moment(now).tz("Europe/Madrid").diff(moment(date),'days');
    var monthsDiff=moment(now).tz("Europe/Madrid").diff(moment(date),'months');
    var mintxt="";
    var hourtxt="";
    var daytxt="";
    var monthtxt="";
    var yeartxt="";
    var result;
  	if(locale='eu'){
       mintxt="min.";
       hourtxt="ordu";
       daytxt="egun";
       monthtxt="hil.";
       yeartxt="urte";
    }
    var dayName=moment(date).locale(locale).tz("Europe/Madrid").format('dddd');
    console.log(date,now,minDiff,hoursDiff,daysDiff)
    if(hoursDiff<1){
      result=
        {
          "howlong":minDiff +" "+ mintxt
        };
    }else if(daysDiff<7){
      result=
        {
          "howlong":dayName[0].toUpperCase() + dayName.substring(1)
        };
    }else if(monthsDiff<1){
      result=
        {
          "howlong":daysDiff+" "+daytxt
        };
    }else{
      result=
        {
          "howlong":monthsDiff+" "+monthtxt
        };
    }
    return result;
  }

}
