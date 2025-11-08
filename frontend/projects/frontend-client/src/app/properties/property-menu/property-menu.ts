import {Component, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Menubar} from 'primeng/menubar';
import {CheckedMenu} from '../../../../../shared-modules/src/lib/checked-menu/checked-menu';

@Component({
  selector: 'app-property-menu',
  imports: [FormsModule, Menubar],
  templateUrl: './property-menu.html',
  styleUrl: './property-menu.css',
})
export class PropertyMenu extends CheckedMenu implements OnInit {

  ngOnInit() {
    this.items = [
      {
        label: this.translateService.instant('MENU.PROPERTIES.USER_PROPERTY'),
        routerLink: '/properties/user-property',
        id: 'userProperty'
      },
      {
        label: this.translateService.instant('MENU.PROPERTIES.ADDRESS_PROPERTY'),
        routerLink: '/properties/property-address',
        id: 'addressProperty'
      }
    ];
  }
}
