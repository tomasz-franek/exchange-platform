import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ReportsComponent} from './reports.component';
import {StoreModule} from '@ngrx/store';
import {Features} from '../features';
import {reportReducers} from './state/report.reducers';
import {EffectsModule} from '@ngrx/effects';
import {ReportEffects} from './state/report.effects';

const routes: Routes = [{path: '', component: ReportsComponent}];


@NgModule({
  imports: [RouterModule.forChild(routes),
    StoreModule.forFeature(Features.reports, reportReducers),
    EffectsModule.forFeature([ReportEffects])
  ],
  exports: [RouterModule]
})
export class ReportsRoutingModule {
}
