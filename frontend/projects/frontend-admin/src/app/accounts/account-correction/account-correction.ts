import {Component, inject} from '@angular/core';
import {AccountMenu} from '../account-menu/account-menu';
import {Button} from 'primeng/button';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {InputNumber} from 'primeng/inputnumber';
import {MenuComponent} from '../../menu/menu.component';
import {TranslatePipe} from '@ngx-translate/core';
import {UserAccountComponent} from '../../utils/user-account/user-account.component';
import {AccountsStore} from '../accounts.signal-store';
import {UserAccount} from '../../api/model/userAccount';
import {UserData} from '../../api/model/userData';
import {CorrectionRequest} from '../../api/model/correctionRequest';

@Component({
  selector: 'app-account-correction',
  imports: [
    AccountMenu,
    Button,
    FormsModule,
    InputNumber,
    MenuComponent,
    ReactiveFormsModule,
    TranslatePipe,
    UserAccountComponent
  ],
  templateUrl: './account-correction.html',
  styleUrl: './account-correction.scss',
})
export class AccountCorrection {
  formGroup: FormGroup;
  protected readonly store = inject(AccountsStore);
  private formBuilder: FormBuilder = inject(FormBuilder);

  constructor() {
    this.formGroup = this.formBuilder.group({
      amount: new FormControl(null, [
        Validators.required,
        Validators.min(0.01),
      ]),
      userId: new FormControl(null, [Validators.required]),
      userAccountId: new FormControl(null, [Validators.required]),
    });
  }

  sendRequest() {
    const request = {
      amount: this.formGroup.get('amount')?.value,
      userId: this.formGroup.get('userId')?.value,
      userAccountId: this.formGroup.get('userAccountId')?.value,
    } as CorrectionRequest;
    request.amount = request.amount * 1_0000;
    this.store.saveCorrectionRequest(request);
  }

  setUser(user: UserData) {
    this.formGroup.patchValue({userId: user.userId, userAccountId: undefined});
  }

  setUserAccount(userAccount: UserAccount) {
    this.formGroup.patchValue({userAccountId: userAccount.id});
  }
}
