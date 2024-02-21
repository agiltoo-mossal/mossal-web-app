import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicComponent } from './public.component';
import { HomeComponent } from './home/home.component';
import { PublicRoutingModule } from './public-routing.module';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CarousselComponent } from './components/caroussel/caroussel.component';
import { HubsComponent } from './components/hubs/hubs.component';
import { ActualitiesComponent } from './components/actualities/actualities.component';
import { PartnariesComponent } from './components/partnaries/partnaries.component';
import { PresentationComponent } from './components/presentation/presentation.component';
import { GeolocationComponent } from './components/geolocation/geolocation.component';
import { MobileAppComponent } from './components/mobile-app/mobile-app.component';
import { BannerBottomComponent } from './components/banner-bottom/banner-bottom.component';
import { SlickCarouselModule } from '../shared/directives/slick-carousel/slick-carousel.module';
import { HubCardModule } from '../shared/components/hub-card/hub-card.module';
import { ActulityCardComponent } from './components/actualities/components/actulity-card/actulity-card.component';
import { AdministrativeProceduresComponent } from './administrative-procedures/administrative-procedures.component';
import { OurServicesComponent } from './our-services/our-services.component';
import { AboutUsComponent } from './about-us/about-us.component';

@NgModule({
  declarations: [
    PublicComponent,
    HomeComponent,
    CarousselComponent,
    HubsComponent,
    ActualitiesComponent,
    PartnariesComponent,
    PresentationComponent,
    GeolocationComponent,
    MobileAppComponent,
    BannerBottomComponent,
    ActulityCardComponent,
    AdministrativeProceduresComponent,
    OurServicesComponent,
    AboutUsComponent,
  ],
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
