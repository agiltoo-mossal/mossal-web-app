import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appDropdown]'
})
export class DropdownDirective {
  private isOpen = false;
  @Input() appDropdown: string;
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    if (!this.el.nativeElement.contains(event.target)) {
      this.isOpen = false;
      this.renderer.removeClass(this.el.nativeElement.querySelector(`#${this.appDropdown}`), 'show');
    }
  }

  @HostListener('click')
  toggleOpen() {
    this.isOpen = !this.isOpen;
    const dropdownContent = this.el.nativeElement.querySelector(`#${this.appDropdown}`);
    if (this.isOpen) {
      this.renderer.addClass(dropdownContent, 'show');
    } else {
      this.renderer.removeClass(dropdownContent, 'show');
    }
  }
}
