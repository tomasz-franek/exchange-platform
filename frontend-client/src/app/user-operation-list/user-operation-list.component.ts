import { Component, inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
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
export class UserOperationListComponent implements OnInit {
  protected _operations$!: Observable<UserOperation[]>;
  protected _storeAccount$: Store<AccountState> = inject(Store);

  ngOnInit(): void {
    this._operations$ = this._storeAccount$.select(selectUserOperationList);
    let accountOperationsRequest: AccountOperationsRequest = {
      userId: '72aa8932-8798-4d1b-aaf0-590a3e6ffaa5',
      dateFrom: '2025-05-03T16:57:52.584Z',
      page: 0,
      size: 10,
    };
    this._storeAccount$.dispatch(
      loadUserOperationListAction({ accountOperationsRequest }),
    );
  }
}
