import {Component, effect, inject, OnInit} from '@angular/core';
import {KEYCLOAK_EVENT_SIGNAL, KeycloakEventType, ReadyArgs, typeEventArgs,} from 'keycloak-angular';
import {Router} from '@angular/router';
import Keycloak from 'keycloak-js';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {FormsModule} from '@angular/forms';
import {CheckedMenu} from '../../../../shared-modules/src/lib/checked-menu/checked-menu';
import {Button} from 'primeng/button';
import {Menubar} from 'primeng/menubar';
import {MenuItem} from 'primeng/api';

@Component({
  selector: 'app-menu',
  imports: [TranslatePipe, FormsModule, Button, Menubar],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
})
export class MenuComponent extends CheckedMenu implements OnInit {
  authenticated = false;
  protected keycloakStatus: string | undefined;
  protected keycloakSignal = inject(KEYCLOAK_EVENT_SIGNAL);
  protected items: MenuItem[] | undefined;
  protected readonly translateService: TranslateService = inject(TranslateService);
  private readonly keycloak: Keycloak = inject(Keycloak);
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

  ngOnInit() {
    this.items = [
      {
        label: this.translateService.instant('APPLICATION_NAME'),
        icon: 'pi pi-home',
        routerLink: '/dashboard',
        id: 'home',
        name: 'home',
        command: () => {
          this.setChecked('home');
        }
      },
      {
        label: this.translateService.instant('MENU.ACCOUNTS.NAME'),
        routerLink: '/accounts',
        id: 'accounts',
        name: 'accounts',
        command: () => {
          this.setChecked('accounts');
        }
      },
      {
        label: this.translateService.instant('MENU.TRANSACTIONS.NAME'),
        routerLink: '/transactions',
        id: 'transactions',
        name: 'transactions',
        command: () => {
          this.setChecked('transactions');
        }
      },
      {
        label: this.translateService.instant('MENU.REPORTS.NAME'),
        routerLink: '/reports',
        id: 'reports',
        name: 'reports',
        command: () => {
          this.setChecked('reports');
        }
      },
      {
        label: this.translateService.instant('MENU.MESSAGES.NAME'),
        routerLink: '/messages',
        id: 'messages',
        name: 'messages',
        command: () => {
          this.setChecked('messages');
        }
      },
      {
        label: this.translateService.instant('MENU.STATISTICS.NAME'),
        routerLink: '/statistics',
        id: 'statistics',
        name: 'statistics',
        command: () => {
          this.setChecked('statistics');
        }
      },
      {
        label: this.translateService.instant('MENU.MONITORING.NAME'),
        routerLink: '/monitoring',
        id: 'monitoring',
        name: 'monitoring',
        command: () => {
          this.setChecked('monitoring');
        }
      },
      {
        label: this.translateService.instant('MENU.PROPERTIES.NAME'),
        routerLink: '/properties',
        id: 'properties',
        name: 'properties',
        style: {
          focused: true,
        },
        command: () => {
          this.setChecked('properties');
        }
      }
    ];
  }

  login() {
    this.keycloak.login();
  }

  logout() {
    this.keycloak.logout();
    this.authenticated = false;
  }

  setChecked(property: string) {
    this.checkedInput = property;
  }
}
