import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe, NgForOf } from '@angular/common';
import { Store } from '@ngrx/store';
import {
  AccountState,
  selectAccountBalanceList,
} from '../state/account/account.selectors';
import { Observable } from 'rxjs';
import { loadAccountBalanceListAction } from '../state/account/account.actions';
import { TranslatePipe } from '@ngx-translate/core';
import { AccountBalance } from '../api/model/accountBalance';
import { MenuComponent } from '../menu/menu.component';

@Component({
  selector: 'app-account-list',
  imports: [NgForOf, AsyncPipe, TranslatePipe, MenuComponent],
  templateUrl: './account-list.component.html',
  styleUrl: './account-list.component.css',
})
export class AccountListComponent implements OnInit {
  protected _account$!: Observable<AccountBalance[]>;
  private _storeAccount$: Store<AccountState> = inject(Store);

  ngOnInit(): void {
    this._account$ = this._storeAccount$.select(selectAccountBalanceList);
    this._storeAccount$.dispatch(loadAccountBalanceListAction());
  }
}
