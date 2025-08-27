import {Component, inject} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators,} from '@angular/forms';
import {TranslatePipe} from '@ngx-translate/core';
import {Store} from '@ngrx/store';
import {saveDeposit, saveWithdraw} from '../state/account.actions';
import {AccountState} from '../state/account.selectors';
import {EventType} from '../../api/model/eventType';
import {UserAccountOperation} from '../../api/model/userAccountOperation';
import {UserAccount} from '../../api/model/userAccount';
import {MenuComponent} from '../../menu/menu.component';
import {AccountMenu} from '../account-menu/account-menu';
import {UserAccountComponent} from '../../utils/user-account/user-account.component';

@Component({
  selector: 'app-account-deposit',
  imports: [FormsModule, ReactiveFormsModule, TranslatePipe, MenuComponent, AccountMenu, UserAccountComponent],
  templateUrl: './account-deposit.component.html',
  styleUrl: './account-deposit.component.css',
})
export class AccountDepositComponent {
  formGroup: FormGroup;
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
      userAccount: new FormControl('', [Validators.required]),
      currency: new FormControl('', [Validators.required]),
    });
  }


  sendRequest() {
    const userAccount: UserAccount = this.formGroup.get('userAccount')?.value;
    if (userAccount == undefined || userAccount.id == undefined) {
      return
    }
    const request: UserAccountOperation = {
      amount: this.formGroup.get('amount')?.value,
      userAccountId: userAccount.id,
      currency: userAccount?.currency
    };
    request.amount = request.amount * 1_0000;
    if (this.formGroup.get('operation')?.value === EventType.Deposit) {
      this._storeAccount$.dispatch(saveDeposit({depositRequest: request}));
    }
    if (this.formGroup.get('operation')?.value === EventType.Withdraw) {
      this._storeAccount$.dispatch(saveWithdraw({withdrawRequest: request}));
    }
  }

  setUserAccount($event: UserAccount) {
    this.formGroup.patchValue({userAccount: $event, currency: $event.currency});
  }
}
