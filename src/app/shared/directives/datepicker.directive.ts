import { Directive, ElementRef, Input } from '@angular/core';

declare let $: any;

@Directive({
  selector: '[appDatepicker]'
})
export class DatepickerDirective {

  constructor(private el: ElementRef) { }

  ngAfterViewInit() {
    let self = $(this.el.nativeElement);

    self.flatpickr();
  }
}
