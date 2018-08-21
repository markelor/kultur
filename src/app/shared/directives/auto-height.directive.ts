import { Directive, ElementRef, Input, OnInit } from '@angular/core';

declare let $: any;
declare let Kosmo: any;
declare let window: any;
declare let Response: any;

@Directive({
  selector: '[appAutoHeight]'
})
export class AutoHeightDirective implements OnInit {

  constructor(private el: ElementRef) { }

  ngOnInit() {
    let self = $(this.el.nativeElement);
    let autoHeight = self.data('is-auto-height');
    let isMinHeight = self.data('is-min-height');
    let height = $(window).height() - self.offset().top;
    let fixHeight = parseInt(self.data('fix-height'), 10);
    let reduceHeight = self.data('reduce-height');
    let scrollableIfHasClass = self.data('scrollable-if-has-class');

    if (!scrollableIfHasClass || (scrollableIfHasClass && (self.hasClass(scrollableIfHasClass) || (Response.band(0, Kosmo.screen.breakpoints.lg))))) {
      if (autoHeight) {
        if (autoHeight == 'parent') {
          height = self.parent().height();
        } else {
          height = self.closest(autoHeight).height();
        }
      } else {
        if (reduceHeight) {
          $.each(self.parent().find(reduceHeight), function (index, element) {
            height -= $(element).height();
          });
        }

        if (fixHeight > 0 && height > 0) {
          height -= fixHeight;
        }

        if (height <= 0) {
          if (self.data('min-height')) {
            height = parseInt(self.data('min-height'), 10);
          } else {
            height = 200;
          }
        }
      }

      if (isMinHeight) {
        self.css('min-height', height);
      } else {
        self.height(height);
      }
      
    }
  }
}
