import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {StatisticsComponent} from './statistics.component';
import {statisticReducers} from './state/statistic.reducers';
import {Features} from '../features';
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import {StatisticEffects} from './state/statistic.effects';

const routes: Routes = [{path: '', component: StatisticsComponent}];


@NgModule({
  imports: [
    RouterModule.forChild(routes),
    StoreModule.forFeature(Features.statistics, statisticReducers),
    EffectsModule.forFeature([StatisticEffects])
  ],
  exports: [RouterModule]
})
export class StatisticsRoutingModule {
}
