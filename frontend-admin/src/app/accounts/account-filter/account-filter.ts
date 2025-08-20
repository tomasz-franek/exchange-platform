import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import {
  AccountState,
  selectUserAccountsList,
  selectUserList,
} from '../state/account.selectors';
import { LoadUserRequest } from '../../api/model/loadUserRequest';
import {
  loadAccountListAction,
  loadUserListAction,
} from '../state/account.actions';
import { AccountFilterParameters } from '../state/account-filter-parameters';
import { UserAccount } from '../../api/model/userAccount';
import { UserData } from '../../api/model/userData';
import { DateRangePickerComponent } from '../../utils/date-range-picker/date-range-picker-component';

@Component({
  selector: 'app-account-filter',
  templateUrl: './account-filter.html',
  styleUrl: './account-filter.css',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    TranslatePipe,
    DateRangePickerComponent,
  ],
})
export class AccountFilter implements OnInit {
  @Output() accountRequestEvent = new EventEmitter<AccountFilterParameters>();
  maxDateTo: Date = new Date();
  protected readonly formGroup: FormGroup;
  protected _users: UserData[] = [];
  protected _accounts: UserAccount[] = [];
  private readonly formBuilder: FormBuilder = inject(FormBuilder);
  private readonly _storeAccounts$: Store<AccountState> = inject(Store);

  constructor() {
    this.formGroup = this.formBuilder.group({
      userAccountId: [null, Validators.required],
      email: [null, Validators.required],
      userId: [null, Validators.required],
      dateFromUtc: [null, Validators.required],
      dateToUtc: [null, Validators.required],
    });
  }

  ngOnInit() {
    this._storeAccounts$
      .select(selectUserList)
      .subscribe((users) => (this._users = users));
    const loadUserRequest = {
      email: this.formGroup.get('email')?.value,
    } as LoadUserRequest;
    this._storeAccounts$.dispatch(loadUserListAction({ loadUserRequest }));
  }

  loadAccountList() {
    this.formGroup.patchValue({ userAccountId: undefined });
    this._storeAccounts$
      .select(selectUserAccountsList)
      .subscribe((accounts) => {
        this._accounts = accounts;
      });
    this._storeAccounts$.dispatch(
      loadAccountListAction({
        userAccountRequest: { userId: this.formGroup.get('userId')?.value },
      }),
    );
  }

  loadAccountOperations() {
    const parameters = {
      userAccountId: this.formGroup.get('userAccountId')?.value,
      dateFromUtc: this.formGroup.get('dateFromUtc')?.value,
      dateToUtc: this.formGroup.get('dateToUtc')?.value,
      currency: this.getCurrency(this.formGroup.get('userAccountId')?.value),
    } as AccountFilterParameters;
    this.accountRequestEvent.emit(parameters);
  }

  onDateRangeChange(dateRange: { dateFrom: Date | null; dateTo: Date | null }) {
    this.formGroup.patchValue({
      dateFromUtc: dateRange.dateFrom?.toISOString().substring(0, 10),
      dateToUtc: dateRange.dateTo?.toISOString().substring(0, 10),
    });
    this.loadAccountOperations();
  }

  private getCurrency(userAccountId: string | undefined) {
    if (userAccountId) {
      return this._accounts.find((account) => account.id === userAccountId)
        ?.currency;
    } else {
      return '';
    }
  }
}
