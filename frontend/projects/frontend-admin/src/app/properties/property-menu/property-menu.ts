import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Menubar} from 'primeng/menubar';
import {BaseMenuComponent} from '../../base-menu-component/base-menu-component';

@Component({
  selector: 'app-property-menu',
  templateUrl: './property-menu.html',
  imports: [FormsModule, Menubar],
  styleUrl: './property-menu.scss',
})
export class PropertyMenu extends BaseMenuComponent {
  override ngOnInit() {
    this.items = [
      {
        label: this.translateService.instant(
          'MENU.PROPERTIES.ADMIN_PROPERTIES',
        ),
        routerLink: '/properties/user-property',
        id: 'adminProperty',
      },
      {
        label: this.translateService.instant('MENU.PROPERTIES.ADDRESS'),
        routerLink: '/properties/address-property',
        id: 'addressProperty',
      },
      {
        label: this.translateService.instant('MENU.PROPERTIES.SYSTEM'),
        routerLink: '/properties/system-property',
        id: 'systemProperty',
      },
      {
        label: this.translateService.instant('MENU.PROPERTIES.CURRENCY'),
        routerLink: '/properties/system-currency',
        id: 'currencyProperty',
      }, {
        label: this.translateService.instant('MENU.PROPERTIES.WITHDRAW'),
        routerLink: '/properties/system-withdraw',
        id: 'withdrawProperty',
      },
    ];
  }
}
