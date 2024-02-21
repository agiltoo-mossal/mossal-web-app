import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PublicComponent } from './public.component';
import { AdministrativeProceduresComponent } from './administrative-procedures/administrative-procedures.component';
import { OurServicesComponent } from './our-services/our-services.component';
import { NewsComponent } from './news/news.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { SupportComponent } from './support/support.component';

const routes: Routes = [
  {
    path: '',
    component: PublicComponent,
    children: [
      { path: 'home', component: HomeComponent },
      {
        path: 'administrative-procedures',
        component: AdministrativeProceduresComponent,
      },
      { path: 'our-services', component: OurServicesComponent },
      { path: 'news', component: NewsComponent },
      { path: 'about-us', component: AboutUsComponent },
      { path: 'support', component: SupportComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PublicRoutingModule {}
