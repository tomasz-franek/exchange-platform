import {Component, inject} from '@angular/core';
import {AccountMenu} from '../account-menu/account-menu';
import {MenuComponent} from '../../menu/menu.component';
import {UserAccountComponent} from '../../utils/user-account/user-account.component';
import {UserAccount} from '../../api/model/userAccount';
import {TranslatePipe} from '@ngx-translate/core';
import {UserBankAccount} from '../../api/model/userBankAccount';
import {UserData} from '../../api/model/userData';
import {UserBankAccountRequest} from '../../api/model/userBankAccountRequest';
import {TableModule} from 'primeng/table';
import {Button} from 'primeng/button';
import {AccountsStore} from '../accounts.signal-store';

@Component({
  selector: 'app-account-bank',
  templateUrl: './account-bank.html',
  styleUrl: './account-bank.scss',
  imports: [AccountMenu, MenuComponent, UserAccountComponent, TranslatePipe, TableModule, Button],
})
export class AccountBankComponent {
  protected userId: string | undefined = undefined;
  protected userAccountId: string | undefined = undefined;
  protected readonly store = inject(AccountsStore);

  protected setUserAccount($event: UserAccount) {
    this.userAccountId = $event.id;
    this.loadBankAccounts();
  }

  protected setUser($event: UserData) {
    this.userId = $event.userId;
    this.userAccountId = undefined;
  }

  protected validate(account: UserBankAccount) {
    this.store.validateBankAccount(account);
    this.loadBankAccounts();
  }

  private loadBankAccounts() {
    if (this.userId && this.userAccountId) {
      const userBankAccountRequest: UserBankAccountRequest = {
        userId: this.userId,
        userAccountId: this.userAccountId,
      };
      this.store.loadBankAccountList(userBankAccountRequest);

    } else {
      this.store.clearBankAccounts();
    }
  }
}
