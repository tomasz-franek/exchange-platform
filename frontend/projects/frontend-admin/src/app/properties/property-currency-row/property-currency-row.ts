import {Component, inject, Input, OnChanges, SimpleChanges} from '@angular/core';
import {SystemCurrency} from '../../api/model/systemCurrency';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {TranslatePipe} from '@ngx-translate/core';
import {Button} from 'primeng/button';
import {InputNumber} from 'primeng/inputnumber';
import {propertyStore} from '../properties.signal-store';

@Component({
  selector: 'app-property-currency-row',
  templateUrl: './property-currency-row.html',
  styleUrl: './property-currency-row.scss',
  imports: [TranslatePipe, ReactiveFormsModule, Button, InputNumber],
})
export class PropertyCurrencyRow implements OnChanges {
  @Input() systemCurrency: SystemCurrency | undefined = undefined;
  protected readonly formGroup: FormGroup;
  protected readonly store = inject(propertyStore);
  private readonly formBuilder: FormBuilder = inject(FormBuilder);

  constructor() {
    let minValue =
      this.systemCurrency != null ? this.systemCurrency.minimumExchange : 0.01;
    this.formGroup = this.formBuilder.group({
      minValue: new FormControl(minValue, [Validators.required]),
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    let minValue = changes['systemCurrency'].currentValue.minimumExchange;
    this.formGroup.patchValue({minValue});
  }

  updateSystemCurrency() {
    if (this.systemCurrency != null) {
      let systemCurrency: SystemCurrency = {
        id: this.systemCurrency.id,
        currency: this.systemCurrency.currency,
        minimumExchange: this.formGroup.get('minValue')?.value,
      };
      this.store.updateSystemCurrency(systemCurrency);
    }
  }

  updateMinimumValue(event: any) {
    this.formGroup.patchValue({minValue: event.value});
  }
}
