import {Component, inject, OnInit} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {TranslatePipe} from '@ngx-translate/core';
import {Store} from '@ngrx/store';
import {AccountMenu} from "../account-menu/account-menu";
import {
  loadAccountListAction,
  loadUserListAction,
  saveDeposit,
  saveWithdraw
} from '../state/account.actions';
import {AccountState, selectUserAccountsList, selectUserList} from '../state/account.selectors';
import {EventType} from '../../api/model/eventType';
import {UserData} from '../../api/model/userData';
import {LoadUserRequest} from '../../api/model/loadUserRequest';
import {UserAccountOperation} from '../../api/model/userAccountOperation';
import {UserAccountRequest} from '../../api/model/userAccountRequest';
import {UserAccount} from '../../api/model/userAccount';

@Component({
  selector: 'app-account-deposit',
  imports: [FormsModule, ReactiveFormsModule, TranslatePipe, AccountMenu, AccountMenu],
  templateUrl: './account-deposit.component.html',
  styleUrl: './account-deposit.component.css',
  standalone: true,
})
export class AccountDepositComponent implements OnInit {
  formGroup: FormGroup;
  protected _account$: UserAccount[] = [];
  protected operations: string[] = [EventType.Deposit, EventType.Withdraw];
  protected users: UserData[] = [];
  private _storeAccount$: Store<AccountState> = inject(Store);
  private formBuilder: FormBuilder = inject(FormBuilder);

  constructor() {
    this.formGroup = this.formBuilder.group({
      amount: new FormControl(null, [
        Validators.required,
        Validators.min(0.01),
      ]),
      operation: new FormControl('', [Validators.required]),
      userAccountId: new FormControl('', [Validators.required]),
      userId: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit() {
    this._storeAccount$
    .select(selectUserList)
    .subscribe((users) => {
      this.users = users;
    });
    const loadUserRequest: LoadUserRequest = {email: undefined};
    this._storeAccount$.dispatch(loadUserListAction({loadUserRequest}));
  }

  sendRequest() {
    const request: UserAccountOperation = {
      amount: this.formGroup.get('amount')?.value,
      userAccountId: this.formGroup.get('userAccountId')?.value,
      userId: this.formGroup.get('userId')?.value,
    };
    request.amount = request.amount * 1_0000;
    if (this.formGroup.get('operation')?.value === EventType.Deposit) {
      this._storeAccount$.dispatch(saveDeposit({depositRequest: request}));
    }
    if (this.formGroup.get('operation')?.value === EventType.Withdraw) {
      this._storeAccount$.dispatch(saveWithdraw({withdrawRequest: request}));
    }
  }

  loadUserAccounts() {
    this._storeAccount$
    .select(selectUserAccountsList)
    .subscribe((accounts) => {
      this._account$ = accounts;
    });
    const userAccountRequest = {
      userId: this.formGroup.get('userId')?.value,
    } as UserAccountRequest;
    this._storeAccount$.dispatch(loadAccountListAction({userAccountRequest}));
  }
}
