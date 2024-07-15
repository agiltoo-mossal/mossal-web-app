import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { AuthService } from './auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class InactivityService {
  private timeoutId: any;
  private readonly timeout: number = 60000 * 5 * 60 * 2; // 1 minutes

  constructor(
    private router: Router,
    private keycloakService: KeycloakService,
    private ngZone: NgZone,
    private authService: AuthService
  ) {
    this.setupInactivityListener();
  }

  private setupInactivityListener() {
    this.resetTimeout();

    ['click', 'keyup', 'mousemove'].forEach(event => {
      document.addEventListener(event, () => this.resetTimeout());
    });
  }

  private resetTimeout() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    this.ngZone.runOutsideAngular(() => {
      this.timeoutId = setTimeout(() => this.logout(), this.timeout);
    });
  }

  private async logout() {
    // await this.keycloakService.logout();
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
