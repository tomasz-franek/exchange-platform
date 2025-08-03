import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MonitoringComponent} from './monitoring.component';
import {MonitoringNodesComponent} from './monitoring-nodes/monitoring-nodes.component';

const routes: Routes = [
  {path: '', component: MonitoringComponent},
  {path: 'nodes', component: MonitoringNodesComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MonitoringRoutingModule {
}
