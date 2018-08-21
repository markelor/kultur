import { Directive, ElementRef } from '@angular/core';

declare let $: any;

@Directive({
  selector: '[appPopover]'
})
export class PopoverDirective {

  constructor(private el: ElementRef) { }

  ngAfterViewInit() {
    let self = $(this.el.nativeElement);

    self.popover();
  }

}
