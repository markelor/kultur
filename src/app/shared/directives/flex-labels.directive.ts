import { Directive, ElementRef, Input } from '@angular/core';

declare let $: any;

@Directive({
  selector: '[appFlexLabels]'
})
export class FlexLabelsDirective {

  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    let self = $(this.el.nativeElement);

    self.flexLabel();
  }
}
