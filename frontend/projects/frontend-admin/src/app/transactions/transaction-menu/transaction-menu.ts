import {Component, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CheckedMenu} from '../../../../../shared-modules/src/lib/checked-menu/checked-menu';
import {Menubar} from 'primeng/menubar';

@Component({
  selector: 'app-transaction-menu',
  templateUrl: './transaction-menu.html',
  imports: [FormsModule, Menubar],
  styleUrl: './transaction-menu.css',
})
export class TransactionMenu extends CheckedMenu implements OnInit {

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
