import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EffectsModule, provideEffects } from '@ngrx/effects';
import { canActivateAuthRole } from '../../services/auth-guard/auth-guard.service';
import { RateEffects } from './state/rate.effects';
import { RatesComponent } from './rates.component';
import { StoreModule } from '@ngrx/store';
import { Features } from '../features';
import { rateReducers } from './state/rate.reducers';
import { RateList } from './rates-list/rate-list';

const routes: Routes = [
  {
    path: '',
    providers: [provideEffects(RateEffects)],
    component: RatesComponent,
    canActivate: [canActivateAuthRole],
    data: { role: 'EXCHANGE_CLIENT' },
  },
  {
    path: 'rate-list',
    providers: [provideEffects(RateEffects)],
    component: RateList,
    canActivate: [canActivateAuthRole],
    data: { role: 'EXCHANGE_CLIENT' },
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    StoreModule.forFeature(Features.rates, rateReducers),
    EffectsModule.forFeature([RateEffects]),
  ],
  exports: [RouterModule],
})
export class RatesRoutingModule {}
