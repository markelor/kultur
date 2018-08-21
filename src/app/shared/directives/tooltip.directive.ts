import { Directive, ElementRef, Input } from '@angular/core';

declare let $: any;

@Directive({
  selector: '[appTooltip]'
})
export class TooltipDirective {

  constructor(private el: ElementRef) { }

  ngAfterViewInit() {
    let self = $(this.el.nativeElement);

    self.tooltip({
      delay: {
        show: 500
      }
    });
  }
}
