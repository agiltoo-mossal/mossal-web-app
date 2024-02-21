import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appControlValidation]'
})
export class ControlValidationDirective {
  controlValidClass: string = "valid";
  controlInvalidClass: string = "invalid";

  constructor(private el: ElementRef) {}

  @HostListener('blur') onBlur() {
    const input = this.el.nativeElement;

    if (input.classList.contains('ng-touched')) {
      if (input.validity.valid) {
        input.classList.remove(this.controlInvalidClass);
        input.classList.add(this.controlValidClass);
      } else {
        input.classList.remove(this.controlValidClass);
        input.classList.add(this.controlInvalidClass);
      }
    }
  }

  @HostListener('input') onInput() {
    const input = this.el.nativeElement;

    if (!input.classList.contains('ng-touched')) {
      input.classList.add('ng-touched');
    }

    if (input.validity.valid) {
      input.classList.remove(this.controlInvalidClass);
      input.classList.add(this.controlValidClass);
    } else {
      input.classList.remove(this.controlValidClass);
      input.classList.add(this.controlInvalidClass);
    }
  }

}
