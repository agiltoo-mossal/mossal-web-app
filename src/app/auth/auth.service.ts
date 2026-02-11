import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { lastValueFrom } from 'rxjs';
import {
  FetchCurrentAdminGQL,
  LoginAdminGQL,
  LoginInput,
  ResendOtpGQL,
  ResetAdminPasswordGQL,
  StartForgotPasswordGQL,
  User,
  VerifyOtpGQL,

} from 'src/graphql/generated';
import { SnackBarService } from '../shared/services/snackbar.service';

export enum AuthConstant {
  access_tokenLocalName = 'act',
  refreshTokenLocalName = 'rft',
  tokenLocalName = 'tmp_tok',
  sessionLocalName = 'userSession',
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // private static token: string;
  // private static access_token: string;
  // private static refresh_token: string;
  role: string = '';
  currentUser: User;
  constructor(
    private keycloakService: KeycloakService,
    private loginAdminGQL: LoginAdminGQL,
    private snackBarService: SnackBarService,
    private resetPasswordGQL: ResetAdminPasswordGQL,
    private requestResetPwdGQL: StartForgotPasswordGQL,
    private router: Router,
    private fetchCurrentAdminGQL: FetchCurrentAdminGQL,
    private verifyOtpGQL: VerifyOtpGQL,
    private resendOtpGQL: ResendOtpGQL,
  ) { }

  saveToken(token: string) {
    localStorage.setItem(AuthConstant.access_tokenLocalName, token);
  }

  getToken() {
    // return AuthService.access_token;
    return localStorage.getItem(AuthConstant.access_tokenLocalName);
  }

  saveSession(session: any) {
    localStorage.setItem(
      AuthConstant.sessionLocalName,
      JSON.stringify(session)
    );
  }

  getSession() {
    return localStorage.getItem(AuthConstant.sessionLocalName);
  }

  getSessionAsObject() {
    const session = localStorage.getItem(AuthConstant.sessionLocalName);
    if (session) {
      return JSON.parse(session);
    }
    return null;
  }

  getCurrentUser() {
    const session = this.getSessionAsObject();
    if (session) {
      return session.user;
    }
    return null;
  }

  isLogedIn() {
    return Boolean(this.getSession());
  }

  async login(credentials: LoginInput) {
    try {
      const res = await lastValueFrom(
        this.loginAdminGQL.fetch(
          { loginInput: credentials },
          { fetchPolicy: 'no-cache' }
        )
      );

      const session = res.data.loginAdmin;

      if (session.otpRequired) {
        sessionStorage.setItem(AuthConstant.otpEmailLocalName, credentials.email);
        sessionStorage.setItem(AuthConstant.pendingAuthLocalName, 'true');

        this.snackBarService.showSnackBar(
          'Un code OTP a été envoyé à votre adresse email.',
          '',
          { duration: 3000 }
        );

        this.router.navigate(['/auth/verify-otp']);
        return;
      }

      this.completeLogin(session);

    } catch (e) {
      this.snackBarService.showSnackBar(
        "Nom d'utilisateur ou mot de passe incorrect!",
        '',
        { duration: 2500 }
      );
      throw e;
    }
  }

  async resendOtp(email: string) {
    try {
      await lastValueFrom(
        this.resendOtpGQL.mutate(
          { email },
          { fetchPolicy: 'no-cache' }
        )
      );

      this.snackBarService.showSnackBar(
        'Un nouveau code OTP a été envoyé à votre email.',
        '',
        { duration: 3000 }
      );

      return true;
    } catch (e) {
      this.snackBarService.showSnackBar(
        "Erreur lors de l'envoi du code OTP.",
        '',
        { duration: 3000 }
      );
      throw e;
    }
  }

  private completeLogin(session: any) {
    localStorage.setItem(
      AuthConstant.access_tokenLocalName,
      session.access_token
    );
    localStorage.setItem(AuthConstant.tokenLocalName, session.token);
    localStorage.setItem(
      AuthConstant.refreshTokenLocalName,
      session.refresh_token
    );
    localStorage.setItem(
      AuthConstant.sessionLocalName,
      JSON.stringify(session)
    );

    if (!session?.enabled) {
      this.router.navigate(['/auth/reset']);
    } else {
      session.role === 'SUPER_ADMIN' ?
        this.router.navigate(['/dashboard/society']) :
        this.router.navigate(['/dashboard']);
    }
  }

  async verifyOtp(email: string, otpCode: string) {
    try {
      const res = await lastValueFrom(
        this.verifyOtpGQL.mutate(
          {
            verifyOtpInput: {
              email,
              code: otpCode
            }
          },
          { fetchPolicy: 'no-cache' }
        )
      );

      const session = res.data.verifyOtp;

      sessionStorage.removeItem(AuthConstant.otpEmailLocalName);
      sessionStorage.removeItem(AuthConstant.pendingAuthLocalName);

      this.completeLogin(session);

      return session;

    } catch (e) {
      this.snackBarService.showSnackBar(
        'Code OTP incorrect ou expiré!',
        '',
        { duration: 4000 }
      );
      throw e;
    }
  }


  async resetPassword(password: string) {
    const token = localStorage.getItem(AuthConstant.tokenLocalName);
    try {
      const res = await lastValueFrom(
        this.resetPasswordGQL.mutate({
          resetPasswordInput: { password, token },
        })
      );
      if (res.data.resetAdminPassword) {
        this.router.navigate(['/auth/login']);
      } else {
        this.snackBarService.showSnackBar('Session expirée!', '', {
          panelClass: ['red-snackbar'],
          duration: 2500,
        });
        throw res.data.resetAdminPassword;
      }
    } catch (e) {
      this.snackBarService.showSnackBar('Session expirée!', '', {
        panelClass: ['red-snackbar'],
        duration: 2500,
      });
      throw e;
    }
  }

  async requestResetPassword(email: string) {
    try {
      const res = await lastValueFrom(
        this.requestResetPwdGQL.mutate({
          email,
        })
      );
      if (res.data.startForgotPassword) {
        this.router.navigate(['/auth/login']);
      } else {
        this.snackBarService.showSnackBar('email invalide', '', {
          panelClass: ['red-snackbar'],
          duration: 2500,
        });
      }
    } catch (e) {
      this.snackBarService.showSnackBar('Email est invalide!', '', {
        panelClass: ['red-snackbar'],
        duration: 2500,
      });
    }
  }

  cleanAuthData() {
    const savedCredentials = localStorage.getItem('savedCredentials');
    localStorage.clear();
    if (savedCredentials) {
      localStorage.setItem('savedCredentials', savedCredentials);
    }
  }

  logout() {
    // AuthService.access_token = null;
    // AuthService.refresh_token = null;
    // AuthService.token = null;
    this.cleanAuthData();
    this.router.navigate(['/auth/login']);
    // return true;
  }

}


