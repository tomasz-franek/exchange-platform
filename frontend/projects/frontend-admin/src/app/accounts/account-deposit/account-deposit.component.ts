import { Component, effect, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { EventType } from '../../api/model/eventType';
import { UserAccountOperation } from '../../api/model/userAccountOperation';
import { UserAccount } from '../../api/model/userAccount';
import { MenuComponent } from '../../menu/menu.component';
import { AccountMenu } from '../account-menu/account-menu';
import { UserAccountComponent } from '../../utils/user-account/user-account.component';
import { AccountAmountRequest } from '../../api/model/accountAmountRequest';
import { AmountPipe } from '../../../pipes/amount-pipe/amount.pipe';
import { Select } from 'primeng/select';
import { Button } from 'primeng/button';
import { AccountsStore } from '../accounts.signal-store';
import { Withdraw } from '../../api/model/withdraw';
import { InputText } from 'primeng/inputtext';

@Component({
  selector: 'app-account-deposit',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    TranslatePipe,
    MenuComponent,
    AccountMenu,
    UserAccountComponent,
    AmountPipe,
    Select,
    Button,
    AmountPipe,
    InputText,
  ],
  templateUrl: './account-deposit.component.html',
  styleUrl: './account-deposit.component.scss',
})
export class AccountDepositComponent implements OnInit {
  formGroup: FormGroup;
  protected operations: string[] = [EventType.Deposit, EventType.Withdraw];
  protected readonly store = inject(AccountsStore);
  protected currentLimit: number = 0;
  private readonly formBuilder: FormBuilder = inject(FormBuilder);
  private withdrawLimitList: Withdraw[] = [];

  constructor() {
    this.formGroup = this.formBuilder.group({
      amount: new FormControl(null, [Validators.required]),
      operation: new FormControl('', [Validators.required]),
      userAccount: new FormControl('', [Validators.required]),
      currency: new FormControl('', [Validators.required]),
      maxAmount: new FormControl(0, []),
      correctAmount: new FormControl(true, [Validators.requiredTrue]),
    });
    effect(() => {
      let list = this.store.withdrawLimits();
      if (list) {
        this.withdrawLimitList = list;
      }
    });
  }

  ngOnInit() {
    this.store.loadWithdrawLimitList();
  }

  sendRequest() {
    const userAccount: UserAccount = this.formGroup.get('userAccount')?.value;
    if (userAccount == undefined || userAccount.id == undefined) {
      return;
    }
    const request: UserAccountOperation = {
      amount: this.formGroup.get('amount')?.value,
      userAccountId: userAccount.id,
      currency: userAccount?.currency,
    };
    request.amount = request.amount * 1_0000;
    if (this.formGroup.get('operation')?.value === EventType.Deposit) {
      this.store.saveAccountDeposit(request);
    }
    if (this.formGroup.get('operation')?.value === EventType.Withdraw) {
      this.store.saveWithdrawRequest(request);
    }
  }

  setUserAccount($event: UserAccount) {
    this.formGroup.patchValue({
      userAccount: $event,
      currency: $event.currency,
    });
    this.changedAmount();
    this.loadAccountAmount();
  }

  changeOperation(_: any) {
    this.loadAccountAmount();
  }

  changedAmount() {
    const currency = this.formGroup.get('currency')?.value;
    const amount = this.formGroup.get('amount')?.value;
    const userAccount = this.formGroup.get('userAccount')?.value;
    const operation = this.formGroup.get('operation')?.value;
    if (operation === EventType.Withdraw) {
      if (userAccount && this.currentLimit <= amount * 10000) {
        this.formGroup.patchValue({
          correctAmount: true,
        });
      } else {
        this.formGroup.patchValue({ correctAmount: false });
      }
    } else {
      this.formGroup.patchValue({ correctAmount: true });
      this.currentLimit = 0;
    }
  }

  loadAccountAmount() {
    if (
      this.formGroup.get('userAccount')?.value != undefined &&
      this.formGroup.get('operation')?.value === EventType.Withdraw
    ) {
      const userAccount: UserAccount = this.formGroup.get('userAccount')?.value;
      if (userAccount.id != undefined) {
        let currency = userAccount.currency;
        this.currentLimit =
          this.withdrawLimitList.find((x) => x.currency == currency)?.amount ||
          0;
        const request: AccountAmountRequest = {
          accountId: userAccount.id,
        };
        this.store.loadAccountAmount(request);
        this.formGroup.patchValue({ correctAmount: false });
      }
    } else {
      this.formGroup.patchValue({ maxAmount: 0, correctAmount: true });
      this.formGroup
        .get('amount')
        ?.setValidators([Validators.required, Validators.min(0)]);
    }
  }
}
