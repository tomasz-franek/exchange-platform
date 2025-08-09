import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { canActivateAuthRole } from '../../services/auth-guard/auth-guard.service';
import { PropertiesComponent } from './properties.component';
import { PropertiesEffects } from './state/properties.effects';
import { UserPropertyComponent } from './user-property/user-property.component';
import { AccountEffects } from '../accounts/state/account.effects';
import { UtilEffects } from '../utils/state/util.effects';
import { PropertyAddressComponent } from './property-address/property-address';

const routes: Routes = [
  {
    path: '',
    providers: [provideEffects(PropertiesEffects, UtilEffects)],
    component: PropertiesComponent,
    canActivate: [canActivateAuthRole],
    data: { role: 'EXCHANGE_CLIENT' }
  },
  {
    path: 'user-property',
    providers: [provideEffects(PropertiesEffects, AccountEffects)],
    component: UserPropertyComponent,
    canActivate: [canActivateAuthRole],
    data: { role: 'EXCHANGE_CLIENT' },
  },
  {
    path: 'property-address',
    providers: [provideEffects(PropertiesEffects, AccountEffects)],
    component: PropertyAddressComponent,
    canActivate: [canActivateAuthRole],
    data: { role: 'EXCHANGE_CLIENT' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PropertiesRoutingModule {
}
