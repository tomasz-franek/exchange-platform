import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TransactionsComponent} from './transactions.component';
import {StoreModule} from '@ngrx/store';
import {Features} from '../features';
import {transactionReducers} from './state/transaction.reducers';

const routes: Routes = [{path: '', component: TransactionsComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes),
    StoreModule.forFeature(Features.transactions, transactionReducers)
  ],
  exports: [RouterModule]
})
export class TransactionsRoutingModule {
}
