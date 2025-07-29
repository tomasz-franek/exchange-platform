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
import {
  AccountState,
} from '../../../../../frontend-client/src/app/state/account/account.selectors';
import {EventType} from '../../../../../frontend-client/src/app/api/model/eventType';
import {AccountBalance} from '../../../../../frontend-client/src/app/api/model/accountBalance';
import {AccountMenu} from "../account-menu/account-menu";

@Component({
  selector: 'app-account-deposit',
  imports: [FormsModule, ReactiveFormsModule, TranslatePipe, AccountMenu, AccountMenu],
  templateUrl: './account-deposit.component.html',
  styleUrl: './account-deposit.component.css',
})
export class AccountDepositComponent implements OnInit {
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
    console.log("todo ");
    // this._storeAccount$
    // .select(selectAccountBalanceList)
    // .subscribe((accounts) => {
    //   this._account$ = accounts;
    // });
    // this._storeAccount$.dispatch(loadAccountBalanceListAction());
  }

  sendRequest() {
    // const request: UserAccountOperation = {
    //   amount: this.formGroup.get('amount')?.value,
    //   userAccountId: this.formGroup.get('userAccountId')?.value,
    // };
    // request.amount = request.amount * 1_0000;
    // if (this.formGroup.get('operation')?.value == EventType.Deposit) {
    //   this._storeAccount$.dispatch(saveDeposit({depositRequest: request}));
    // }
    // if (this.formGroup.get('operation')?.value == EventType.Withdraw) {
    //   this._storeAccount$.dispatch(saveWithdraw({withdrawRequest: request}));
    // }
  }
}
