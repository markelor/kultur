import { Pipe, PipeTransform } from '@angular/core';
import { FormArray} from '@angular/forms';
@Pipe({
  name: 'formArrayPipe'
})
export class FormArrayPipe implements PipeTransform {
  transform(form:any,property):any {
  	if(form){
  	 return <FormArray>form.get(property).controls;
  	}
   
  }

}

