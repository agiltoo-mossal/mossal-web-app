import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingComponent } from './setting.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToggleSlideModule } from '../toggle-slide/toggle-slide.module';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
  declarations: [SettingComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ToggleSlideModule,
    MatFormFieldModule,
  ],
  exports: [SettingComponent],
})
export class SettingModule {}
