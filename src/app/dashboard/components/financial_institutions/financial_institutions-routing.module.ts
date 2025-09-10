import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FinancialInstitutionsComponent } from './financial_institutions.component';
import { OverviewComponent } from './components/overview/overview.component';
import { CreateFinancialInstitutionsComponent } from './components/create-financial_institutions/create-financial_institutions.component';
// import { EditFinancialInstitutionsComponent } from './components/edit-financial_institutions/edit-financial_institutions.component';
// import { DetailFinancialInstitutionsComponent } from './components/detail-financial_institutions/detail-financial_institutions.component';

const routes: Routes = [
  {
    path: '',
    component: FinancialInstitutionsComponent,

    children: [
      {
        path: 'list-financial_institutions',
        component: OverviewComponent,
      },
      {
        path: 'create-financial_institutions',
        component: CreateFinancialInstitutionsComponent,
      },
      // {
      //   path: ':id',
      //   component: EditFinancialInstitutionsComponent,
      // },
      // {
      //   path: 'details/:id',
      //   component: DetailFinancialInstitutionsComponent,
      // },
    ],
  },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FinancialInstitutionsRoutingModule { }
