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

  authenticated = false;
  protected keycloakStatus: string | undefined;
  private readonly keycloak: Keycloak = inject(Keycloak);
  private readonly keycloakSignal = inject(KEYCLOAK_EVENT_SIGNAL);
  private readonly router: Router = inject(Router);
  private readonly translateService: TranslateService =
    inject(TranslateService);
  private config: PrimeNG = inject(PrimeNG);

  constructor() {
    this.translateService.setDefaultLang('en');
    this.translateService
      .get('primeng')
      .subscribe((res) => this.config.setTranslation(res));
    effect(() => {
      const keycloakEvent = this.keycloakSignal();

      this.keycloakStatus = keycloakEvent.type;

      if (keycloakEvent.type === KeycloakEventType.Ready) {
        this.authenticated = typeEventArgs<ReadyArgs>(keycloakEvent.args);
      }
      if (keycloakEvent.type === KeycloakEventType.TokenExpired) {
        this.keycloak.updateToken();
      }

      if (keycloakEvent.type === KeycloakEventType.AuthLogout) {
        this.authenticated = false;
        this.router.navigate(['login']);
      }
    });
  }

  ngOnInit() {
    this.config.ripple.set(true);
  }
}
