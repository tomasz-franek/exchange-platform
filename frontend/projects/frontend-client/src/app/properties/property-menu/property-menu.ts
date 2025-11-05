import {Component, inject, Input, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {Menubar} from 'primeng/menubar';
import {MenuItem} from 'primeng/api';

@Component({
  selector: 'app-property-menu',
  imports: [FormsModule, Menubar],
  templateUrl: './property-menu.html',
  styleUrl: './property-menu.css',
})
export class PropertyMenu implements OnInit {
  @Input() checkedInput: string | undefined;
  protected readonly translateService: TranslateService = inject(TranslateService);
  protected items: MenuItem[] | undefined;

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
