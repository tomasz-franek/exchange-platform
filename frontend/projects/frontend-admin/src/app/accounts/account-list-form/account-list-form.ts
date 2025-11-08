import { Component } from '@angular/core';
import { MenuComponent } from '../../menu/menu.component';
import { AccountFilter } from '../account-filter/account-filter';
import { AccountList } from '../account-list/account-list';
import { AccountMenu } from '../account-menu/account-menu';
import { AccountFilterParameters } from '../state/account-filter-parameters';

@Component({
  selector: 'app-account-list-form',
  templateUrl: './account-list-form.html',
  styleUrl: './account-list-form.css',
  imports: [MenuComponent, AccountFilter, AccountList, AccountMenu],
})
export class AccountListForm {
  protected searchParams: AccountFilterParameters = {
    userAccountId: undefined,
    currency: undefined,
    dateFromUtc: undefined,
    dateToUtc: undefined,
  };
  onAccountFilterChanged($event: AccountFilterParameters) {
    this.searchParams = $event;
  }
}
