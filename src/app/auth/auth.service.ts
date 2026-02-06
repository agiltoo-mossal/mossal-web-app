// import { Injectable } from '@angular/core';
// import { Router } from '@angular/router';
// import { KeycloakService } from 'keycloak-angular';
// import { lastValueFrom } from 'rxjs';
// import {
//   FetchCurrentAdminGQL,
//   LoginAdminGQL,
//   LoginInput,
//   ResetAdminPasswordGQL,
//   StartForgotPasswordGQL,
//   User,
// } from 'src/graphql/generated';
// import { SnackBarService } from '../shared/services/snackbar.service';

// export enum AuthConstant {
//   access_tokenLocalName = 'act',
//   refreshTokenLocalName = 'rft',
//   tokenLocalName = 'tmp_tok',
//   sessionLocalName = 'userSession',
// }

// @Injectable({
//   providedIn: 'root',
// })
// export class AuthService {
//   // private static token: string;
//   // private static access_token: string;
//   // private static refresh_token: string;
//   role: string = '';
//   currentUser: User;
//   constructor(
//     private keycloakService: KeycloakService,
//     private loginAdminGQL: LoginAdminGQL,
//     private snackBarService: SnackBarService,
//     private resetPasswordGQL: ResetAdminPasswordGQL,
//     private requestResetPwdGQL: StartForgotPasswordGQL,
//     private router: Router,
//     private fetchCurrentAdminGQL: FetchCurrentAdminGQL,

//   ) { }

//   saveToken(token: string) {
//     localStorage.setItem(AuthConstant.access_tokenLocalName, token);
//   }

//   getToken() {
//     // return AuthService.access_token;
//     return localStorage.getItem(AuthConstant.access_tokenLocalName);
//   }

//   saveSession(session: any) {
//     localStorage.setItem(
//       AuthConstant.sessionLocalName,
//       JSON.stringify(session)
//     );
//   }

//   getSession() {
//     return localStorage.getItem(AuthConstant.sessionLocalName);
//   }

//   getSessionAsObject() {
//     const session = localStorage.getItem(AuthConstant.sessionLocalName);
//     if (session) {
//       return JSON.parse(session);
//     }
//     return null;
//   }

//   getCurrentUser() {
//     const session = this.getSessionAsObject();
//     if (session) {
//       return session.user;
//     }
//     return null;
//   }

//   isLogedIn() {
//     return Boolean(this.getSession());
//   }

//   async login(credentials: LoginInput) {
//     try {
//       const res = await lastValueFrom(
//         this.loginAdminGQL.fetch(
//           { loginInput: credentials },
//           { fetchPolicy: 'no-cache' }
//         )
//       );
//       const session = res.data.loginAdmin;

//       // AuthService.token = session.token;
//       // AuthService.access_token = session.access_token;
//       // AuthService.refresh_token = session.refresh_token;
//       localStorage.setItem(
//         AuthConstant.access_tokenLocalName,
//         session.access_token
//       );
//       localStorage.setItem(AuthConstant.tokenLocalName, session.token);
//       localStorage.setItem(
//         AuthConstant.refreshTokenLocalName,
//         session.refresh_token
//       );
//       localStorage.setItem(
//         AuthConstant.sessionLocalName,
//         JSON.stringify(session)
//       );

//       if (!session?.enabled) {
//         this.router.navigate(['/auth/reset']);
//       } else {
//         session.role === 'SUPER_ADMIN' ?
//           this.router.navigate(['/dashboard/society']) :
//           // this.router.navigate(['/dashboard/admin-overview']) :
//           this.router.navigate(['/dashboard']);

//       }
//       // return session;
//     } catch (e) {
//       this.snackBarService.showSnackBar(
//         "Nom d'utilisateur ou mot de passe incorrecte!",
//         '',
//         { panelClass: ['red-snackbar'], duration: 2500 }
//       );
//       throw e;
//     }
//   }

//   async resetPassword(password: string) {
//     const token = localStorage.getItem(AuthConstant.tokenLocalName);
//     try {
//       const res = await lastValueFrom(
//         this.resetPasswordGQL.mutate({
//           resetPasswordInput: { password, token },
//         })
//       );
//       if (res.data.resetAdminPassword) {
//         this.router.navigate(['/auth/login']);
//       } else {
//         this.snackBarService.showSnackBar('Session expirée!', '', {
//           panelClass: ['red-snackbar'],
//           duration: 2500,
//         });
//         throw res.data.resetAdminPassword;
//       }
//     } catch (e) {
//       this.snackBarService.showSnackBar('Session expirée!', '', {
//         panelClass: ['red-snackbar'],
//         duration: 2500,
//       });
//       throw e;
//     }
//   }

//   async requestResetPassword(email: string) {
//     try {
//       const res = await lastValueFrom(
//         this.requestResetPwdGQL.mutate({
//           email,
//         })
//       );
//       if (res.data.startForgotPassword) {
//         this.router.navigate(['/auth/login']);
//       } else {
//         this.snackBarService.showSnackBar('email invalide', '', {
//           panelClass: ['red-snackbar'],
//           duration: 2500,
//         });
//       }
//     } catch (e) {
//       this.snackBarService.showSnackBar('Email est invalide!', '', {
//         panelClass: ['red-snackbar'],
//         duration: 2500,
//       });
//     }
//   }

