import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/guards/auth.guard';
import { guestGuard } from './auth/guards/guest.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },

  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
    // canActivate: [guestGuard]
  },
  // {
  //   path: 'admin',
  //   loadChildren: () =>
  //     import('./admin/admin.module').then((m) => m.AdminModule),
  //   canActivate: [guestGuard],
  // },
  {
    path: 'translations',
    loadChildren: () =>
      import('./translations/translations.module').then(
        (m) => m.TranslationsModule
      ),
    // canActivate: [AuthGuard]
  },
  // {
  //   path: 'success',
  //   loadChildren: () =>
  //     import('./shared/components/success-page//success-page.module').then(
  //       (m) => m.SuccessPageModule
  //     ),
  // },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
