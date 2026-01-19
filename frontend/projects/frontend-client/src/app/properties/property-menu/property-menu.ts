import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Menubar } from 'primeng/menubar';
import { BaseMenuComponent } from '../../base-menu-component/base-menu-component';

@Component({
  selector: 'app-property-menu',
  imports: [FormsModule, Menubar],
  templateUrl: './property-menu.html',
  styleUrl: './property-menu.scss',
})
export class PropertyMenu extends BaseMenuComponent {
  override ngOnInit() {
    this.items = [
      {
        label: this.translateService.instant('MENU.PROPERTIES.USER_PROPERTY'),
        routerLink: '/properties/user-property',
        id: 'userProperty',
      },
      {
        label: this.translateService.instant(
          'MENU.PROPERTIES.ADDRESS_PROPERTY',
        ),
        routerLink: '/properties/property-address',
        id: 'addressProperty',
      },
    ];
  }
}
