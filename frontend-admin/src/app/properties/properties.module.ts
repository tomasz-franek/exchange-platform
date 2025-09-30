import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PropertiesRoutingModule } from './properties-routing.module';
import { PropertiesComponent } from './properties.component';
import { TranslatePipe } from '@ngx-translate/core';
import { MenuComponent } from '../menu/menu.component';
import { PropertyMenu } from './property-menu/property-menu';
import { PropertySystem } from './property-system/property-system';
import { PropertyCurrency } from './property-currency/property-currency';
import { PropertyCurrencyRow } from './property-currency-row/property-currency-row';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    PropertiesRoutingModule,
    PropertiesComponent,
    PropertyMenu,
    TranslatePipe,
    MenuComponent,
    PropertySystem,
    PropertyCurrency,
    ReactiveFormsModule,
    PropertyCurrencyRow,
  ],
  exports: [PropertyCurrencyRow],
})
export class PropertiesModule {}
