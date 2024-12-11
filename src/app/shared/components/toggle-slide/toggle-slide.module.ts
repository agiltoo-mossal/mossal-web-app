import { NgModule } from '@angular/core';
import { ToggleSlideComponent } from './toggle-slide.component';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [CommonModule],
  declarations: [ToggleSlideComponent],
  exports: [ToggleSlideComponent],
})
export class ToggleSlideModule {}
