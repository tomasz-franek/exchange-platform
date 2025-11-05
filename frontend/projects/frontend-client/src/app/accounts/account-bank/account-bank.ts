import {Component, inject, OnInit} from '@angular/core';
import {AccountMenu} from '../account-menu/account-menu';
import {MenuComponent} from '../../menu/menu.component';
import {TranslatePipe} from '@ngx-translate/core';
import {UserBankAccount} from '../../api/model/userBankAccount';
import {Store} from '@ngrx/store';
import {AccountState, selectAccountBalanceList, selectUserBankAccountList} from '../state/account.selectors';
import {
  loadAccountBalanceListAction,
  loadBankAccountListAction,
  saveUserBankAccountAction
} from '../state/account.actions';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {AccountBalance} from '../../api/model/accountBalance';
import {Button} from 'primeng/button';
import {InputText} from 'primeng/inputtext';
import {Select} from 'primeng/select';

@Component({
  selector: 'app-account-bank',
  templateUrl: './account-bank.html',
  styleUrl: './account-bank.css',
  imports: [AccountMenu, MenuComponent, TranslatePipe, FormsModule, ReactiveFormsModule, Button, InputText, Select]
})
export class AccountBankComponent implements OnInit {
  protected _bankAccounts$: UserBankAccount[] = [];
  protected _systemAccounts$: AccountBalance[] = [];
  protected readonly formGroup: FormGroup;
  private _storeAccount$: Store<AccountState> = inject(Store);
  private readonly formBuilder: FormBuilder = inject(FormBuilder);

  constructor() {
    this.formGroup = new FormGroup({
      currency: new FormControl('', [Validators.required]),
      countryCode: new FormControl('', [Validators.required]),
      accountNumber: new FormControl('', [Validators.required])
    });
  }

  ngOnInit() {
    this._storeAccount$.dispatch(loadAccountBalanceListAction());
    this._storeAccount$.select(selectAccountBalanceList).subscribe(account => {
      this._systemAccounts$ = account;
    });
  }

  getDate(date: string) {
    return date.substring(0, 19).replace('T', ' ');
  }

  protected selectCurrency() {
    const currency = this.formGroup.get('currency')?.value;
    if (currency) {
      this._storeAccount$
        .select(selectUserBankAccountList)
        .subscribe((accounts) => {
          this._bankAccounts$ = accounts;
        });

      this._storeAccount$.dispatch(
        loadBankAccountListAction({currency})
      );
    } else {
      this._bankAccounts$ = [];
    }
  }

  protected saveBankAccount() {
    const currency = this.formGroup.get('currency')?.value;
    const account = this._systemAccounts$.find((a) => a.currency === currency);
    if (account != undefined && account.userAccountId !== undefined) {

      const userBankAccount: UserBankAccount = {
        accountNumber: this.formGroup.get('accountNumber')?.value,
        countryCode: this.formGroup.get('countryCode')?.value,
        version: 0,
        userAccountId: account.userAccountId,
        createdDateUtc: new Date().toISOString()
      };
      this._storeAccount$.dispatch(saveUserBankAccountAction({userBankAccount}));
      this._storeAccount$.select(selectUserBankAccountList).subscribe(account => {
        this._bankAccounts$ = account;
      });
    }
  }
}
