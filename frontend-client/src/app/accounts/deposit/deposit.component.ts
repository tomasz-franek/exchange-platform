import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import {
  AccountState,
  selectAccountBalanceList,
} from '../../state/account/account.selectors';
import {
  loadAccountBalanceListAction,
  saveDeposit,
  saveWithdraw,
} from '../../state/account/account.actions';
import { EventType } from '../../api/model/eventType';
import { UserAccountOperation } from '../../api/model/userAccountOperation';
import { AccountBalance } from '../../api/model/accountBalance';

@Component({
  selector: 'app-deposit',
  imports: [FormsModule, ReactiveFormsModule, TranslatePipe],
  templateUrl: './deposit.component.html',
  styleUrl: './deposit.component.css',
  standalone: true,
})
export class DepositComponent implements OnInit {
  formGroup: FormGroup;
  protected _account$: AccountBalance[] = [];
  protected operations: string[] = [EventType.Deposit, EventType.Withdraw];
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
    });
  }

  ngOnInit() {
    this._storeAccount$
      .select(selectAccountBalanceList)
      .subscribe((accounts) => {
        this._account$ = accounts;
      });
    this._storeAccount$.dispatch(loadAccountBalanceListAction());
  }

  sendRequest() {
    let request: UserAccountOperation = {
      amount: this.formGroup.get('amount')?.value,
      userAccountId: this.formGroup.get('userAccountId')?.value,
    };
    request.amount = request.amount * 1_0000;
    if (this.formGroup.get('operation')?.value == EventType.Deposit) {
      this._storeAccount$.dispatch(saveDeposit({ depositRequest: request }));
    }
    if (this.formGroup.get('operation')?.value == EventType.Withdraw) {
      this._storeAccount$.dispatch(saveWithdraw({ withdrawRequest: request }));
    }
  }
}
