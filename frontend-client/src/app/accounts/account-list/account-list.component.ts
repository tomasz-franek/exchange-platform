import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  AccountState,
  selectAccountBalanceList,
} from '../../state/account/account.selectors';
import { loadAccountBalanceListAction } from '../../state/account/account.actions';
import { TranslatePipe } from '@ngx-translate/core';
import { AccountBalance } from '../../api/model/accountBalance';
import { AmountPipe } from '../../utils/pipes/amount-pipe/amount.pipe';

@Component({
  selector: 'app-account-list',
  imports: [TranslatePipe, AmountPipe],
  templateUrl: './account-list.component.html',
  styleUrl: './account-list.component.css',
  standalone: true,
})
export class AccountListComponent implements OnInit {
  protected _account$: AccountBalance[] = [];
  private _storeAccount$: Store<AccountState> = inject(Store);

  ngOnInit(): void {
    this._storeAccount$
      .select(selectAccountBalanceList)
      .subscribe((data: AccountBalance[]) => {
        this._account$ = data;
      });
    this._storeAccount$.dispatch(loadAccountBalanceListAction());
  }
}
