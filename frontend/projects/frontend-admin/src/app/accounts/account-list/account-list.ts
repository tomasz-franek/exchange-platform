import {Component, inject, Input, OnChanges, SimpleChanges,} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {AccountFilterParameters} from '../account-filter-parameters';
import {AmountPipe} from '../../../pipes/amount-pipe/amount.pipe';
import {TableModule} from 'primeng/table';
import {AccountOperationsRequest} from '../../api/model/accountOperationsRequest';
import {AccountsStore} from '../accounts.signal-store';

@Component({
  selector: 'app-account-list',
  templateUrl: './account-list.html',
  imports: [TranslatePipe, AmountPipe, TableModule],
  styleUrl: './account-list.scss',
})
export class AccountList implements OnChanges {
  @Input() searchParams: AccountFilterParameters | undefined = undefined;
  protected currency: String | undefined = undefined;
  protected readonly store = inject(AccountsStore);

  ngOnChanges(changes: SimpleChanges) {
    if (
      this.searchParams === undefined ||
      this.searchParams.userAccountId === undefined ||
      this.searchParams.dateFromUtc == undefined
    ) {
      return;
    }
    this.currency = this.searchParams.currency;
    const accountOperationsRequest: AccountOperationsRequest = {
      systemAccountId: this.searchParams?.userAccountId,
      dateFromUtc: this.searchParams?.dateFromUtc,
      dateToUtc: this.searchParams?.dateToUtc,
    };
    this.store.loadAccountOperationList(accountOperationsRequest);
  }
}
