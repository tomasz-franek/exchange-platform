import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RatesRoutingModule } from './rates-routing-module';
import { RatesComponent } from './rates.component';
import { RateList } from './rates-list/rate-list';

@NgModule({
  imports: [CommonModule, RatesRoutingModule, RatesComponent, RateList],
})
export class RatesModule {}
