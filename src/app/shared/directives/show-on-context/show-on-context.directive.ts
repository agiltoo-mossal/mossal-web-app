import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { APP_CONTEXT } from '../../enums/app-context.enum';

@Directive({
  selector: '[appShowOnContext]'
})
export class ShowOnContextDirective {

  @Input('appShowOnContext') contexts: APP_CONTEXT[];
  currentContext: APP_CONTEXT = APP_CONTEXT.Default;
  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private appService: AppService
  ) {
    this.appService.contextAsync.subscribe(
      ctx => {
        this.currentContext = ctx;
        this.setVisibility();
      }
    )
  }

  ngOnChanges(): void {
    this.setVisibility();
  }

  private setVisibility(): void {
    if (this.contexts.includes(this.currentContext)) {
      this.renderer.setStyle(this.elementRef.nativeElement, 'display', 'block');
    } else {
      this.renderer.setStyle(this.elementRef.nativeElement, 'display', 'none');
    }
  }

}
