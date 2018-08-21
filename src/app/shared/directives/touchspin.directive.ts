import { Directive, ElementRef, Input } from '@angular/core';

declare let $: any;

@Directive({
  selector: '[appTouchspin]'
})
export class TouchspinDirective {

  constructor(private el: ElementRef) {}

  @Input('options') options: {} = {};

  ngAfterViewInit() {
    let self = $(this.el.nativeElement);

    self.TouchSpin(this.options);
  }
}