//   cleanAuthData() {
//     const savedCredentials = localStorage.getItem('savedCredentials');
//     localStorage.clear();
//     if (savedCredentials) {
//       localStorage.setItem('savedCredentials', savedCredentials);
//     }
//   }

//   logout() {
//     // AuthService.access_token = null;
//     // AuthService.refresh_token = null;
//     // AuthService.token = null;
//     this.cleanAuthData();
//     this.router.navigate(['/auth/login']);
//     // return true;
//   }

// }



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
  otpEmailLocalName = 'otpEmail',
  pendingAuthLocalName = 'pendingAuth',
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
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
    // Ajoutez ces injections
    // private verifyOtpGQL: VerifyOtpGQL,
    // private resendOtpGQL: ResendOtpGQL,
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
    return Boolean(this.getSession());
  }


  async login(credentials: LoginInput) {
  try {
    // SIMULATION OTP - Commenter ce bloc pour utiliser l'API réelle
    // ============================================================
    sessionStorage.setItem(AuthConstant.otpEmailLocalName, credentials.email);
    sessionStorage.setItem(AuthConstant.pendingAuthLocalName, 'true');
    
    // Simuler une session temporaire
    const tempSession = {
      access_token: 'fake-access-token',
      token: 'fake-token',
      refresh_token: 'fake-refresh-token',
      enabled: true,
      role: 'SUPER_ADMIN',
      user: {
        email: credentials.email,
        name: 'Admin Test'
      },
      requiresOtp: true
    };
    sessionStorage.setItem('tempSession', JSON.stringify(tempSession));
    
    this.snackBarService.showSnackBar(
      'Un code OTP a été envoyé à votre adresse email.',
      '',
      { panelClass: ['green-snackbar'], duration: 3000 }
    );
    
    this.router.navigate(['/auth/verify-otp']);
    return { requiresOtp: true };
    // ============================================================
    // FIN SIMULATION

    /* DECOMMENTEZ CE CODE POUR UTILISER L'API REELLE
    const res = await lastValueFrom(
      this.loginAdminGQL.fetch(
        { loginInput: credentials },
        { fetchPolicy: 'no-cache' }
      )
    );
    const session = res.data.loginAdmin;

    // Vérifier si l'OTP est requis
    if (session.requiresOtp) {
      sessionStorage.setItem(AuthConstant.otpEmailLocalName, credentials.email);
      sessionStorage.setItem(AuthConstant.pendingAuthLocalName, 'true');
      sessionStorage.setItem('tempSession', JSON.stringify(session));
      
      this.snackBarService.showSnackBar(
        'Un code OTP a été envoyé à votre adresse email.',
        '',
        { panelClass: ['green-snackbar'], duration: 3000 }
      );
      
      this.router.navigate(['/auth/verify-otp']);
      return { requiresOtp: true };
    }

    // Si pas besoin d'OTP, connexion normale
    this.completeLogin(session);
    return session;
    */
  } catch (e) {
    this.snackBarService.showSnackBar(
      "Nom d'utilisateur ou mot de passe incorrecte!",
      '',
      { panelClass: ['red-snackbar'], duration: 2500 }
    );
    throw e;
  }
}

async verifyOtp(email: string, otpCode: string) {
  try {
    // SIMULATION - Accepter le code 123456
    if (otpCode !== '123456') {
      throw new Error('Code OTP incorrect');
    }

    const tempSession = sessionStorage.getItem('tempSession');
    if (!tempSession) {
      throw new Error('Session non trouvée');
    }
    const session = JSON.parse(tempSession);

    // Nettoyer les données temporaires
    sessionStorage.removeItem(AuthConstant.otpEmailLocalName);
    sessionStorage.removeItem(AuthConstant.pendingAuthLocalName);
    sessionStorage.removeItem('tempSession');

    // Finaliser la connexion
    this.completeLogin(session);

    this.snackBarService.showSnackBar(
      'Connexion réussie!',
      '',
      { panelClass: ['green-snackbar'], duration: 2000 }
    );

    return session;

    /* DECOMMENTEZ CE CODE POUR UTILISER L'API REELLE
    const res = await lastValueFrom(
      this.verifyOtpGQL.mutate(
        { email, otpCode },
        { fetchPolicy: 'no-cache' }
      )
    );
    
    const session = res.data.verifyOtp;

    sessionStorage.removeItem(AuthConstant.otpEmailLocalName);
    sessionStorage.removeItem(AuthConstant.pendingAuthLocalName);
    sessionStorage.removeItem('tempSession');

    this.completeLogin(session);

    this.snackBarService.showSnackBar(
      'Connexion réussie!',
      '',
      { panelClass: ['green-snackbar'], duration: 2000 }
    );

    return session;
    */
  } catch (e) {
    this.snackBarService.showSnackBar(
      'Code OTP incorrect ou expiré!',
      '',
      { panelClass: ['red-snackbar'], duration: 2500 }
    );
    throw e;
  }
}

