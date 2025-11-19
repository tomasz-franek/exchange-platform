import {Component, inject} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {TranslatePipe} from '@ngx-translate/core';
import {UserAccount} from '../../api/model/userAccount';
import {AccountMenu} from '../account-menu/account-menu';
import {MenuComponent} from '../../menu/menu.component';
import {ButtonModule} from 'primeng/button';
import {Select} from 'primeng/select';
import {accountsStore} from '../accounts.signal-store';

@Component({
  selector: 'app-account-edit',
  imports: [FormsModule, ReactiveFormsModule, TranslatePipe, AccountMenu, MenuComponent, ButtonModule, Select],
  templateUrl: './account-edit.component.html',
  styleUrl: './account-edit.component.scss',
  standalone: true
})
export class AccountEditComponent {
  //todo reuse
  protected systemCurrencies: string[] = ['PLN', 'EUR', 'USD', 'GBP', 'CHF'];
  protected readonly formGroup: FormGroup;
  protected readonly store = inject(accountsStore);
  private readonly formBuilder: FormBuilder = inject(FormBuilder);

  constructor() {
    this.formGroup = this.formBuilder.group({
      currency: new FormControl(null, [Validators.required]),
      id: new FormControl('', [])
    });
  }

  createCurrencyAccount() {
    const userAccount: UserAccount = {
      currency: this.formGroup.get('currency')?.value,
      version: 0
    };
    if (this.formGroup.get('id')?.value != '') {
      userAccount.id = this.formGroup.get('id')?.value;
    }
    this.store.saveAccount(userAccount);
  }
}
