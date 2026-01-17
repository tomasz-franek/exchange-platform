import {Component, effect, inject, OnInit} from '@angular/core';
import {
  KEYCLOAK_EVENT_SIGNAL,
  KeycloakEventType,
  ReadyArgs,
  typeEventArgs,
} from 'keycloak-angular';
import {Router} from '@angular/router';
import Keycloak from 'keycloak-js';
import {TranslatePipe} from '@ngx-translate/core';
import {FormsModule} from '@angular/forms';
import {Menubar} from 'primeng/menubar';
import {Button} from 'primeng/button';
import {CheckedMenu} from '../../../../shared-modules/src/lib/checked-menu/checked-menu';
import {PropertyStore} from '../properties/properties.signal-store';

@Component({
  selector: 'app-menu',
  imports: [TranslatePipe, FormsModule, Menubar, Button],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
  standalone: true,
})
export class MenuComponent extends CheckedMenu implements OnInit {
  authenticated = false;
  protected keycloakStatus: string | undefined;
  protected readonly store = inject(PropertyStore);
  private readonly keycloak = inject(Keycloak);
  private readonly keycloakSignal = inject(KEYCLOAK_EVENT_SIGNAL);
  private readonly router = inject(Router);

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

      const userProperty = this.store.userProperty();
      if (userProperty && this.items) {
        this.ngOnInit();
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
        },
      },
      {
        label: this.translateService.instant('MENU.TICKETS.NAME'),
        routerLink: '/tickets',
        id: 'tickets',
        name: 'tickets',
        command: () => {
          this.setChecked('tickets');
        },
      },
      {
        label: this.translateService.instant('MENU.ACCOUNTS.NAME'),
        routerLink: '/accounts',
        id: 'accounts',
        name: 'accounts',
        command: () => {
          this.setChecked('accounts');
        },
      },
      {
        label: this.translateService.instant('MENU.REPORTS.NAME'),
        routerLink: '/reports',
        id: 'reports',
        name: 'reports',
        command: () => {
          this.setChecked('reports');
        },
      },
      {
        label: this.translateService.instant('MENU.MESSAGES.NAME'),
        routerLink: '/messages',
        id: 'messages',
        name: 'messages',
        command: () => {
          this.setChecked('messages');
        },
      },
      {
        label: this.translateService.instant('MENU.RATES.NAME'),
        routerLink: '/rates',
        id: 'rates',
        name: 'rates',
        command: () => {
          this.setChecked('rates');
        },
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
        },
      },
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
