import {Component, inject, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {FormsModule} from '@angular/forms';
import {CheckedMenu} from '../../../../../shared-modules/src/lib/checked-menu/checked-menu';
import {Menubar} from 'primeng/menubar';
import {MenuItem} from 'primeng/api';

@Component({
  selector: 'app-account-menu',
  templateUrl: './account-menu.html',
  imports: [FormsModule, Menubar],
  styleUrl: './account-menu.css',
})
export class AccountMenu extends CheckedMenu implements OnInit {
  protected readonly translateService: TranslateService = inject(TranslateService);
  protected items: MenuItem[] | undefined;

  ngOnInit() {
    this.items = [
      {
        label: this.translateService.instant('MENU.ACCOUNTS.ACCOUNT_LIST'),
        routerLink: '/accounts/account-list',
        id: 'accountList'
      },
      {
        label: this.translateService.instant('MENU.ACCOUNTS.DEPOSIT'),
        routerLink: '/accounts/account-deposit',
        id: 'accountDeposit'
      },
      {
        label: this.translateService.instant('MENU.ACCOUNTS.SYSTEM'),
        routerLink: '/accounts/account-system',
        id: 'accountSystem'
      },
      {
        label: this.translateService.instant('MENU.ACCOUNTS.BANK_ACCOUNTS'),
        routerLink: '/accounts/bank-accounts',
        id: 'bankAccounts'
      },
    ];
  }
}
