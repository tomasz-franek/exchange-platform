import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {StoreModule} from '@ngrx/store';
import {Features} from '../features';
import {utilReducers} from './state/util.reducers';
import {EffectsModule} from '@ngrx/effects';
import {UtilEffects} from './state/util.effects';

const routes: Routes = [];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    StoreModule.forFeature(Features.utils, utilReducers),
    EffectsModule.forFeature([UtilEffects])
  ],
  exports: [RouterModule]
})
export class UtilsRoutingModule {
}
