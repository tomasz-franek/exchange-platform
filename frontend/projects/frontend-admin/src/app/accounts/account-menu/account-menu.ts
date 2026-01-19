import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Menubar } from 'primeng/menubar';
import { BaseMenuComponent } from '../../base-menu-component/base-menu-component';

@Component({
  selector: 'app-account-menu',
  templateUrl: './account-menu.html',
  imports: [FormsModule, Menubar],
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
        label: this.translateService.instant('MENU.ACCOUNTS.DEPOSIT'),
        routerLink: '/accounts/account-deposit',
        id: 'accountDeposit',
      },
      {
        label: this.translateService.instant('MENU.ACCOUNTS.SYSTEM'),
        routerLink: '/accounts/account-system',
        id: 'accountSystem',
      },
      {
        label: this.translateService.instant('MENU.ACCOUNTS.BANK_ACCOUNTS'),
        routerLink: '/accounts/bank-accounts',
        id: 'bankAccounts',
      },
      {
        label: this.translateService.instant('MENU.ACCOUNTS.CORRECTION'),
        routerLink: '/accounts/account-correction',
      },
    ];
  }
}
