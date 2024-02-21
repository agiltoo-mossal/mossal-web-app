import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { APP_CONTEXT } from '../../enums/app-context.enum';

@Directive({
  selector: '[applyContextClass]'
})
export class ApplyContextClassDirective {
  classContextSuffix: string = "app-context";
  constructor(
    private elementRef: ElementRef, private renderer: Renderer2,
    private appService: AppService
  ) {
    this.appService.contextAsync.subscribe(
      ctx => {
        const contextClass = this.getClassByContext(ctx);
        this.removeContextClass(this.elementRef.nativeElement);
        this.renderer.addClass(this.elementRef.nativeElement, contextClass);
      }
    )
  }
  removeContextClass(element: any) {
    element.classList.forEach((className: string) => {
      if (className.endsWith(this.classContextSuffix)) {
        element.classList.remove(className);
      }
    });
  }
  getClassByContext(ctx: APP_CONTEXT) {
    switch(ctx) {
      case APP_CONTEXT.Default:
        return 'default-app-context';
      case APP_CONTEXT.Classroom:
        return 'classroom-app-context';
      case APP_CONTEXT.Auth:
          return 'auth-app-context';
      case APP_CONTEXT.Admin:
          return 'admin-app-context';
      default:
        return '';
    }
  }
}
