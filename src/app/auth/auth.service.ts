import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { lastValueFrom } from 'rxjs';
import {
  FetchCurrentAdminGQL,
  LoginAdminGQL,
  LoginInput,
  ResetAdminPasswordGQL,
  StartForgotPasswordGQL,
  User,
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

      // AuthService.token = session.token;
      // AuthService.access_token = session.access_token;
      // AuthService.refresh_token = session.refresh_token;
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
          // this.router.navigate(['/dashboard/admin-overview']) :
          this.router.navigate(['/dashboard']);

      }
      // return session;
    } catch (e) {
      this.snackBarService.showSnackBar(
        "Nom d'utilisateur ou mot de passe incorrecte!",
        '',
        { panelClass: ['red-snackbar'], duration: 2500 }
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
