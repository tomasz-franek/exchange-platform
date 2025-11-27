import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {canActivateAuthRole} from '../../services/auth-guard/auth-guard.service';
import {RatesComponent} from './rates.component';
import {RateList} from './rates-list/rate-list';

const routes: Routes = [
  {
    path: '',
    component: RatesComponent,
    canActivate: [canActivateAuthRole],
    data: {role: 'EXCHANGE_CLIENT'},
  },
  {
    path: 'rate-list',
    component: RateList,
    canActivate: [canActivateAuthRole],
    data: {role: 'EXCHANGE_CLIENT'},
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
})
export class RatesRoutingModule {
}
