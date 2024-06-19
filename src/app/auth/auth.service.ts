import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

export enum AuthConstant {
  tokenLocalName = "token",
  sessionLocalName = "userSession"
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
  ) { }

  saveToken(token: string) {
    localStorage.setItem(AuthConstant.tokenLocalName, token);
  }

  getToken() {
    return localStorage.getItem(AuthConstant.tokenLocalName);
  }

  saveSession(session: any) {
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
}
