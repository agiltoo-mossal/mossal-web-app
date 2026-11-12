import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SocietyComponent } from './society.component';
import { OverviewComponent } from './components/overview/overview.component';
import { CreateSocietyComponent } from './components/create-society/create-society.component';
import { EditSocietyComponent } from './components/edit-society/edit-society.component';
import { AddCreditComponent } from './components/add-credit/add-credit.component';
import { DetailSocietyComponent } from './components/detail-society/detail-society.component';
import { SocietyDemandesComponent } from './components/society-demandes/society-demandes.component';
import { SocietyCreditHistoryComponent } from './components/society-credit-history/society-credit-history.component';
// import { DetailSocietyComponent } from './components/detail-society/detail-society.component';

const routes: Routes = [
  {
    path: '',
    component: SocietyComponent,

    children: [
      {
        path: '',
        component: OverviewComponent,
      },
      {
        path: 'create-society',
        component: CreateSocietyComponent,
      },
      {
        path: ':id',
        component: EditSocietyComponent,
      },
      {
        path: 'details/:id',
        component: DetailSocietyComponent,
      },
      {
        path: 'add-credit/:id',
        component: AddCreditComponent,
      },
      {
        path: 'demandes/:id',
        component: SocietyDemandesComponent,
      },
      { path: 'credit-history/:id', component: SocietyCreditHistoryComponent },
    ],
  },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SocietyRoutingModule { }
