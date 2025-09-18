import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { OverviewComponent } from './components/overview/overview.component';
import { CreateAdminMossallComponent } from './components/create-admin-mossall/create-admin-mossall.component';
import { EditAdminMossallComponent } from './components/edit-admin-mossall/edit-admin-mossall.component';
import { AdminMossallComponent } from './admin_mossall.component';

const routes: Routes = [
  {
    path: '',
    component: AdminMossallComponent,

    children: [
      {
        path: '',
        component: OverviewComponent,
      },
      {
        path: 'create-admin-mossall',
        component: CreateAdminMossallComponent,
      },
      {
        path: ':id',
        component: EditAdminMossallComponent,
      },
    ],
  },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminMossallRoutingModule {}
