import { Pipe, PipeTransform } from '@angular/core';
declare let $: any;
@Pipe({
  name: 'imageMargin'
})

export class ImageMarginPipe implements PipeTransform {
  constructor() {}
  transform(index: any): any { 
    var img=$('.ks-avatar img').get(index);
    $("img").one("load", function() {
      var margin=((100-this.width)/2)+"px";
      $(this).attr("style", "left:"+margin);
    }).each(function() {
    });
  }

}
