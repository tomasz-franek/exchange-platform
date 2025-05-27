import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { NgForOf } from '@angular/common';
import { Store } from '@ngrx/store';
import { AccountState } from '../state/account/account.selector';
import { saveUserAccount } from '../state/account/account.action';
import { UserAccount } from '../api/model/userAccount';

@Component({
  selector: 'app-account-edit',
  imports: [FormsModule, ReactiveFormsModule, TranslatePipe, NgForOf],
  templateUrl: './account-edit.component.html',
  styleUrl: './account-edit.component.css',
})
export class AccountEditComponent {
  //todo reuse
  protected systemCurrencies: string[] = ['PLN', 'EUR', 'USD', 'GBP', 'CHF'];
  protected readonly formGroup: FormGroup;
  private _storeAccount$: Store<AccountState> = inject(Store);

  constructor(formBuilder: FormBuilder) {
    this.formGroup = formBuilder.group({
      currency: new FormControl(null, [Validators.required]),
      idUser: new FormControl('72aa8932-8798-4d1b-aaf0-590a3e6ffaa5', [
        Validators.required,
      ]),
      id: new FormControl('', []),
    });
  }

  createCurrencyAccount() {
    const userAccount: UserAccount = {
      currency: this.formGroup.get('currency')?.value,
      idUser: this.formGroup.get('idUser')?.value,
    };
    if (this.formGroup.get('id')?.value != '') {
      userAccount.id = this.formGroup.get('id')?.value;
    }
    this._storeAccount$.dispatch(saveUserAccount({ userAccount }));
  }
}
