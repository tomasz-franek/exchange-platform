import {
  Component,
  inject,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { AccountFilterParameters } from '../account-filter-parameters';
import { AmountPipe } from '../../../pipes/amount-pipe/amount.pipe';
import { TableModule } from 'primeng/table';
import { AccountsStore } from '../accounts.signal-store';
import { AdminAccountOperationsRequest } from '../../api/model/adminAccountOperationsRequest';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-account-list',
  templateUrl: './account-list.html',
  imports: [TranslatePipe, AmountPipe, TableModule, ReactiveFormsModule],
  styleUrl: './account-list.scss',
})
export class AccountList implements OnChanges {
  @Input() searchParams: AccountFilterParameters | undefined = undefined;
  protected currency: string | undefined = undefined;
  protected readonly store = inject(AccountsStore);

  ngOnChanges(changes: SimpleChanges) {
    if (
      this.searchParams?.userAccountId === undefined ||
      this.searchParams?.dateFromUtc == undefined
    ) {
      this.store.clearAccountOperations();
      return;
    }
    this.currency = this.searchParams.currency;
    const accountOperationsRequest: AdminAccountOperationsRequest = {
      systemAccountId: this.searchParams?.userAccountId,
      dateFromUtc: this.searchParams?.dateFromUtc,
      dateToUtc: this.searchParams?.dateToUtc,
      page: { page: 0, rows: 10 },
    };
    this.store.loadAdminAccountOperationList(accountOperationsRequest);
  }
}
