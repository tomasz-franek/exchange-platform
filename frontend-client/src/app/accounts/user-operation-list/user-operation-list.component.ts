import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { UserOperation } from '../../api/model/userOperation';
import {
  AccountState,
  selectUserOperationList,
} from '../../state/account/account.selectors';
import { loadUserOperationListAction } from '../../state/account/account.actions';
import { TranslatePipe } from '@ngx-translate/core';
import { AccountOperationsRequest } from '../../api/model/accountOperationsRequest';

@Component({
  selector: 'app-user-operation-list',
  imports: [TranslatePipe],
  templateUrl: './user-operation-list.component.html',
  styleUrl: './user-operation-list.component.css',
  standalone: true,
})
export class UserOperationListComponent implements OnInit {
  protected _operations$: UserOperation[] = [];
  protected _storeAccount$: Store<AccountState> = inject(Store);

  ngOnInit(): void {
    let accountOperationsRequest: AccountOperationsRequest = {
      dateFrom: '2025-05-03T16:57:52.584Z',
      page: 0,
      size: 10,
    };
    this._storeAccount$.dispatch(
      loadUserOperationListAction({ accountOperationsRequest }),
    );
    this._storeAccount$.select(selectUserOperationList).subscribe((data) => {
      this._operations$ = data;
    });
  }
}
