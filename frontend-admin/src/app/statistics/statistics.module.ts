import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {StatisticsRoutingModule} from './statistics-routing.module';
import {StatisticsComponent} from './statistics.component';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StatisticsRoutingModule,
    StatisticsComponent
  ]
})
export class StatisticsModule {
}
