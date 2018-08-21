import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser'

@Pipe({
  name: 'safeHtml'
})
export class BindContentPipe implements PipeTransform {
  constructor(private sanitized: DomSanitizer) {}
  transform(content: any,property1:any,property2:any): any { 
  	if(property1==="reactions"){
      return eval('content.'+property1+'.'+property2);
  	}else{
  	  return this.sanitized.bypassSecurityTrustHtml(content);
  	}

  }

}
