import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgForOf } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import { AccountState } from '../state/accounts/account.selectors';
import {
  sendDepositRequest,
  sendWithdrawRequest,
} from '../state/accounts/account.actions';
import { UserAccountOperationRequest } from '../api';

@Component({
  selector: 'app-deposit',
  imports: [FormsModule, NgForOf, ReactiveFormsModule, TranslatePipe],
  templateUrl: './deposit.component.html',
  styleUrl: './deposit.component.css',
})
export class DepositComponent {
  protected _formGroup: FormGroup;
  protected systemCurrencies: string[] = ['PLN', 'EUR', 'USD', 'GBP', 'CHF'];
  protected operations: string[] = ['Deposit', 'Withdraw'];
  private _storeAccounts$: Store<AccountState> = inject(Store);

  constructor(private formBuilder: FormBuilder) {
    this._formGroup = this.formBuilder.group({
      value: [0, [Validators.required, Validators.min(0.01)]],
      currency: ['', [Validators.required]],
      operation: ['', [Validators.required]],
    });
  }

  get formGroup(): FormGroup {
    return this._formGroup;
  }

  sendRequest() {
    let request: UserAccountOperationRequest = {
      currency: this._formGroup.get('currency')?.value,
      value: this._formGroup.get('value')?.value,
    };
    if (this._formGroup.get('operation')?.value == 'Deposit') {
      this._storeAccounts$.dispatch(
        sendDepositRequest({ depositRequest: request }),
      );
    }
    if (this._formGroup.get('operation')?.value == 'Withdraw') {
      this._storeAccounts$.dispatch(
        sendWithdrawRequest({ withdrawRequest: request }),
      );
    }
  }
}
