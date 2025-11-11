import {Component, inject} from '@angular/core';
import {AccountMenu} from '../account-menu/account-menu';
import {MenuComponent} from '../../menu/menu.component';
import {UserAccountComponent} from '../../utils/user-account/user-account.component';
import {UserAccount} from '../../api/model/userAccount';
import {TranslatePipe} from '@ngx-translate/core';
import {UserBankAccount} from '../../api/model/userBankAccount';
import {UserData} from '../../api/model/userData';
import {Store} from '@ngrx/store';
import {AccountState, selectUserBankAccountList,} from '../state/account.selectors';
import {loadBankAccountListAction, validateUserBankAccountAction,} from '../state/account.actions';
import {UserBankAccountRequest} from '../../api/model/userBankAccountRequest';
import {TableModule} from 'primeng/table';
import {Button} from 'primeng/button';

@Component({
  selector: 'app-account-bank',
  templateUrl: './account-bank.html',
  styleUrl: './account-bank.scss',
  imports: [AccountMenu, MenuComponent, UserAccountComponent, TranslatePipe, TableModule, Button],
})
export class AccountBankComponent {
  protected _accounts$: UserBankAccount[] = [];
  protected userId: string | undefined = undefined;
  protected userAccountId: string | undefined = undefined;
  private _storeAccount$: Store<AccountState> = inject(Store);

  protected setUserAccount($event: UserAccount) {
    this.userAccountId = $event.id;
    this.loadBankAccounts();
  }

  protected setUser($event: UserData) {
    this.userId = $event.userId;
    this.userAccountId = undefined;
  }

  protected validate(account: UserBankAccount) {
    this._storeAccount$.dispatch(
      validateUserBankAccountAction({userBankAccount: account}),
    );
    this.loadBankAccounts();
  }

  private loadBankAccounts() {
    if (this.userId && this.userAccountId) {
      this._storeAccount$
      .select(selectUserBankAccountList)
      .subscribe((accounts) => {
        this._accounts$ = accounts;
      });
      const userBankAccountRequest: UserBankAccountRequest = {
        userId: this.userId,
        userAccountId: this.userAccountId,
      };
      this._storeAccount$.dispatch(
        loadBankAccountListAction({userBankAccountRequest}),
      );
    } else {
      this._accounts$ = [];
    }
  }
}
