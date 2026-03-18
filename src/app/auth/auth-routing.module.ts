import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './login/login.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { RequestResetPasswordComponent } from './request-reset-password/request-reset-password.component';
import { ConfirmPasswordResetComponent } from './confirm-password-reset/confirm-password-reset.component';
import { OtpVerificationComponent } from './otp-verification/otp-verification.component';

const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
      { path: 'login', component: LoginComponent },
      { path: 'verify-otp', component: OtpVerificationComponent },
      { path: 'reset', component: ResetPasswordComponent },
      {
        path: 'request-password-reset',
        component: RequestResetPasswordComponent,
      },
      {
        path: 'confirm-forgot-password',
        component: ConfirmPasswordResetComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule { }


// import { NgModule } from '@angular/core';
// import { RouterModule, Routes } from '@angular/router';
// import { AuthComponent } from './auth.component';
// import { LoginComponent } from './login/login.component';
// import { ResetPasswordComponent } from './reset-password/reset-password.component';
// import { RequestResetPasswordComponent } from './request-reset-password/request-reset-password.component';
// import { ConfirmPasswordResetComponent } from './confirm-password-reset/confirm-password-reset.component';
// // import { OtpVerificationComponent } from './otp-verification/otp-verification.component';

// const routes: Routes = [
//   {
//     path: '',
//     component: AuthComponent,
//     children: [
//       {
//         path: '',
//         redirectTo: 'login',
//         pathMatch: 'full',
//       },
//       { path: 'login', component: LoginComponent },
//       // { path: 'verify-otp', component: OtpVerificationComponent },
//       { path: 'reset', component: ResetPasswordComponent },
//       {
//         path: 'request-password-reset',
//         component: RequestResetPasswordComponent,
//       },
//       {
//         path: 'confirm-forgot-password',
//         component: ConfirmPasswordResetComponent,
//       },
//     ],
//   },
// ];

// @NgModule({
//   imports: [RouterModule.forChild(routes)],
//   exports: [RouterModule],
// })
// export class AuthRoutingModule { }