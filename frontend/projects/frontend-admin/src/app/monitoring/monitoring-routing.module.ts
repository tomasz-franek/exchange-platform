import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MonitoringComponent} from './monitoring.component';
import {MonitoringNodesComponent} from './monitoring-nodes/monitoring-nodes.component';
import {EffectsModule, provideEffects} from '@ngrx/effects';
import {MonitoringEffects} from './state/monitoring.effects';
import {StoreModule} from '@ngrx/store';
import { Features} from '../../../../shared-modules/src/lib/features';
import {monitoringReducers} from './state/monitoring.reducers';

const routes: Routes = [
  {path: '', component: MonitoringComponent},
  {
    path: 'nodes',
    component: MonitoringNodesComponent,
    providers: [provideEffects(MonitoringEffects)]
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    StoreModule.forFeature(Features.monitoring, monitoringReducers),
    EffectsModule.forFeature([MonitoringEffects]),
  ],
  exports: [RouterModule]
})
export class MonitoringRoutingModule {
}
