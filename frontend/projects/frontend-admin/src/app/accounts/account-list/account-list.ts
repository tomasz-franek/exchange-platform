import {
  Component,
  inject,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { AccountFilterParameters } from '../state/account-filter-parameters';
import { Store } from '@ngrx/store';
import {
  AccountState,
  selectAccountOperationList,
} from '../state/account.selectors';
import { loadAccountOperationListAction } from '../state/account.actions';
import { AccountOperation } from '../../api/model/accountOperation';
import { AmountPipe } from '../../../pipes/amount-pipe/amount.pipe';

@Component({
  selector: 'app-account-list',
  templateUrl: './account-list.html',
  imports: [TranslatePipe, AmountPipe],
  styleUrl: './account-list.css',
})
export class AccountList implements OnChanges {
  @Input() searchParams: AccountFilterParameters | undefined = undefined;
  protected _operations$: AccountOperation[] = [];
  protected currency: String | undefined = undefined;
  private readonly _storeAccount$: Store<AccountState> = inject(Store);
  ngOnChanges(changes: SimpleChanges) {
    if (
      this.searchParams === undefined ||
      this.searchParams.userAccountId === undefined ||
      this.searchParams.dateFromUtc == undefined
    ) {
      return;
    }
    this.currency = this.searchParams.currency;
    this._storeAccount$
      .select(selectAccountOperationList)
      .subscribe((accountOperations) => {
        this._operations$ = accountOperations;
      });
    this._storeAccount$.dispatch(
      loadAccountOperationListAction({
        loadAccountOperationsRequest: {
          systemAccountId: this.searchParams?.userAccountId,
          dateFromUtc: this.searchParams?.dateFromUtc,
          dateToUtc: this.searchParams?.dateToUtc,
        },
      }),
    );
  }
}
