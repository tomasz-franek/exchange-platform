import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe, NgForOf } from '@angular/common';
import { AccountBalance } from '../api';
import { Store } from '@ngrx/store';
import {
  AccountState,
  getAccountBalance,
} from '../state/accounts/account.selectors';
import { Observable } from 'rxjs';
import { getUserAccountList } from '../state/accounts/account.actions';

@Component({
  selector: 'app-account-list',
  imports: [NgForOf, AsyncPipe],
  templateUrl: './account-list.component.html',
  styleUrl: './account-list.component.css',
})
export class AccountListComponent implements OnInit {
  protected _account$!: Observable<AccountBalance[]>;
  private _storeAccount$: Store<AccountState> = inject(Store);

  ngOnInit(): void {
    this._storeAccount$.dispatch(
      getUserAccountList({ userId: '72aa8932-8798-4d1b-aaf0-590a3e6ffaa5' }),
    );
    this._account$ = this._storeAccount$.select(getAccountBalance);
  }
}
