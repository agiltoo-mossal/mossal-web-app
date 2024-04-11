import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { OverviewComponent } from './components/overview/overview.component';
import { CreateAdminComponent } from './components/create-admin/create-admin.component';
import { EditAdminComponent } from './components/edit-admin/edit-admin.component';
import { AdminsComponent } from './admins.component';

const routes: Routes = [
  {
    path: '',
    component: AdminsComponent,

    children: [
      {
        path: '',
        component: OverviewComponent,
      },
      {
        path: 'create-collaborator',
        component: CreateAdminComponent,
      },
      {
        path: ':id',
        component: EditAdminComponent,
      },
    ],
  },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CollaboratorsRoutingModule {}
