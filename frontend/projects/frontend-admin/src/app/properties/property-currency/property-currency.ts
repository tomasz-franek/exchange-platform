import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MenuComponent } from '../../menu/menu.component';
import { PropertyMenu } from '../property-menu/property-menu';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  PropertyState,
  selectSystemCurrencyList,
} from '../state/properties.selectors';
import { loadSystemCurrencyListAction } from '../state/properties.actions';
import { TranslatePipe } from '@ngx-translate/core';
import { SystemCurrency } from '../../api/model/systemCurrency';
import { PropertyCurrencyRow } from '../property-currency-row/property-currency-row';

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
  ],
  styleUrl: './property-currency.css',
})
export class PropertyCurrency implements OnInit {
  protected systemCurrencyList: SystemCurrency[] = [];
  protected readonly formBuilder: FormBuilder = inject(FormBuilder);
  protected readonly encodeURI = encodeURI;
  private readonly router: Router = inject(Router);
  private _storeProperty$: Store<PropertyState> = inject(Store);

  constructor() {}

  ngOnInit() {
    this._storeProperty$
      .select(selectSystemCurrencyList)
      .subscribe((currencyList) => {
        this.systemCurrencyList = currencyList;
      });
    this._storeProperty$.dispatch(loadSystemCurrencyListAction());
  }
}
