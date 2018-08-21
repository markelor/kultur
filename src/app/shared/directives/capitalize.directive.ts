import { Directive, ElementRef, HostListener } from "@angular/core";
import { NgControl } from "@angular/forms";

@Directive({
  selector: '[capitalize]'
})
export class CapitalizeDirective {

 constructor(private el: ElementRef, private control : NgControl) {

  }
  @HostListener('input',['$event']) onEvent($event){
    //let upper = this.el.nativeElement.value.toUpperCase();
    //this.control.control.setValue(upper);
    //get value from the control instead as above code giving errors.
    let str:string = this.control.value;
    this.control.control.setValue(str.charAt(0).toUpperCase()+ str.slice(1));
  }

}

