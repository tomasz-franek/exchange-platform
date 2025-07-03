import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Store } from '@ngrx/store';
import {
  AccountState,
  selectAccountBalanceList,
} from '../state/account/account.selectors';
import { Observable, Subject, takeUntil } from 'rxjs';
import { loadAccountBalanceListAction } from '../state/account/account.actions';
import { TranslatePipe } from '@ngx-translate/core';
import { AccountBalance } from '../api/model/accountBalance';
import { AmountPipe } from '../pipes/amount.pipe';

@Component({
  selector: 'app-account-list',
  imports: [AsyncPipe, TranslatePipe, AmountPipe],
  templateUrl: './account-list.component.html',
  styleUrl: './account-list.component.css',
})
export class AccountListComponent implements OnInit, OnDestroy {
  protected _account$!: Observable<AccountBalance[]>;
  private _storeAccount$: Store<AccountState> = inject(Store);
  private readonly _destroy$: Subject<void> = new Subject<void>();

  ngOnInit(): void {
    this._account$ = this._storeAccount$
      .select(selectAccountBalanceList)
      .pipe(takeUntil(this._destroy$));
    this._storeAccount$.dispatch(loadAccountBalanceListAction());
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
