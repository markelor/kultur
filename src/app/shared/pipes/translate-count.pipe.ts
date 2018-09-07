import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'translateCount'
})
export class TranslateCountPipe implements PipeTransform {
  transform(object: any): any {
    var count=object.translation.length+1;
    if(count===1){
      return "needed-translation";
    }else if(count>=2){
      return "well-translation";
    }
  }
}
