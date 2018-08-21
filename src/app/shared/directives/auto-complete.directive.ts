import { Directive, ElementRef, Input } from '@angular/core';

declare let $: any;

@Directive({
  selector: '[appAutoComplete]'
})
export class AutoCompleteDirective {

  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    let self = $(this.el.nativeElement);

    self.flexdatalist();
  }
}
