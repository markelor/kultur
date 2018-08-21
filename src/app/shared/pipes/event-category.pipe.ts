import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'eventCategory'
})
export class EventCategoryPipe implements PipeTransform {

  transform(value: Array<any>, index: string): Array<any> {
  	if(value[index]){
  	 return value[index].value;	
  	}
   
  }

}

