import {bootstrapApplication, BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule, routes} from './app/app-routing.module';
import {provideTranslateService, TranslateLoader, TranslatePipe} from '@ngx-translate/core';
import {AppComponent} from './app/app.component';
import {importProvidersFrom, isDevMode} from '@angular/core';
import {HttpClient, provideHttpClient, withFetch, withInterceptors} from '@angular/common/http';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {provideStoreDevtools} from '@ngrx/store-devtools';
import {provideStore} from '@ngrx/store';
import {provideKeycloakAngular} from './app/keycloak.config';
import {provideToastr} from 'ngx-toastr';
import {includeBearerTokenInterceptor} from 'keycloak-angular';
import {provideRouter} from '@angular/router';
import {accountReducers} from './app/accounts/state/account.reducers';
import {propertyReducers} from './app/properties/state/properties.reducers';
import {messageReducers} from './app/messages/state/message.reducers';
import {utilReducers} from './app/utils/state/util.reducers';
import {provideAnimations} from '@angular/platform-browser/animations';

const httpLoaderFactory: (http: HttpClient) => TranslateHttpLoader = (
  http: HttpClient
) => new TranslateHttpLoader(http, 'assets/i18n/', '.json');


bootstrapApplication(AppComponent, {
  providers: [
    provideKeycloakAngular(),
    importProvidersFrom(BrowserModule, AppRoutingModule, TranslatePipe),
    provideHttpClient(withFetch()),
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
    provideStore({
      accounts: accountReducers,
      properties: propertyReducers,
      messages: messageReducers,
      utils: utilReducers,
    }),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
      traceLimit: 75,
      connectInZone: true,
    }),
    provideToastr({
      timeOut: 1000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
  ]
})
.catch(err => console.error(err));


