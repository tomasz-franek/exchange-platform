import {Component, inject, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {FormsModule} from '@angular/forms';
import {CheckedMenu} from '../../../../../shared-modules/src/lib/checked-menu/checked-menu';
import {Menubar} from 'primeng/menubar';
import {MenuItem} from 'primeng/api';

@Component({
  selector: 'app-transaction-menu',
  templateUrl: './transaction-menu.html',
  imports: [FormsModule, Menubar],
  styleUrl: './transaction-menu.css',
})
export class TransactionMenu extends CheckedMenu implements OnInit {
  protected readonly translateService: TranslateService = inject(TranslateService);
  protected items: MenuItem[] | undefined;

  ngOnInit() {
    this.items = [
      {
        label: this.translateService.instant('MENU.TRANSACTIONS.TRANSACTION_LIST'),
        routerLink: '/transactions/transaction-list',
        id: 'transactionList'
      },
      {
        label: this.translateService.instant('MENU.TRANSACTIONS.TRANSACTION_SYSTEM_ACCOUNT_LIST'),
        routerLink: '/transactions/transaction-system-account',
        id: 'transactionSystemAccountList'
      },
      {
        label: this.translateService.instant('MENU.TRANSACTIONS.TRANSACTION_EXCHANGE_ACCOUNT_LIST'),
        routerLink: '/transactions/transaction-exchange-account',
        id: 'transactionFeeAccountList'
      },
    ];
  }
}
