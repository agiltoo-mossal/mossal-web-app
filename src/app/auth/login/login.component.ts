import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SnackBarService } from 'src/app/shared/services/snackbar.service';
import { AuthService } from '../auth.service';
import * as CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  hidePassword: boolean = true;
  form: FormGroup;
  missingUser = null;
  private readonly SECRET_KEY = environment.SECRET_KEY; // Clé secrète pour le cryptage

  constructor(
    private authService: AuthService,
    private snackBarService: SnackBarService,
    private fb: FormBuilder,
    private router: Router
  ) {
    // Récupérer les credentials sauvegardés s'ils existent
    const savedCredentials = localStorage.getItem('savedCredentials');
    let initialEmail = '';
    let initialPassword = '';

    if (savedCredentials) {
      const credentials = JSON.parse(savedCredentials);
      initialEmail = credentials.email || '';
      // Décrypter le mot de passe
      initialPassword = this.decryptPassword(credentials.password);
    }

    this.form = this.fb.group({
      email: [initialEmail, [Validators.required, Validators.email]],
      password: [initialPassword, [Validators.required]],
      rememberMe: [savedCredentials ? true : false],
    });
  }

  ngOnInit(): void {}

  // Méthode pour crypter le mot de passe
  private encryptPassword(password: string): string {
    return CryptoJS.AES.encrypt(password, this.SECRET_KEY).toString();
  }

  // Méthode pour décrypter le mot de passe
  private decryptPassword(encryptedPassword: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedPassword, this.SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  login() {
    if (this.form.invalid) {
      return;
    }
    this.missingUser = null;

    // Sauvegarder ou supprimer les credentials selon l'état de la case "Se souvenir de moi"
    if (this.form.value.rememberMe) {
      const credentials = {
        email: this.form.value.email,
        password: this.encryptPassword(this.form.value.password), // Crypter le mot de passe avant de le sauvegarder
      };
      localStorage.setItem('savedCredentials', JSON.stringify(credentials));
    } else {
      localStorage.removeItem('savedCredentials');
    }

    this.authService
      .login({
        email: this.form.value.email,
        password: this.form.value.password,
      })
      .then(
        (result) => {},
        (error) => {
          this.missingUser = true;
        }
      );
  }
}
