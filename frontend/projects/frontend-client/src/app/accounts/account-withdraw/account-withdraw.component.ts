import { Component, effect, inject, OnInit } from '@angular/core';
import { AccountMenu } from '../account-menu/account-menu';
import { MenuComponent } from '../../menu/menu.component';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { AmountPipe } from '../../../pipes/amount-pipe/amount.pipe';
import { UserAccountOperation } from '../../api/model/userAccountOperation';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { AccountsStore } from '../accounts.signal-store';
import { Withdraw } from '../../api/model/withdraw';

@Component({
  selector: 'app-account-withdraw',
  imports: [
    AccountMenu,
    MenuComponent,
    ReactiveFormsModule,
    TranslatePipe,
    AmountPipe,
    Button,
    InputText,
    Select,
  ],
  templateUrl: './account-withdraw.component.html',
  styleUrl: './account-withdraw.component.scss',
})
export class AccountWithdrawComponent implements OnInit {
  protected readonly formGroup: FormGroup;
  protected readonly store = inject(AccountsStore);
  protected currentLimit: number = 0;
  private readonly formBuilder: FormBuilder = inject(FormBuilder);
  private withdrawLimitList: Withdraw[] = [];

  constructor() {
    this.formGroup = this.formBuilder.group({
      currency: new FormControl(null, [Validators.required]),
      amount: new FormControl(null, [Validators.required]),
      userAccountId: new FormControl(null, [Validators.required]),
      correctAmount: new FormControl(true, [Validators.requiredTrue]),
    });
    effect(() => {
      let list = this.store.withdrawLimits();
      if (list) {
        this.withdrawLimitList = list;
      }
    });
  }

  changeAccount($event: any) {
    let currency = $event.value.currency;
    if ($event) {
      this.formGroup.patchValue({
        userAccountId: $event.value.userAccountId,
        currency,
      });
    }
    this.currentLimit =
      this.withdrawLimitList.find((x) => x.currency == currency)?.amount || 0;
  }

  ngOnInit(): void {
    this.store.loadAccountBalanceList();
    this.store.loadWithdrawLimitList();
  }

  withdrawCurrency() {
    const withdrawRequest = {
      currency: this.formGroup.get('currency')?.value,
      amount: this.formGroup.get('amount')?.value * 10000,
      userAccountId: this.formGroup.get('userAccountId')?.value,
    } as UserAccountOperation;
    this.store.saveWithdrawRequest(withdrawRequest);
  }

  changedAmount() {
    const currency = this.formGroup.get('currency')?.value;
    const amount = this.formGroup.get('amount')?.value;
    const account = this.store
      .accountBalanceList()
      .find((a) => a.currency === currency);
    if (
      account &&
      amount <= account.amount / 10000 &&
      this.currentLimit <= amount * 10000
    ) {
      this.formGroup.patchValue({
        correctAmount: true,
        userAccountId: account.userAccountId,
      });
    } else {
      this.formGroup.patchValue({ correctAmount: false });
    }
  }
}
