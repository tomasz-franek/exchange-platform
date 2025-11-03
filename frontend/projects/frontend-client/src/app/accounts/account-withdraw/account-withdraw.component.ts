import { Component, inject, OnInit } from '@angular/core';
import { AccountMenu } from '../account-menu/account-menu';
import { MenuComponent } from '../../menu/menu.component';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import { AccountState, selectAccountBalanceList } from '../state/account.selectors';
import { loadAccountBalanceListAction, saveWithdrawAction } from '../state/account.actions';
import { AccountBalance } from '../../api/model/accountBalance';
import { AmountPipe } from '../../../pipes/amount-pipe/amount.pipe';
import { UserAccountOperation } from '../../api/model/userAccountOperation';

@Component({
  selector: 'app-account-withdraw',
  imports: [
    AccountMenu,
    MenuComponent,
    ReactiveFormsModule,
    TranslatePipe,
    AmountPipe
  ],
  templateUrl: './account-withdraw.component.html',
  styleUrl: './account-withdraw.component.css'
})
export class AccountWithdrawComponent implements OnInit {
  protected accountBalances: AccountBalance[] = [];
  protected readonly formGroup: FormGroup;
  private readonly _storeAccount$: Store<AccountState> = inject(Store);
  private readonly formBuilder: FormBuilder = inject(FormBuilder);

  constructor() {
    this.formGroup = this.formBuilder.group({
      currency: new FormControl(null, [Validators.required]),
      amount: new FormControl(null, [Validators.required]),
      userAccountId: new FormControl(null, [Validators.required]),
      correctAmount: new FormControl(true, [Validators.requiredTrue])
    });
  }

  ngOnInit(): void {
    this._storeAccount$.select(selectAccountBalanceList).subscribe(accountBalances => {
      this.accountBalances = accountBalances;
    });

    this._storeAccount$.dispatch(loadAccountBalanceListAction());
  }

  withdrawCurrency() {
    const withdrawRequest = {
      currency: this.formGroup.get('currency')?.value,
      amount: this.formGroup.get('amount')?.value * 10000,
      userAccountId: this.formGroup.get('userAccountId')?.value
    } as UserAccountOperation;
    this._storeAccount$.dispatch(saveWithdrawAction({ withdrawRequest }));
  }

  changedAmount() {
    const account = this.accountBalances.find(a =>
      a.currency === this.formGroup.get('currency')?.value);
    if (account &&
      this.formGroup.get('amount')?.value <= account.amount / 10000) {
      this.formGroup.patchValue({ correctAmount: true, userAccountId: account.userAccountId });
    } else {
      this.formGroup.patchValue({ correctAmount: false });
    }
  }
}
