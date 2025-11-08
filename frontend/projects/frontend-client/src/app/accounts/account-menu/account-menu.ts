import {Component, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Menubar} from 'primeng/menubar';
import {CheckedMenu} from '../../../../../shared-modules/src/lib/checked-menu/checked-menu';

@Component({
  selector: 'app-account-menu',
  imports: [FormsModule, Menubar],
  templateUrl: './account-menu.html',
  styleUrl: './account-menu.css',
})
export class AccountMenu extends CheckedMenu implements OnInit {

  constructor() {
    super();
    this.translateService.setDefaultLang('en');
  }

  ngOnInit() {
    this.items = [
      {
        label: this.translateService.instant('MENU.ACCOUNTS.ACCOUNT_LIST'),
        routerLink: '/accounts/account-list',
        id: 'accountList'
      },
      {
        label: this.translateService.instant('MENU.ACCOUNTS.ADD_ACCOUNT'),
        routerLink: '/accounts/account-edit',
        id: 'addAccount'
      },
      {
        label: this.translateService.instant('MENU.ACCOUNTS.WITHDRAW'),
        routerLink: '/accounts/account-withdraw',
        id: 'withdraw'
      },
      {
        label: this.translateService.instant('MENU.ACCOUNTS.BANK_ACCOUNTS'),
        routerLink: '/accounts/bank-accounts',
        id: 'bankAccounts'
      }
    ];
  }
}
