import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'disableCategories'
})
export class DisableCategoriesPipe implements PipeTransform {
  transform(categories:any,disableCategories:any): Array<any> {
  	if(disableCategories){
  		for (var i = 0; i < categories.length; ++i) {
  			categories[i].disable();
  		}
  	}
  	return categories 
  }

}

