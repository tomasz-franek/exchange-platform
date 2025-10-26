import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { UserData } from '../../api/model/userData';
import { Store } from '@ngrx/store';
import {
  AccountState,
  selectUserAccountsList,
  selectUserList,
} from '../../accounts/state/account.selectors';
import { LoadUserRequest } from '../../api/model/loadUserRequest';
import {
  loadAccountListAction,
  loadUserListAction,
} from '../../accounts/state/account.actions';
import { UserAccount } from '../../api/model/userAccount';

@Component({
  selector: 'app-user-account',
  templateUrl: './user-account.component.html',
  imports: [ReactiveFormsModule, TranslatePipe],
  styleUrl: './user-account.component.css',
})
export class UserAccountComponent implements OnInit {
  @Output() userAccountEvent = new EventEmitter<UserAccount>();
  @Output() userEvent = new EventEmitter<UserData>();
  protected readonly formGroup: FormGroup;
  protected _users: UserData[] = [];
  protected _accounts: UserAccount[] = [];
  private readonly formBuilder: FormBuilder = inject(FormBuilder);
  private readonly _storeAccounts$: Store<AccountState> = inject(Store);

  constructor() {
    this.formGroup = this.formBuilder.group({
      userAccountId: new FormControl(null, Validators.required),
      email: new FormControl(null, Validators.required),
      userId: new FormControl(null, Validators.required),
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
    let userId = this.formGroup.get('userId')?.value;
    this.formGroup.patchValue({ userAccountId: undefined });
    this._storeAccounts$
      .select(selectUserAccountsList)
      .subscribe((accounts) => {
        this._accounts = accounts;
      });
    this._storeAccounts$.dispatch(
      loadAccountListAction({
        userAccountRequest: { userId },
      }),
    );
    this.userEvent.emit(this._users.find((e) => e.userId === userId));
  }

  emitUserAccount() {
    let userAccountId = this.formGroup.get('userAccountId')?.value;
    this.userAccountEvent.emit(
      this._accounts.find((e) => e.id === userAccountId),
    );
  }
}
