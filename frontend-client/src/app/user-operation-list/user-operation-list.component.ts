import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';
import { UserOperation } from '../api/model/userOperation';
import {
  AccountState,
  selectUserOperationList,
} from '../state/account/account.selectors';
import { loadUserOperationListAction } from '../state/account/account.actions';
import { AsyncPipe, NgForOf } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { AccountOperationsRequest } from '../api/model/accountOperationsRequest';

@Component({
  selector: 'app-user-operation-list',
  imports: [AsyncPipe, NgForOf, TranslatePipe],
  templateUrl: './user-operation-list.component.html',
  styleUrl: './user-operation-list.component.css',
})
export class UserOperationListComponent implements OnInit, OnDestroy {
  protected _operations$!: Observable<UserOperation[]>;
  protected _storeAccount$: Store<AccountState> = inject(Store);
  private readonly _destroy$: Subject<void> = new Subject<void>();

  ngOnInit(): void {
    this._operations$ = this._storeAccount$
      .select(selectUserOperationList)
      .pipe(takeUntil(this._destroy$));
    let accountOperationsRequest: AccountOperationsRequest = {
      dateFrom: '2025-05-03T16:57:52.584Z',
      page: 0,
      size: 10,
    };
    this._storeAccount$.dispatch(
      loadUserOperationListAction({ accountOperationsRequest }),
    );
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
