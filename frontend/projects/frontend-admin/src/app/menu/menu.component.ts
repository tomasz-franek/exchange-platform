import {Component, effect, inject} from '@angular/core';
import {
  KEYCLOAK_EVENT_SIGNAL,
  KeycloakEventType,
  ReadyArgs,
  typeEventArgs,
} from 'keycloak-angular';
import {Router, RouterLink} from '@angular/router';
import Keycloak from 'keycloak-js';
import {TranslatePipe} from '@ngx-translate/core';
import {FormsModule} from '@angular/forms';
import { CheckedMenu} from '../../../../shared-modules/src/lib/checked-menu/checked-menu';

@Component({
  selector: 'app-menu',
  imports: [RouterLink, TranslatePipe, FormsModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
})
export class MenuComponent extends CheckedMenu {
  authenticated = false;
  protected keycloakStatus: string | undefined;
  private readonly keycloak: Keycloak = inject(Keycloak);
  protected keycloakSignal = inject(KEYCLOAK_EVENT_SIGNAL);
  private readonly router: Router = inject(Router);

  constructor() {
    super();
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

  login() {
    this.keycloak.login();
  }

  logout() {
    this.keycloak.logout();
    this.authenticated = false;
  }
}
