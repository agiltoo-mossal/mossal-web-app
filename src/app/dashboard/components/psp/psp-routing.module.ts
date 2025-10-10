import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PspComponent } from './psp.component';
import { OverviewComponent } from './components/overview/overview.component';
import { DetailPspComponent } from './components/detail-psp/detail-psp.component';

const routes: Routes = [
  {
    path: '',
    component: PspComponent,

    children: [
      {
        path: '',
        component: OverviewComponent,
      },
      {
        path: 'details/:id',
        component: DetailPspComponent,
      },
    ],
  },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PspRoutingModule {}
