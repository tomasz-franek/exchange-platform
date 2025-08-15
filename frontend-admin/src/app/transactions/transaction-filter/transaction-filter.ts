import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { Currency } from '../../api/model/currency';
import { TransactionState } from '../state/transaction.selectors';
import { Store } from '@ngrx/store';
import { User } from '../../api/model/user';
import { selectUserList } from '../../accounts/state/account.selectors';
import { loadUserListAction } from '../../accounts/state/account.actions';
import { LoadUserRequest } from '../../api/model/loadUserRequest';

@Component({
  selector: 'app-transaction-filter',
  templateUrl: './transaction-filter.html',
  imports: [TranslatePipe, ReactiveFormsModule],
  styleUrl: './transaction-filter.css',
})
export class TransactionFilter implements OnInit {
  protected readonly formGroup: FormGroup;
  protected _currencies: Currency[] = Object.values(Currency);
  protected _users: User[] = [];
  private readonly formBuilder: FormBuilder = inject(FormBuilder);
  private readonly _storeTransactions$: Store<TransactionState> = inject(Store);

  constructor() {
    this.formGroup = this.formBuilder.group({
      currency: [null, Validators.required],
      email: [null, Validators.required],
    });
  }

  ngOnInit() {
    this._storeTransactions$
      .select(selectUserList)
      .subscribe((users) => (this._users = users));
    const loadUserRequest = {
      email: this.formGroup.get('email')?.value,
    } as LoadUserRequest;
    this._storeTransactions$.dispatch(loadUserListAction({ loadUserRequest }));
  }
}
