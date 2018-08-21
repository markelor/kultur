import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'space'
})
export class SpacePipe implements PipeTransform {

  transform(value: any, character: any): any {
  	if(character===" "){
  		return value.split(' ').join('-');
  	} else if(character==="-"){
  		return value.split('-').join('_');
  	}
  }

}
