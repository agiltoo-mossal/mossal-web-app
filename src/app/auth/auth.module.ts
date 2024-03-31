import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './login/login.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {MatCardModule} from '@angular/material/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SnackBarService } from '../shared/services/snackbar.service';
import { AuthService } from './auth.service';
import { NgxCaptchaModule } from 'ngx-captcha';
import { SuccessPageModule } from '../shared/components/success-page/success-page.module';
import { TranslateModule } from '@ngx-translate/core';
import { FooterModule } from '../shared/components/footer/footer.module';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatStepperModule} from '@angular/material/stepper';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [
    AuthComponent,
    LoginComponent,
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    FlexLayoutModule,
    MatIconModule,
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    NgxCaptchaModule,
    SuccessPageModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatStepperModule,
    TranslateModule,
    FooterModule,
    MatDialogModule
  ],
  providers: [SnackBarService, AuthService],
  exports: [],
})
export class AuthModule {}
