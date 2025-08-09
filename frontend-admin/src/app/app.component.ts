import {Component, CUSTOM_ELEMENTS_SCHEMA, effect, inject} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {KEYCLOAK_EVENT_SIGNAL, KeycloakEventType, ReadyArgs, typeEventArgs} from 'keycloak-angular';
import Keycloak from 'keycloak-js';
import {LandingPageComponent} from './utils/landing-page/landing-page.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [RouterOutlet, LandingPageComponent],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppComponent {
  title = 'frontend-admin';

  authenticated = false;
  protected keycloakStatus: string | undefined;
  private readonly keycloak: Keycloak = inject(Keycloak);
  private readonly keycloakSignal = inject(KEYCLOAK_EVENT_SIGNAL);
  private readonly router: Router = inject(Router);


  constructor() {
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


}
