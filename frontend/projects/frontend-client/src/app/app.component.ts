import { Component, effect, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PrimeNG } from 'primeng/config';
import Keycloak from 'keycloak-js';
import {
  KEYCLOAK_EVENT_SIGNAL,
  KeycloakEventType,
  ReadyArgs,
  typeEventArgs,
} from 'keycloak-angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [RouterOutlet, TranslateModule, ToastModule],
  standalone: true,
})
export class AppComponent {
  title = 'frontend-client';
  protected readonly store = inject(PropertyStore);
  constructor(
    private primeng: PrimeNG,
    private translateService: TranslateService,
  ) {
    effect(() => {
      let userProperty = this.store.userProperty();
      if (userProperty && userProperty.language != undefined) {
        const language: Language = userProperty.language.toLowerCase();
        this.translateService.use(language);
      }
    });
  }
}
