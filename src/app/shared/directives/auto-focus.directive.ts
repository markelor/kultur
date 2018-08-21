import { Directive, OnInit, ElementRef } from '@angular/core';

@Directive({
  selector: '[myAutoFocus]'
})
export class AutoFocusDirective implements OnInit {

  constructor(private elementRef: ElementRef) { };

  ngOnInit(): void {
    this.elementRef.nativeElement.focus();
  }

}