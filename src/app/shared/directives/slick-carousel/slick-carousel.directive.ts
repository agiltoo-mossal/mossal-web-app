import { Directive, ElementRef, OnInit } from '@angular/core';
import * as $ from 'jquery';

@Directive({
  selector: '[appSlickCarousel]',
})
export class SlickCarouselDirective implements OnInit {
  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    $(this.el.nativeElement).slick();
  }
}
