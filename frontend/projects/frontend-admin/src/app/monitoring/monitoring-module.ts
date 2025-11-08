import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {MonitoringRoutingModule} from './monitoring-routing.module';
import {MonitoringComponent} from './monitoring.component';
import {MonitoringNodesComponent} from './monitoring-nodes/monitoring-nodes.component';
import {MonitoringMenuComponent} from './monitoring-menu/monitoring-menu.component';


@NgModule({
  imports: [
    CommonModule,
    MonitoringRoutingModule,
    MonitoringComponent,
    MonitoringNodesComponent,
    MonitoringMenuComponent
  ]
})
export class MonitoringModule {
}
