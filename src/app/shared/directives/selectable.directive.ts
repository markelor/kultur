import { Directive, ElementRef, Input } from '@angular/core';

declare let $: any;

@Directive({
  selector: '[appSelectable]'
})
export class SelectableDirective {

  constructor(private el: ElementRef) { }

  @Input('liveSearch') liveSearch: boolean = false;

  ngAfterViewInit() {
    let self = $(this.el.nativeElement);

    if (this.liveSearch) {
      self.select2();
    } else {
      self.select2({
        minimumResultsForSearch: Infinity
      });
    }
  }

}
