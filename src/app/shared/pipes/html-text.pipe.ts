import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'htmlText'
})
export class HtmlTextPipe implements PipeTransform {
  transform(html:any) {
  	if(html){
  	  return html.replace(/<[^>]*>/g, '');

  	}
   
  }

}

