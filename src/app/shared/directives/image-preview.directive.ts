import { Directive,ElementRef, Input, Renderer, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: 'img[appImagePreview]'
})
export class ImagePreviewDirective {

   @Input() image: any;

  constructor(private el: ElementRef, private renderer: Renderer) { }

  ngOnChanges(changes: SimpleChanges) {
      let reader = new FileReader();
      let el = this.el;

      reader.onloadend = function (e) {
          el.nativeElement.src = reader.result;
      };

      if (this.image) {
          return reader.readAsDataURL(this.image);
      }

  }

}
