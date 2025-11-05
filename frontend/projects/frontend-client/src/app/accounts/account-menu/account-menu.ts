import {Component, inject, Input, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {FormsModule} from '@angular/forms';
import {MenuItem} from 'primeng/api';
import {Menubar} from 'primeng/menubar';

@Component({
  selector: 'app-account-menu',
  imports: [FormsModule, Menubar],
  templateUrl: './account-menu.html',
  styleUrl: './account-menu.css',
})
export class AccountMenu implements OnInit {
  @Input() checkedInput: string | undefined;
  protected readonly translateService: TranslateService = inject(TranslateService);
  protected items: MenuItem[] | undefined;

  constructor() {
    this.translateService.setDefaultLang('en')
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
