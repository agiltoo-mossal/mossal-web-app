import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GraphQLModule } from './graphql/graphql.module';
import {
  HttpClientModule,
  HTTP_INTERCEPTORS,
  HttpClient,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthInterceptor } from './auth/interceptors/auth.interceptor';
import { ErrorInterceptor } from './auth/interceptors/error.interceptor';
import { HeaderModule } from './shared/components/header/header.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AppService } from './app.service';
import { ApplyContextClassModule } from './shared/directives/apply-context-class/apply-context-class.module';
import { ShowOnContextModule } from './shared/directives/show-on-context/show-on-context.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProgressBarInterceptor } from './shared/interceptors/progress-bar.interceptor';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { FooterModule } from './shared/components/footer/footer.module';
import { ScrolTopModule } from './shared/components/scrol-top/scrol-top.module';
import { AdminModule } from './admin/admin.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { KeycloakAngularModule, KeycloakService, KeycloakBearerInterceptor } from 'keycloak-angular';
import { environment } from 'src/environments/environment';

function initializeKeycloak(keycloak: KeycloakService) {
  return () =>
    keycloak.init({
      config: {
        url: environment.KEYCLOAK_URL,
        realm: environment.KEYCLOACK_REALM,
        clientId: environment.KEYCLOACK_CLIENT_ID,

      },
      enableBearerInterceptor: true,

      initOptions: {
        onLoad: 'login-required',
        checkLoginIframe: false
      },
    });
}

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, '/assets/i18n/', '.json');
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GraphQLModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    // TranslateModule.forRoot({
    //   loader: {
    //     provide: TranslateLoader,
    //     useFactory: createTranslateLoader,
    //     deps: [HttpClient],
    //   },
    // }),
    HeaderModule,
    FooterModule,
    FlexLayoutModule,
    ApplyContextClassModule,
    ShowOnContextModule,
    MatProgressBarModule,
    MatSnackBarModule,
    HttpClientModule,
    ScrolTopModule,
    AdminModule,
    NgbModule,
    KeycloakAngularModule
  ],
  providers: [
    // { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ProgressBarInterceptor,
      multi: true,
    },
    AppService,
    KeycloakService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService],
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: KeycloakBearerInterceptor,
      multi: true,
    },
    provideHttpClient(
      withInterceptorsFromDi()
    )
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
