import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ReportsRoutingModule} from './reports-routing.module';
import {ReportsComponent} from './reports.component';


@NgModule({
  imports: [
    CommonModule,
    ReportsRoutingModule,
    ReportsComponent
  ]
})
export class ReportsModule {
}
