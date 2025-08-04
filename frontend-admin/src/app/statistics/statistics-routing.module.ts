import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {StatisticsComponent} from './statistics.component';
import {statisticReducers} from './state/statistic.reducers';
import {Features} from '../features';
import {StoreModule} from '@ngrx/store';

const routes: Routes = [{path: '', component: StatisticsComponent}];


@NgModule({
  imports: [RouterModule.forChild(routes),
    StoreModule.forFeature(Features.statistics, statisticReducers)],
  exports: [RouterModule]
})
export class StatisticsRoutingModule {
}
