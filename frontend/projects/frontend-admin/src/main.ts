import {bootstrapApplication, BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule, routes} from './app/app-routing.module';
import {provideTranslateService, TranslateLoader, TranslatePipe,} from '@ngx-translate/core';
import {AppComponent} from './app/app.component';
import {importProvidersFrom, isDevMode, provideZoneChangeDetection,} from '@angular/core';
import {HttpClient, provideHttpClient, withInterceptors,} from '@angular/common/http';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {provideStoreDevtools} from '@ngrx/store-devtools';
import {provideKeycloakAngular} from './app/keycloak.config';
import {includeBearerTokenInterceptor} from 'keycloak-angular';
import {provideRouter} from '@angular/router';
import {providePrimeNG} from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import {provideAnimations} from '@angular/platform-browser/animations';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {MessageService} from 'primeng/api';
import {provideStore} from '@ngrx/store';

const httpLoaderFactory: (http: HttpClient) => TranslateHttpLoader = (
  http: HttpClient,
) => new TranslateHttpLoader(http, 'assets/i18n/', '.json');

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
    provideZoneChangeDetection(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([includeBearerTokenInterceptor])),
    provideAnimations(),
    provideTranslateService({
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient],
      },
      defaultLanguage: 'en',
    }),
    provideStore({}),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
      traceLimit: 75,
      connectInZone: true,
    }),
    MessageService
  ],
}).catch((err) => console.error(err));
