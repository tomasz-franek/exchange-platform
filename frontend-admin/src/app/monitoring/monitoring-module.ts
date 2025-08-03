import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {MonitoringRoutingModule} from './monitoring-routing.module';
import {MonitoringComponent} from './monitoring.component';
import {MonitoringNodesComponent} from './monitoring-nodes/monitoring-nodes.component';


@NgModule({
  imports: [
    CommonModule,
    MonitoringRoutingModule,
    MonitoringComponent,
    MonitoringNodesComponent
  ]
})
export class MonitoringModule {
}
