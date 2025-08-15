import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { Currency } from '../../api/model/currency';
import { User } from '../../api/model/user';
import { Store } from '@ngrx/store';
import { AccountState, selectUserList } from '../state/account.selectors';
import { LoadUserRequest } from '../../api/model/loadUserRequest';
import { loadUserListAction } from '../state/account.actions';

@Component({
  selector: 'app-account-filter',
  templateUrl: './account-filter.html',
  styleUrl: './account-filter.css',
  imports: [FormsModule, ReactiveFormsModule, TranslatePipe],
})
export class AccountFilter implements OnInit {
  protected readonly formGroup: FormGroup;
  protected _currencies: Currency[] = Object.values(Currency);
  protected _users: User[] = [];
  private readonly formBuilder: FormBuilder = inject(FormBuilder);
  private readonly _storeAccounts$: Store<AccountState> = inject(Store);

  constructor() {
    this.formGroup = this.formBuilder.group({
      currency: [null, Validators.required],
      email: [null, Validators.required],
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
}
