import { Component, inject, OnInit } from '@angular/core';
import { AccountMenu } from '../account-menu/account-menu';
import { MenuComponent } from '../../menu/menu.component';
import { TranslatePipe } from '@ngx-translate/core';
import { UserBankAccount } from '../../api/model/userBankAccount';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { AccountsStore } from '../accounts.signal-store';

@Component({
  selector: 'app-account-bank',
  templateUrl: './account-bank.html',
  styleUrl: './account-bank.scss',
  imports: [
    AccountMenu,
    MenuComponent,
    TranslatePipe,
    FormsModule,
    ReactiveFormsModule,
    Button,
    InputText,
    Select,
    TableModule,
  ],
})
export class AccountBankComponent implements OnInit {
  protected _bankAccounts$: UserBankAccount[] = [];
  protected readonly formGroup: FormGroup;
  protected readonly store = inject(AccountsStore);
  private readonly formBuilder: FormBuilder = inject(FormBuilder);

  constructor() {
    this.formGroup = this.formBuilder.group({
      currency: new FormControl('', [Validators.required]),
      countryCode: new FormControl('', [Validators.required]),
      accountNumber: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit() {
    this.store.loadAccountBalanceList();
  }

  getDate(date: string) {
    return date.substring(0, 19).replace('T', ' ');
  }

  protected selectCurrency() {
    const currency = this.formGroup.get('currency')?.value;
    if (currency) {
      this.store.loadBankAccountList(currency);
    } else {
      this._bankAccounts$ = [];
    }
  }

  protected saveBankAccount() {
    const currency = this.formGroup.get('currency')?.value;
    const account = this.store
      .accountBalanceList()
      .find((a) => a.currency === currency);
    if (account?.userAccountId !== undefined) {
      const userBankAccount: UserBankAccount = {
        accountNumber: this.formGroup.get('accountNumber')?.value,
        countryCode: this.formGroup.get('countryCode')?.value,
        version: 0,
        userAccountId: account.userAccountId,
        createdDateUtc: new Date().toISOString(),
      };
      this.store.saveBankAccount(userBankAccount);
    }
  }
}
