import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Menubar } from 'primeng/menubar';
import { BaseMenuComponent } from '../../base-menu-component/base-menu-component';

@Component({
  selector: 'app-transaction-menu',
  templateUrl: './transaction-menu.html',
  imports: [FormsModule, Menubar],
  styleUrl: './transaction-menu.scss',
})
export class TransactionMenu extends BaseMenuComponent {
  override ngOnInit() {
    this.items = [
      {
        label: this.translateService.instant(
          'MENU.TRANSACTIONS.TRANSACTION_LIST',
        ),
        routerLink: '/transactions/transaction-list',
        id: 'transactionList',
      },
      {
        label: this.translateService.instant(
          'MENU.TRANSACTIONS.TRANSACTION_SYSTEM_ACCOUNT_LIST',
        ),
        routerLink: '/transactions/transaction-system-account',
        id: 'transactionSystemAccountList',
      },
      {
        label: this.translateService.instant(
          'MENU.TRANSACTIONS.TRANSACTION_EXCHANGE_ACCOUNT_LIST',
        ),
        routerLink: '/transactions/transaction-exchange-account',
        id: 'transactionFeeAccountList',
      },
    ];
  }
}