async resendOtp(email: string) {
  try {
    // SIMULATION - Attendre 1 seconde
    await new Promise(resolve => setTimeout(resolve, 1000));

    this.snackBarService.showSnackBar(
      'Un nouveau code OTP a été envoyé à votre email. Utilisez 123456 pour tester.',
      '',
      { panelClass: ['green-snackbar'], duration: 3000 }
    );

    return true;

    /* DECOMMENTEZ CE CODE POUR UTILISER L'API REELLE
    const res = await lastValueFrom(
      this.resendOtpGQL.mutate(
        { email },
        { fetchPolicy: 'no-cache' }
      )
    );

    this.snackBarService.showSnackBar(
      'Un nouveau code OTP a été envoyé à votre email.',
      '',
      { panelClass: ['green-snackbar'], duration: 3000 }
    );

    return true;
    */
  } catch (e) {
    this.snackBarService.showSnackBar(
      'Erreur lors de l\'envoi du code OTP.',
      '',
      { panelClass: ['red-snackbar'], duration: 2500 }
    );
    throw e;
  }
}

  // async login(credentials: LoginInput) {
  //   try {
  //     const res = await lastValueFrom(
  //       this.loginAdminGQL.fetch(
  //         { loginInput: credentials },
  //         { fetchPolicy: 'no-cache' }
  //       )
  //     );
  //     const session = res.data.loginAdmin;

     

  //     // Si pas besoin d'OTP, connexion normale
  //     this.completeLogin(session);
  //     return session;
  //   } catch (e) {
  //     this.snackBarService.showSnackBar(
  //       "Nom d'utilisateur ou mot de passe incorrecte!",
  //       '',
  //       { panelClass: ['red-snackbar'], duration: 2500 }
  //     );
  //     throw e;
  //   }
  // }

  // Nouvelle méthode pour finaliser la connexion
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
        this.router.navigate(['/dashboard']) :
        this.router.navigate(['/dashboard/society']);
    }
  }

  // // Nouvelle méthode pour vérifier l'OTP
  // async verifyOtp(email: string, otpCode: string) {
  //   try {
  //     // Remplacez ceci par votre mutation GraphQL réelle
  //     // const res = await lastValueFrom(
  //     //   this.verifyOtpGQL.mutate(
  //     //     { email, otpCode },
  //     //     { fetchPolicy: 'no-cache' }
  //     //   )
  //     // );
      
  //     // const session = res.data.verifyOtp;

  //     // SIMULATION - À REMPLACER PAR LE CODE CI-DESSUS
  //     const tempSession = sessionStorage.getItem('tempSession');
  //     if (!tempSession) {
  //       throw new Error('Session non trouvée');
  //     }
  //     const session = JSON.parse(tempSession);

  //     // Nettoyer les données temporaires
  //     sessionStorage.removeItem(AuthConstant.otpEmailLocalName);
  //     sessionStorage.removeItem(AuthConstant.pendingAuthLocalName);
  //     sessionStorage.removeItem('tempSession');

  //     // Finaliser la connexion
  //     this.completeLogin(session);

  //     this.snackBarService.showSnackBar(
  //       'Connexion réussie!',
  //       '',
  //       { panelClass: ['green-snackbar'], duration: 2000 }
  //     );

  //     return session;
  //   } catch (e) {
  //     this.snackBarService.showSnackBar(
  //       'Code OTP incorrect ou expiré!',
  //       '',
  //       { panelClass: ['red-snackbar'], duration: 2500 }
  //     );
  //     throw e;
  //   }
  // }

  // Nouvelle méthode pour renvoyer l'OTP
  // async resendOtp(email: string) {
  //   try {
  //     // Remplacez ceci par votre mutation GraphQL réelle
  //     // const res = await lastValueFrom(
  //     //   this.resendOtpGQL.mutate(
  //     //     { email },
  //     //     { fetchPolicy: 'no-cache' }
  //     //   )
  //     // );

  //     // SIMULATION - À REMPLACER PAR LE CODE CI-DESSUS
  //     await new Promise(resolve => setTimeout(resolve, 1000));

  //     this.snackBarService.showSnackBar(
  //       'Un nouveau code OTP a été envoyé à votre email.',
  //       '',
  //       { panelClass: ['green-snackbar'], duration: 3000 }
  //     );

  //     return true;
  //   } catch (e) {
  //     this.snackBarService.showSnackBar(
  //       'Erreur lors de l\'envoi du code OTP.',
  //       '',
  //       { panelClass: ['red-snackbar'], duration: 2500 }
  //     );
  //     throw e;
  //   }
  // }

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
    sessionStorage.clear();
    if (savedCredentials) {
      localStorage.setItem('savedCredentials', savedCredentials);
    }
  }

  logout() {
    this.cleanAuthData();
    this.router.navigate(['/auth/login']);
  }
}