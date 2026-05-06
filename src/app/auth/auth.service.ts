import { Injectable, NgZone } from '@angular/core';
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
  otpEmailLocalName = 'otpEmail',
  pendingAuthLocalName = 'pendingAuth',
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  role: string = '';
  currentUser: User;
  private logoutTimer: ReturnType<typeof setTimeout> | null = null;

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
    private ngZone: NgZone,
  ) { }

  saveToken(token: string) {
    localStorage.setItem(AuthConstant.access_tokenLocalName, token);
  }

  getToken() {
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
    return Boolean(this.getSession()) && !this.isTokenExpired();
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }

  scheduleAutoLogout() {
    this.cancelAutoLogout();
    const token = this.getToken();
    if (!token) return;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiresInMs = payload.exp * 1000 - Date.now();
      if (expiresInMs <= 0) {
        this.logout();
        return;
      }
      this.ngZone.runOutsideAngular(() => {
        this.logoutTimer = setTimeout(() => {
          this.ngZone.run(() => this.logout());
        }, expiresInMs);
      });
    } catch {
      this.logout();
    }
  }

  cancelAutoLogout() {
    if (this.logoutTimer) {
      clearTimeout(this.logoutTimer);
      this.logoutTimer = null;
    }
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

    this.scheduleAutoLogout();

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
          duration: 2500,
        });
        throw res.data.resetAdminPassword;
      }
    } catch (e) {
      this.snackBarService.showSnackBar('Session expirée!', '', {
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
          duration: 2500,
        });
      }
    } catch (e) {
      this.snackBarService.showSnackBar('Email est invalide!', '', {
        duration: 2500,
      });
    }
  }

  cleanAuthData() {
    const savedCredentials = localStorage.getItem('savedCredentials');
    localStorage.clear();
    sessionStorage.clear();
    if (savedCredentials) {
      localStorage.setItem('savedCredentials', savedCredentials);
    }
  }

  logout() {
    this.cancelAutoLogout();
    this.cleanAuthData();
    this.router.navigate(['/auth/login']);
  }
}