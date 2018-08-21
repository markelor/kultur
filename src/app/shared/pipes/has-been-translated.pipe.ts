import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment-timezone';

@Pipe({
  name: 'hasBeenTranslatedPipe'
})
export class HasBeenTranslatedPipe implements PipeTransform {

  transform(event:any, locale:any): any {
    var result=false;
    if(event.language==locale){
      result=true;
    }
    for(var i=0;i<event.translation.length;i++){
      if(event.translation[i].language==locale){
        result=true;
      }
    }
    return result;
  }

}
