import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'eventsFilter'
})
export class EventsFilterPipe implements PipeTransform {  
  transform(events:any): Array<any> {
  	var currentDate=new Date();
    if(events){
          for (var i = 0; i < events.length; ++i) { 
      if(new Date(events[i].end)<currentDate){
        events[i].visible=false; 
      }             
    }
    return events;
    }  
  }

}

