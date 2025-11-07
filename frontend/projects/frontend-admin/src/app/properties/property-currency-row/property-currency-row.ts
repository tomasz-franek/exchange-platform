import {Component, inject, Input, OnChanges, SimpleChanges} from '@angular/core';
import {SystemCurrency} from '../../api/model/systemCurrency';
import {ReactiveFormsModule} from '@angular/forms';
import {updateSystemCurrencyAction} from '../state/properties.actions';
import {Store} from '@ngrx/store';
import {PropertyState} from '../state/properties.selectors';
import {TranslatePipe} from '@ngx-translate/core';
import {Button} from 'primeng/button';
import {InputNumber} from 'primeng/inputnumber';

@Component({
  selector: 'app-property-currency-row',
  templateUrl: './property-currency-row.html',
  styleUrl: './property-currency-row.css',
  imports: [TranslatePipe, ReactiveFormsModule, Button, InputNumber],
})
export class PropertyCurrencyRow implements OnChanges {
  @Input() systemCurrency: SystemCurrency | undefined = undefined;
  protected minValue: number = 0.01;
  private _storeProperty$: Store<PropertyState> = inject(Store);

  constructor() {
    this.minValue =
      this.systemCurrency != null ? this.systemCurrency.minimumExchange : 0.01;
  }

  ngOnChanges(changes: SimpleChanges) {
    this.minValue = changes['systemCurrency'].currentValue.minimumExchange;
  }

  updateSystemCurrency() {
    if (this.systemCurrency != null) {
      let systemCurrency: SystemCurrency = {
        id: this.systemCurrency.id,
        currency: this.systemCurrency.currency,
        minimumExchange: this.minValue,
      };
      this._storeProperty$.dispatch(
        updateSystemCurrencyAction({systemCurrency}),
      );
    }
  }

  updateMinimumValue(event: any) {
    this.minValue = event.target.valueAsNumber;
  }
}
