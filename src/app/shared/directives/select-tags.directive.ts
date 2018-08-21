import { Directive, ElementRef, Input } from '@angular/core';

declare let $: any;
declare let Bloodhound: any;

@Directive({
  selector: '[appSelectTags]'
})
export class SelectTagsDirective {

  constructor(private el: ElementRef) {}

  @Input('autocomplete') autocomplete: boolean = false;
  @Input('localData') localData;

  ngAfterViewInit() {
    let self = $(this.el.nativeElement);

    if (this.autocomplete) {
      var engine = new Bloodhound({
        local: this.localData,
        datumTokenizer: function(d) {
          return Bloodhound.tokenizers.whitespace(d.value);
        },
        queryTokenizer: Bloodhound.tokenizers.whitespace
      });
      engine.initialize();

      self.tokenfield({
        typeahead: [null, { source: engine.ttAdapter(), displayKey: 'value' }]
      });
    } else {
      self.tokenfield();
    }

  }

}
