import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgForOf } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import { AccountState } from '../state/account/account.selectors';
import { saveDeposit, saveWithdraw } from '../state/account/account.actions';
import { EventType } from '../api/model/eventType';
import { UserAccountOperation } from '../api/model/userAccountOperation';

@Component({
  selector: 'app-deposit',
  imports: [FormsModule, NgForOf, ReactiveFormsModule, TranslatePipe],
  templateUrl: './deposit.component.html',
  styleUrl: './deposit.component.css',
})
export class DepositComponent {
  formGroup: FormGroup;
  //todo reuse
  protected systemCurrencies: string[] = ['PLN', 'EUR', 'USD', 'GBP', 'CHF'];
  protected operations: string[] = [EventType.Deposit, EventType.Withdraw];
  private _storeAccounts$: Store<AccountState> = inject(Store);

  constructor(private formBuilder: FormBuilder) {
    this.formGroup = this.formBuilder.group({
      amount: new FormControl(0, [Validators.required, Validators.min(0.01)]),
      currency: new FormControl('', [Validators.required]),
      operation: new FormControl('', [Validators.required]),
    });
  }

  sendRequest() {
    let request: UserAccountOperation = {
      userId: '72aa8932-8798-4d1b-aaf0-590a3e6ffaa5',
      currency: this.formGroup.get('currency')?.value,
      value: this.formGroup.get('amount')?.value,
    };
    request.value = request.value * 1_0000;
    if (this.formGroup.get('operation')?.value == EventType.Deposit) {
      this._storeAccounts$.dispatch(saveDeposit({ depositRequest: request }));
    }
    if (this.formGroup.get('operation')?.value == EventType.Withdraw) {
      this._storeAccounts$.dispatch(saveWithdraw({ withdrawRequest: request }));
    }
  }
}
