import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {MonitoringRoutingModule} from './monitoring-routing.module';
import {MonitoringMenuComponent} from './monitoring-menu/monitoring-menu.component';


@NgModule({
  declarations: [
    MonitoringMenuComponent
  ],
  exports: [
    MonitoringMenuComponent
  ],
  imports: [
    CommonModule,
    MonitoringRoutingModule
  ]
})
export class MonitoringModule {
}
