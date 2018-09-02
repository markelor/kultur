import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'translateLanguage'
})
export class TranslateLanguagePipe implements PipeTransform {
  transform(object: any,property:any,language:any): any {
  	var exists;
  	var index;
  	for (var i = 0; i < object.translation.length; i++) {
  	 	if(object.translation[i].language===language){
  	 		exists=true;
  	 		index=i;
  	 	}
  	}
  	if(exists){
  		return eval("object.translation[index]."+property);
  	}else{
  		return eval("object."+property);
  	}

  }

}
