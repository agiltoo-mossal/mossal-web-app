import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SnackBarService } from 'src/app/shared/services/snackbar.service';
import { LoginGQL } from 'src/graphql/generated';
import { AuthService } from '../auth.service';
import { RequestPasswordResetComponent } from '../request-password-reset/request-password-reset.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  passwordVisibility = 'password';
  email: string;
  password: string;
  hidePassword: boolean = true;
  user: any = {
    email: '',
    password: '',
    checkbox: false,
  };

  constructor(
    private authService: AuthService,
    private snackBarService: SnackBarService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
  }

  async login(form: NgForm) {
    try {
      const value = { ...form.value };
      delete value.checkbox;
      await this.authService.login(value);
    } catch(error) {
      this.snackBarService.showErrorSnackBar(4000, "Email ou mot de passe incorrecte!");
    }
  }

  resetPassword() {
    const dialogRef = this.dialog.open(RequestPasswordResetComponent, {
      data: null,
      maxHeight: "90vh"
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Ajoutez la compétence de l'utilisateur avec le résultat.
      }
    });
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }
}
