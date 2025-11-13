import {Component, inject} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MenuComponent} from '../../menu/menu.component';
import {PropertyMenu} from '../property-menu/property-menu';
import {TranslatePipe} from '@ngx-translate/core';
import {PropertyCurrencyRow} from '../property-currency-row/property-currency-row';
import {TableModule} from 'primeng/table';
import {propertyStore} from '../properties.signal-store';

@Component({
  selector: 'app-property-currency',
  templateUrl: './property-currency.html',
  imports: [
    FormsModule,
    MenuComponent,
    PropertyMenu,
    ReactiveFormsModule,
    TranslatePipe,
    PropertyCurrencyRow,
    TableModule,
  ],
  styleUrl: './property-currency.scss',
})
export class PropertyCurrency {
  protected readonly store = inject(propertyStore);

  constructor() {
    this.store.loadSystemCurrencyList();
  }
}
