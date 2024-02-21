import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoginGQL, LoginInput, RegisterGQL, RegisterInput, RequestPasswordResetGQL, ResetPasswordGQL, ResetPasswordInput, Session, UserRole } from 'src/graphql/generated';

export enum AuthConstant {
  tokenLocalName = "token",
  sessionLocalName = "userSession"
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private loginGQL: LoginGQL,
    private registerGQL: RegisterGQL,
    private router: Router,
    private requestPasswordResetGQL: RequestPasswordResetGQL,
    private resetPassswordGQL: ResetPasswordGQL
  ) { }

  login(payload: LoginInput): Promise<Session> {
    return new Promise((resolve, reject) => {
      this.loginGQL.fetch({ loginInput: payload }).subscribe(
        result => {
          if(result.errors) {

            reject(result.errors);
          }
          const session = result.data?.login as Session;
          this.finalizeAuthentification(session);
          resolve(session as Session);
        },
        error => {
          reject(error);
        }
      )
    })
  }

  register(payload: RegisterInput): Promise<Session> {
    return new Promise((resolve, reject) => {
      this.registerGQL.mutate({ registerInput: payload }).subscribe(
        result => {
          if(result.errors) {
            reject(result.errors);
          }
          const session = result.data?.register as Session;
          this.finalizeAuthentification(session);
          resolve(session as Session);
        },
        error => {
          reject(error);
        }
      )
    })
  }

  finalizeAuthentification(session: Session) {
    this.saveToken(session.token);
    this.saveSession(session);
    switch(session.user.role) {
      case UserRole.Talent:
        this.router.navigate(['/talent/dashboard']);
        break;
      case UserRole.Admin:
        this.router.navigate(['/admin/courses']);
        break;
      case UserRole.Instructor:
        this.router.navigate(['/admin/courses']);
        break;
      default:
        this.router.navigate(['/talent/dashboard']);
    }
  }

  saveToken(token: string) {
    localStorage.setItem(AuthConstant.tokenLocalName, token);
  }

  getToken() {
    return localStorage.getItem(AuthConstant.tokenLocalName);
  }

  saveSession(session: Session) {
    localStorage.setItem(AuthConstant.sessionLocalName, JSON.stringify(session));
  }

  getSession() {
    return localStorage.getItem(AuthConstant.sessionLocalName);
  }

  getSessionAsObject() {
    const session = localStorage.getItem(AuthConstant.sessionLocalName);
    if(session) {
      return JSON.parse(session);
    }
    return null;
  }

  getCurrentUser() {
    const session = this.getSessionAsObject();
    if(session) {
      return session.user;
    }
    return null;
  }

  isLogedIn() {
    return Boolean(this.getSession());
  }

  cleanAuthData() {
    localStorage.clear();
  }

  requestPasswordReset(email: string) {
    return this.requestPasswordResetGQL.mutate({ email });
  }

  resetPassword(payload: ResetPasswordInput) {
    return this.resetPassswordGQL.mutate({ resetPasswordInput: payload });
  }
}
