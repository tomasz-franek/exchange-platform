import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { canActivateAuthRole } from '../../services/auth-guard/auth-guard.service';
import { RateEffects } from './state/rate.effects';
import { RatesComponent } from './rates.component';

const routes: Routes = [{
  path: '',
  providers: [provideEffects(RateEffects)],
  component: RatesComponent,
  canActivate: [canActivateAuthRole],
  data: { role: 'EXCHANGE_CLIENT' }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RatesRoutingModule {
}
