import {Component, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CheckedMenu} from '../../../../../shared-modules/src/lib/checked-menu/checked-menu';
import {Menubar} from 'primeng/menubar';

@Component({
  selector: 'app-property-menu',
  templateUrl: './property-menu.html',
  imports: [FormsModule, Menubar],
  styleUrl: './property-menu.scss',
})
export class PropertyMenu extends CheckedMenu implements OnInit {

  ngOnInit() {
    this.items = [
      {
        label: this.translateService.instant('MENU.PROPERTIES.ADMIN_PROPERTIES'),
        routerLink: '/properties/user-property',
        id: 'adminProperty'
      },
      {
        label: this.translateService.instant('MENU.PROPERTIES.ADDRESS'),
        routerLink: '/properties/address-property',
        id: 'addressProperty'
      },
      {
        label: this.translateService.instant('MENU.PROPERTIES.SYSTEM'),
        routerLink: '/properties/system-property',
        id: 'systemProperty'
      },
      {
        label: this.translateService.instant('MENU.PROPERTIES.CURRENCY'),
        routerLink: '/properties/system-currency',
        id: 'currencyProperty'
      },
    ];
  }
}
