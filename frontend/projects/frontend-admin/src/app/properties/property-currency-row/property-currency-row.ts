import {Component, inject, Input, OnChanges, SimpleChanges} from '@angular/core';
import {SystemCurrency} from '../../api/model/systemCurrency';
import {FormBuilder, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslatePipe} from '@ngx-translate/core';
import {Button} from 'primeng/button';
import {InputNumber} from 'primeng/inputnumber';
import {propertyStore} from '../properties.signal-store';

@Component({
  selector: 'app-property-currency-row',
  templateUrl: './property-currency-row.html',
  styleUrl: './property-currency-row.scss',
  imports: [TranslatePipe, ReactiveFormsModule, Button, InputNumber, FormsModule],
})
export class PropertyCurrencyRow implements OnChanges {
  @Input() systemCurrency: SystemCurrency | undefined = undefined;
  protected minValue: number;
  protected readonly store = inject(propertyStore);
  private readonly formBuilder: FormBuilder = inject(FormBuilder);

  constructor() {
    this.minValue =
      this.systemCurrency != null ? this.systemCurrency.minimumExchange : 0.01;
    // this.formGroup = this.formBuilder.group({
    //   minValue: new FormControl(minValue, [Validators.required]),
    // })
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
      this.store.updateSystemCurrency(systemCurrency);
    }
  }

  updateMinimumValue(event: any) {
    this.minValue = event.value;
  }
}
