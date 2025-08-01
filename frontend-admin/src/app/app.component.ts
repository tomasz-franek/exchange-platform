import {Component, CUSTOM_ELEMENTS_SCHEMA, effect, inject} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {MenuComponent} from './menu/menu.component';
import {KEYCLOAK_EVENT_SIGNAL, KeycloakEventType, ReadyArgs, typeEventArgs} from 'keycloak-angular';
import Keycloak from 'keycloak-js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [RouterOutlet, MenuComponent],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppComponent {
  title = 'frontend-admin';

  authenticated = false;
  protected keycloakStatus: string | undefined;
  private readonly keycloak = inject(Keycloak);
  private readonly keycloakSignal = inject(KEYCLOAK_EVENT_SIGNAL);
  private readonly router = inject(Router);


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
