import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Menubar } from 'primeng/menubar';
import { BaseMenuComponent } from '../../base-menu-component/base-menu-component';

@Component({
  selector: 'app-account-menu',
  imports: [FormsModule, Menubar],
  templateUrl: './account-menu.html',
  styleUrl: './account-menu.scss',
})
export class AccountMenu extends BaseMenuComponent {
  override ngOnInit() {
    this.items = [
      {
        label: this.translateService.instant('MENU.ACCOUNTS.ACCOUNT_LIST'),
        routerLink: '/accounts/account-list',
        id: 'accountList',
      },
      {
        label: this.translateService.instant('MENU.ACCOUNTS.ADD_ACCOUNT'),
        routerLink: '/accounts/account-edit',
        id: 'addAccount',
      },
      {
        label: this.translateService.instant('MENU.ACCOUNTS.WITHDRAW'),
        routerLink: '/accounts/account-withdraw',
        id: 'withdraw',
      },
      {
        label: this.translateService.instant('MENU.ACCOUNTS.BANK_ACCOUNTS'),
        routerLink: '/accounts/bank-accounts',
        id: 'bankAccounts',
      },
    ];
  }
}
