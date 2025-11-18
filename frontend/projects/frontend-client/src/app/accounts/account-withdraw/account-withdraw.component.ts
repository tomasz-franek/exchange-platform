import {Component, inject, OnInit} from '@angular/core';
import {AccountMenu} from '../account-menu/account-menu';
import {MenuComponent} from '../../menu/menu.component';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {TranslatePipe} from '@ngx-translate/core';
import {AmountPipe} from '../../../pipes/amount-pipe/amount.pipe';
import {UserAccountOperation} from '../../api/model/userAccountOperation';
import {Button} from 'primeng/button';
import {InputText} from 'primeng/inputtext';
import {Select} from 'primeng/select';
import {accountsStore} from '../accounts.signal-store';

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
    Select
  ],
  templateUrl: './account-withdraw.component.html',
  styleUrl: './account-withdraw.component.scss'
})
export class AccountWithdrawComponent implements OnInit {
  protected readonly formGroup: FormGroup;
  protected readonly store = inject(accountsStore);
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
    this.store.loadAccountBalanceList();
  }

  withdrawCurrency() {
    const withdrawRequest = {
      currency: this.formGroup.get('currency')?.value,
      amount: this.formGroup.get('amount')?.value * 10000,
      userAccountId: this.formGroup.get('userAccountId')?.value
    } as UserAccountOperation;
    this.store.saveWithdrawRequest(withdrawRequest);
  }

  changedAmount() {
    const account = this.store.accountBalanceList().find(a =>
      a.currency === this.formGroup.get('currency')?.value);
    if (account &&
      this.formGroup.get('amount')?.value <= account.amount / 10000) {
      this.formGroup.patchValue({correctAmount: true, userAccountId: account.userAccountId});
    } else {
      this.formGroup.patchValue({correctAmount: false});
    }
  }
}
