import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TransactionsRoutingModule } from './transactions-routing.module';
import { TransactionsComponent } from './transactions.component';
import { TransactionList } from './transaction-list/transaction-list';
import { TransactionFilter } from './transaction-filter/transaction-filter';
import { TransactionListForm } from './transaction-list-form/transaction-list-form';
import { MenuComponent } from '../menu/menu.component';
import { TransactionMenu } from './transaction-menu/transaction-menu';
import { TranslatePipe } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    TransactionsRoutingModule,
    TransactionsComponent,
    MenuComponent,
    TransactionMenu,
    TranslatePipe,
    TransactionList,
    TransactionFilter,
    TransactionListForm,
  ],
})
export class TransactionsModule {}
