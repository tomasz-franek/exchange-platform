import {Component, inject} from '@angular/core';
import {MenuComponent} from '../../menu/menu.component';
import {PropertyCurrencyRow} from '../property-currency-row/property-currency-row';
import {PropertyMenu} from '../property-menu/property-menu';
import {TableModule} from 'primeng/table';
import {TranslatePipe} from '@ngx-translate/core';
import {AccountsStore} from '../../accounts/accounts.signal-store';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-property-withdraw',
  imports: [
    FormsModule,
    MenuComponent,
    PropertyCurrencyRow,
    ReactiveFormsModule,
    PropertyMenu,
    TableModule,
    TranslatePipe
  ],
  templateUrl: './property-withdraw.html',
  styleUrl: './property-withdraw.scss',
})
export class PropertyWithdraw {
  protected readonly store = inject(AccountsStore);

  constructor() {
    this.store.loadWithdrawLimitList();
  }
}
