import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslationsRoutingModule } from './translations-routing.module';
import { TranslationsComponent } from './translations.component';
import { TranslationFormComponent } from './translation-form/translation-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    TranslationsComponent,
    TranslationFormComponent
  ],
  imports: [
    CommonModule,
    TranslationsRoutingModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatIconModule,
    TranslateModule
  ]
})
export class TranslationsModule { }
