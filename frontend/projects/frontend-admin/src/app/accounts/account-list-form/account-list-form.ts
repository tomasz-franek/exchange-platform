import {Component, inject} from '@angular/core';
import {MenuComponent} from '../../menu/menu.component';
import {AccountFilter} from '../account-filter/account-filter';
import {AccountList} from '../account-list/account-list';
import {AccountMenu} from '../account-menu/account-menu';
import {AccountFilterParameters} from '../account-filter-parameters';
import {Paginator, PaginatorState} from 'primeng/paginator';
import {FormBuilder} from '@angular/forms';
import {AccountsStore} from '../accounts.signal-store';
import {AdminAccountOperationsRequest} from '../../api/model/adminAccountOperationsRequest';

@Component({
  selector: 'app-account-list-form',
  templateUrl: './account-list-form.html',
  styleUrl: './account-list-form.scss',
  imports: [MenuComponent, AccountFilter, AccountList, AccountMenu, Paginator],
})
export class AccountListForm {
  protected searchParams: AccountFilterParameters = {
    userAccountId: undefined,
    currency: undefined,
    dateFromUtc: undefined,
    dateToUtc: undefined,
  };
  protected readonly formBuilder = inject(FormBuilder);
  protected readonly store = inject(AccountsStore);
  protected rows: number = 10;
  protected page: number = 0;

  onAccountFilterChanged($event: AccountFilterParameters) {
    this.searchParams = $event;
  }

  onPageChange(event: PaginatorState) {
    if (
      this.searchParams.userAccountId != undefined &&
      this.searchParams.currency != undefined
    ) {
      const adminAccountOperationsRequest = {
        systemAccountId: this.searchParams.userAccountId,
        currency: this.searchParams.currency,
        dateFromUtc: this.searchParams.dateFromUtc || undefined,
        dateToUtc: this.searchParams.dateToUtc || undefined,
        page: { rows: event?.rows || 10, page: event?.page || 0 },
      } as AdminAccountOperationsRequest;
      this.store.loadAdminAccountOperationList(adminAccountOperationsRequest);
    }
  }
}
