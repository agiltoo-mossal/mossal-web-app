import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicComponent } from './public.component';
import { HomeComponent } from './home/home.component';
import { PublicRoutingModule } from './public-routing.module';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SlickCarouselModule } from '../shared/directives/slick-carousel/slick-carousel.module';
import { HubCardModule } from '../shared/components/hub-card/hub-card.module';

@NgModule({
  declarations: [PublicComponent, HomeComponent],
  imports: [
    CommonModule,
    PublicRoutingModule,
    MatIconModule,
    TranslateModule,
    FlexLayoutModule,
    SlickCarouselModule,
    HubCardModule,
  ],
})
export class PublicModule {}
