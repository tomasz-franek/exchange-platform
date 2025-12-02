import {bootstrapApplication, BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app/app.component';
import {importProvidersFrom, isDevMode, provideZoneChangeDetection} from '@angular/core';
import {provideKeycloakAngular} from './app/keycloak.config';
import {provideRouter} from '@angular/router';
import {AppRoutingModule, routes} from './app/app-routing.module';
import {HttpClient, provideHttpClient, withInterceptors} from '@angular/common/http';
import {includeBearerTokenInterceptor} from 'keycloak-angular';
import {provideStore} from '@ngrx/store';
import {accountReducers} from './app/accounts/state/account.reducers';
import {provideStoreDevtools} from '@ngrx/store-devtools';
import {provideAnimations} from '@angular/platform-browser/animations';
import {provideTranslateService, TranslateLoader, TranslatePipe} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {providePrimeNG} from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import {MessageService} from 'primeng/api';

const httpLoaderFactory: (http: HttpClient) => TranslateHttpLoader = (
  http: HttpClient
) => new TranslateHttpLoader(http, './assets/i18n/', '.json');

bootstrapApplication(AppComponent, {
  providers: [
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Aura
      }
    }),
    provideKeycloakAngular(),
    importProvidersFrom(BrowserModule, AppRoutingModule, TranslatePipe),
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes),
    provideHttpClient(withInterceptors([includeBearerTokenInterceptor])),
    provideAnimations(),
    provideTranslateService({
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient]
      },
      defaultLanguage: 'en'
    }),
    provideStore({
      accounts: accountReducers
    }),

    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
      traceLimit: 75,
      connectInZone: true
    }),
    MessageService
  ]
}).catch((err) => console.error(err));
