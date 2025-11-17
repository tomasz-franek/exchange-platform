import {Component, Inject, inject} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {TranslatePipe} from '@ngx-translate/core';
import {EventType} from '../../api/model/eventType';
import {UserAccountOperation} from '../../api/model/userAccountOperation';
import {UserAccount} from '../../api/model/userAccount';
import {MenuComponent} from '../../menu/menu.component';
import {AccountMenu} from '../account-menu/account-menu';
import {UserAccountComponent} from '../../utils/user-account/user-account.component';
import {AccountAmountRequest} from '../../api/model/accountAmountRequest';
import {AmountPipe} from '../../../pipes/amount-pipe/amount.pipe';
import {Select} from 'primeng/select';
import {Button} from 'primeng/button';
import {InputNumber} from 'primeng/inputnumber';
import {accountsStore} from '../accounts.signal-store';

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
    InputNumber,
  ],
  templateUrl: './account-deposit.component.html',
  styleUrl: './account-deposit.component.scss',
})
export class AccountDepositComponent {
  formGroup: FormGroup;
  protected operations: string[] = [EventType.Deposit, EventType.Withdraw];
  protected readonly store = Inject(accountsStore);
  private formBuilder: FormBuilder = inject(FormBuilder);

  constructor() {
    this.formGroup = this.formBuilder.group({
      amount: new FormControl(null, [
        Validators.required,
        Validators.min(0.01),
      ]),
      operation: new FormControl('', [Validators.required]),
      userAccount: new FormControl('', [Validators.required]),
      currency: new FormControl('', [Validators.required]),
      maxAmount: new FormControl(0, []),
    });
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
      this.store.saveAccountDeposit(request)
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
  }

  changeOperation(_: any) {
    this.loadAccountAmount();
  }

  loadAccountAmount() {
    if (
      this.formGroup.get('userAccount')?.value != undefined &&
      this.formGroup.get('operation')?.value === EventType.Withdraw
    ) {
      const userAccount: UserAccount = this.formGroup.get('userAccount')?.value;
      if (userAccount.id != undefined) {
        const request: AccountAmountRequest = {
          accountId: userAccount.id,
        };
        this.store.loadAccountAmount(request);
      }
    } else {
      this.formGroup.patchValue({maxAmount: 0});
      this.formGroup
      .get('amount')
      ?.setValidators([Validators.required, Validators.min(0)]);
    }
  }
}
