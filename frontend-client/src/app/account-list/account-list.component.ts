import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe, NgForOf } from '@angular/common';
import { AccountBalance } from '../api';
import { Store } from '@ngrx/store';
import {
  AccountState,
  selectAccountBalanceList,
} from '../state/account/account.selector';
import { Observable } from 'rxjs';
import { loadAccountBalanceListAction } from '../state/account/account.action';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-account-list',
  imports: [NgForOf, AsyncPipe, TranslatePipe],
  templateUrl: './account-list.component.html',
  styleUrl: './account-list.component.css',
})
export class AccountListComponent implements OnInit {
  protected _account$!: Observable<AccountBalance[]>;
  private _storeAccount$: Store<AccountState> = inject(Store);

  ngOnInit(): void {
    this._account$ = this._storeAccount$.select(selectAccountBalanceList);
    this._storeAccount$.dispatch(
      loadAccountBalanceListAction({
        userId: '72aa8932-8798-4d1b-aaf0-590a3e6ffaa5',
      }),
    );
  }
}
