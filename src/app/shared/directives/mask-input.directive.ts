import { Directive, ElementRef, Input } from '@angular/core';

declare let $: any;

@Directive({
  selector: '[appMaskInput]'
})
export class MaskInputDirective {

  constructor(private el: ElementRef) {}

  @Input('mask') mask: any;
  @Input('options') options: {} = {};

  ngAfterViewInit() {
    let self = $(this.el.nativeElement);

    self.mask(this.mask, this.options);
  }

}
