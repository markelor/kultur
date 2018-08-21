import { Directive, ElementRef, Input, OnInit } from '@angular/core';

declare let $: any;
declare let Response: any;
declare let Kosmo: any;

@Directive({
  selector: '[appElementHeight]'
})
export class ElementHeightDirective implements OnInit {

  @Input('elementHeight') elementHeight: number;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    let element = $(this.el.nativeElement);

    element.height(this.elementHeight);
  }

}
