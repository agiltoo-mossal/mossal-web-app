import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SocietyComponent } from './society.component';
import { OverviewComponent } from './components/overview/overview.component';
import { CreateSocietyComponent } from './components/create-society/create-society.component';
import { EditSocietyComponent } from './components/edit-society/edit-society.component';
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
      // {
      //   path: 'details/:id',
      //   component: DetailSocietyComponent,
      // },
    ],
  },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SocietyRoutingModule { }
